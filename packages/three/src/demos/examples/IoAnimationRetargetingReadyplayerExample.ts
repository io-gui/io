import { ReactiveProperty, Register } from '@io-gui/core'
import {
  AnimationMixer,
  BoxGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  NodeMaterial,
  Skeleton,
  SkeletonHelper,
} from 'three/webgpu'
import {
  color,
  screenUV,
  vec2,
  vec4,
  reflector,
  positionWorld,
} from 'three/tsl'
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import { ThreeApplet, IoThreeExample } from '@io-gui/three'
import { ioPropertyEditor } from '@io-gui/editors'

const gltfLoader = new GLTFLoader()
const fbxLoader = new FBXLoader()

@Register
export class AnimationRetargetingReadyplayerExample extends ThreeApplet {

  @ReactiveProperty({type: AnimationMixer, init: new Group()})
  declare public sourceMixer: AnimationMixer

  @ReactiveProperty({type: AnimationMixer, init: new Group()})
  declare public targetMixer: AnimationMixer

  constructor() {
    super()

    const horizontalEffect = screenUV.x.mix(color(0x13172b), color(0x311649))
    const lightEffect = screenUV.distance(vec2(0.5, 1.0)).oneMinus().mul(color(0x0c5d68))
    this.scene.backgroundNode = horizontalEffect.add(lightEffect)

    const light = new HemisphereLight(0x311649, 0x0c5d68, 10)
    this.scene.add(light)

    const backLight = new DirectionalLight(0xffffff, 10)
    backLight.position.set(0, 5, -5)
    this.scene.add(backLight)

    const keyLight = new DirectionalLight(0xfff9ea, 4)
    keyLight.position.set(3, 5, 3)
    this.scene.add(keyLight)

    const reflection = reflector()
    reflection.target.rotateX(-Math.PI / 2)
    this.scene.add(reflection.target)

    const reflectionMask = positionWorld.xz.distance(0).mul(.1).clamp().oneMinus()

    const floorMaterial = new NodeMaterial()
    floorMaterial.colorNode = vec4(reflection.rgb, reflectionMask)
    floorMaterial.opacity = .2
    floorMaterial.transparent = true

    const floor = new Mesh(new BoxGeometry(50, .001, 50), floorMaterial)
    floor.receiveShadow = true
    floor.position.set(0, 0, 0)
    this.scene.add(floor)

    void this.loadModels()
  }

  private async loadModels() {
    const [sourceModel, targetModel]: [Group, GLTF] = await Promise.all([
      new Promise((resolve, reject) => {
        fbxLoader.load('https://threejs.org/examples/models/fbx/mixamo.fbx', resolve as (group: Group) => void, undefined, reject)
      }),
      new Promise((resolve, reject) => {
        gltfLoader.load('https://threejs.org/examples/models/gltf/readyplayer.me.glb', resolve as (gltf: GLTF) => void, undefined, reject)
      })
    ]) as [Group, GLTF]

    const models = new Group()
    models.add(sourceModel)
    models.add(targetModel.scene)
    this.scene.add(models)

    sourceModel.position.x -= .9
    targetModel.scene.position.x += .9

    sourceModel.scale.setScalar(.01)

    const source = this.getSource(sourceModel)
    this.sourceMixer = source.mixer
    this.targetMixer = this.retargetModel(source, targetModel)

    this.dispatch('frame-object', {object: models, overscan: 1.5}, true)
  }

  private getSource(sourceModel: any) {
    const clip = sourceModel.animations[0]
    const helper = new SkeletonHelper(sourceModel)
    const skeleton = new Skeleton(helper.bones)
    const mixer = new AnimationMixer(sourceModel)
    mixer.clipAction(sourceModel.animations[0]).play()

    return { clip, skeleton, mixer }
  }

  private retargetModel(sourceModel: any, targetModel: any) {
    const targetSkin = targetModel.scene.children[0].children[1]

    const retargetOptions = {
      // specify the name of the source's hip bone
      hip: 'mixamorigHips',

      // preserve the scale of the target model
      scale: .01,

      // Map of target's bone names to source's bone names
      getBoneName: function (bone: any) {
        return 'mixamorig' + bone.name
      }
    }

    const retargetedClip = SkeletonUtils.retargetClip(targetSkin, sourceModel.skeleton, sourceModel.clip, retargetOptions)

    const mixer = new AnimationMixer(targetSkin)
    mixer.clipAction(retargetedClip).play()

    return mixer
  }

  onAnimate(delta: number) {

    if (this.sourceMixer) {
      this.sourceMixer.update(delta)
    }

    if (this.targetMixer) {
      this.targetMixer.update(delta)
    }

    debug: {
      this.dispatchMutation(this.sourceMixer)
      this.dispatchMutation(this.targetMixer)
    }
  }
}

@Register
export class IoAnimationRetargetingReadyplayerExample extends IoThreeExample {

  @ReactiveProperty({type: AnimationRetargetingReadyplayerExample, init: null})
  declare applet: AnimationRetargetingReadyplayerExample

  // init() {
  //   this.uiConfig = [
  //     ['sourceMixer', ioPropertyEditor({label: '_hidden_'})],
  //     ['targetMixer', ioPropertyEditor({label: '_hidden_'})],
  //   ]
  // }
}

export const ioAnimationRetargetingReadyplayerExample = IoAnimationRetargetingReadyplayerExample.vConstructor
