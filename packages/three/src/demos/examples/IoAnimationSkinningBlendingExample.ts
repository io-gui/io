import { ReactiveProperty, Register } from '@io-gui/core'
import {
  AnimationAction,
  AnimationMixer,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ThreeApplet, IoThreeExample } from '@io-gui/three'
import { ioButton, ioBoolean } from '@io-gui/inputs'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioPropertyEditor } from '@io-gui/editors'

const loader = new GLTFLoader()

@Register
export class AnimationSkinningBlendingExample extends ThreeApplet {

  @ReactiveProperty({type: Boolean, value: false})
  declare isActive: boolean

  @ReactiveProperty({type: Boolean, value: false})
  declare isPlaying: boolean

  public isCrossfading: boolean = false

  public camera: PerspectiveCamera
  public mixer: AnimationMixer = new AnimationMixer(new Group())
  public actions: Record<string, AnimationAction> = {}

  public stepSize: number = 0.05

  public useDefaultDuration: boolean = true
  public customDuration: number = 3.5

  constructor() {
    super()

    // Camera
    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 )
    this.camera.position.set( 1, 2, - 3 )
    this.camera.lookAt( 0, 1, 0 )
    this.scene.add(this.camera)

    // Scene setup
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 10, 50)

    // Lights
    const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 3)
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    const dirLight = new DirectionalLight(0xffffff, 3)
    dirLight.position.set(-3, 10, -10)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 2
    dirLight.shadow.camera.bottom = -2
    dirLight.shadow.camera.left = -2
    dirLight.shadow.camera.right = 2
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 40
    this.scene.add(dirLight)

    const ground = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshPhongMaterial({color: 0xcbcbcb, depthWrite: false})
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    void this.loadModel()
  }

  private async loadModel() {
    loader.load('https://threejs.org/examples/models/gltf/Soldier.glb', (gltf) => {
      const model = gltf.scene as Group
      this.scene.add(model)

      model.traverse((object) => {
        if ((object as Mesh).isMesh) {
          object.castShadow = true
        }
      })

      this.mixer = new AnimationMixer(model)

      this.actions = {
        idle: this.mixer.clipAction(gltf.animations[0]),
        walk: this.mixer.clipAction(gltf.animations[3]),
        run: this.mixer.clipAction(gltf.animations[1]),
      }

      this.setWeight(this.actions.idle, 0)
      this.setWeight(this.actions.walk, 1)
      this.setWeight(this.actions.run, 0)

      this.setProperties({
        isActive: true,
        isPlaying: true,
      })

      this.dispatch('frame-object', {object: model}, true)
    })
  }

  isActiveChanged() {
    if (this.isActive) {
      Object.values(this.actions).forEach((action: AnimationAction) => action.play())
      this.setWeight(this.actions.idle, 0)
      this.setWeight(this.actions.walk, 1)
      this.setWeight(this.actions.run, 0)
    } else {
      Object.values(this.actions).forEach((action: AnimationAction) => action.stop())
    }
  }

  idle = () => { this.crossfadeTo('idle', 1.0) }
  walk = () => { this.crossfadeTo('walk', 0.5) }
  run = () => { this.crossfadeTo('run', 2.5) }

  public makeSingleStep = () => {
    if (this.mixer && !this.isPlaying) {
      this.mixer.update(this.stepSize)
    }
  }

  private getCurrentAction(): AnimationAction | null {
    for (const action of Object.values(this.actions)) {
      if (action.getEffectiveWeight() >= 0.99) {
        return action
      }
    }
    return null
  }

  private crossfadeTo(targetName: string, defaultDuration: number) {
    if (this.isCrossfading) return

    const targetAction = this.actions[targetName]
    if (!targetAction) return

    const startAction = this.getCurrentAction()
    if (!startAction || startAction === targetAction) return

    const duration = this.useDefaultDuration ? defaultDuration : this.customDuration

    this.isCrossfading = true
    this.isPlaying = true

    if (startAction === this.actions.idle) {
      this.executeCrossFade(startAction, targetAction, duration)
    } else {
      this.synchronizeCrossFade(startAction, targetAction, duration)
    }
  }

  private synchronizeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    if (!this.mixer) return

    const onLoopFinished = (event: {action: AnimationAction}) => {
      if (event.action === startAction) {
        this.mixer.removeEventListener('loop', onLoopFinished as any)
        this.executeCrossFade(startAction, endAction, duration)
      }
    }

    this.mixer.addEventListener('loop', onLoopFinished as any)
  }

  private executeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    endAction.enabled = true
    endAction.time = 0
    endAction.setEffectiveTimeScale(1)
    endAction.setEffectiveWeight(1)
    startAction.crossFadeTo(endAction, duration, true)

    setTimeout(() => {
      this.isCrossfading = false
      startAction.setEffectiveWeight(0)
      startAction.enabled = false
    }, duration * 1000)
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = weight !== 0 ? true : false
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  onAnimate(delta: number) {
    if (!this.mixer) return

    debug: {
      this.dispatchMutation(this.actions.idle)
      this.dispatchMutation(this.actions.walk)
      this.dispatchMutation(this.actions.run)
      this.dispatchMutation(this.mixer)
    }

    if (this.isPlaying) {
      this.mixer.update(delta)
    }
  }
}

@Register
export class IoAnimationSkinningBlendingExample extends IoThreeExample {

  @ReactiveProperty({type: AnimationSkinningBlendingExample, init: null})
  declare applet: AnimationSkinningBlendingExample

  // init() {
  //   this.uiConfig = [
  //     ['isPlaying', ioBoolean({label: '_hidden_', true: 'io:circle_pause', false: 'io:circle_fill_arrow_right'})],
  //     ['makeSingleStep', ioButton({label: 'Make Single Step'})],
  //     ['stepSize', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  //     ['actions', ioPropertyEditor({label: '_hidden_'})],
  //   ]

  //   this.uiGroups = {
  //     Main: [
  //       'isActive',
  //       'isPlaying',
  //       'mixer',
  //       'actions',
  //       'idle',
  //       'walk',
  //       'run',
  //       'useDefaultDuration',
  //       'customDuration',
  //       'stepSize',
  //       'makeSingleStep',
  //     ],
  //     Hidden: [
  //       'scene',
  //       'camera',
  //     ],
  //   }
  // }
}

export const ioAnimationSkinningBlendingExample = IoAnimationSkinningBlendingExample.vConstructor
