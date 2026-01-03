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
  NormalAnimationBlendMode,
  PerspectiveCamera,
  PlaneGeometry,
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ThreeApplet } from '@io-gui/three'
import { ioNumberSlider, ioSlider } from '@io-gui/sliders'
import { ioSwitch, ioButton, ioBoolean } from '@io-gui/inputs'
import { ioPropertyEditor, ioObject, registerEditorGroups } from '@io-gui/editors'
import { MenuOption, ioOptionSelect } from '@io-gui/menus'

const loader = new GLTFLoader()

@Register
export class AnimationSkinningBlendingExample extends ThreeApplet {

  @ReactiveProperty({type: Boolean, value: false})
  declare isActive: boolean

  @ReactiveProperty({type: Boolean, value: false})
  declare isPlaying: boolean

  public camera: PerspectiveCamera
  public model?: Group
  public mixer?: AnimationMixer

  public idleAction?: AnimationAction
  public walkAction?: AnimationAction
  public runAction?: AnimationAction
  public actions: AnimationAction[] = []

  // Pausing/Stepping
  public stepSize: number = 0.05
  // Crossfading
  public useDefaultDuration: boolean = true
  public customDuration: number = 3.5
  // Blend Weights
  public idleWeight: number = 0
  public walkWeight: number = 1
  public runWeight: number = 0
  // General Speed
  public timeScale: number = 1

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

    this.uiConfig = new Map([
      [Object, [
        ['isPlaying', ioBoolean({true: 'io:circle_pause', false: 'io:circle_fill_arrow_right'})],
        ['makeSingleStep', ioButton({label: 'Make Single Step'})],
        ['idleWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
        ['walkWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
        ['runWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
        [AnimationAction, ioObject({
          config: new Map([
            [AnimationAction, [
              ['blendMode', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
                {value: 2501, id: 'Additive'},
                {value: 2500, id: 'Normal'},
                {value: 2502, id: 'Additive2'},
                {value: 2503, id: 'Additive3'},
              ]})})],
              //AnimationBlendMode
              ['weight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
            ]],
          ]),
          groups: new Map([
            [AnimationAction, {
              Main: ['name', 'weight', 'time', 'timeScale', 'effectiveWeight', 'effectiveTimeScale'],
              Hidden: ['loop'],
            }],
          ]),
        })],
      ]],
    ])

    void this.loadModel()
  }

  private async loadModel() {
    loader.load('https://threejs.org/examples/models/gltf/Soldier.glb', (gltf) => {
      this.model = gltf.scene as Group
      this.scene.add(this.model)

      this.model.traverse((object) => {
        if ((object as Mesh).isMesh) {
          object.castShadow = true
        }
      })

      this.mixer = new AnimationMixer(this.model)

      this.idleAction = this.mixer.clipAction(gltf.animations[0])
      this.walkAction = this.mixer.clipAction(gltf.animations[3])
      this.runAction = this.mixer.clipAction(gltf.animations[1])

      this.actions = [this.idleAction, this.walkAction, this.runAction]

      this.isActive = true
      this.isPlaying = true

      this.dispatchMutation()
      this.dispatch('scene-ready', {scene: this.scene}, true)
    })
  }
  
  isActiveChanged() {
    if (this.isActive) {
      this.setWeight(this.idleAction!, this.idleWeight as number)
      this.setWeight(this.walkAction!, this.walkWeight as number)
      this.setWeight(this.runAction!, this.runWeight as number)  
      this.actions.forEach((action) => action.play())
    } else {
      this.actions.forEach((action) => action.stop())
    }

  }

  idle = () => { this.prepareCrossFade(this.idleAction!, 1.0) }
  walk = () => { this.prepareCrossFade(this.walkAction!, 0.5) }
  run = () => { this.prepareCrossFade(this.runAction!, 2.5) }

  public makeSingleStep = () => {
    if (this.mixer && !this.isPlaying) {
      this.mixer.update(this.stepSize)
    }
  }

  private prepareCrossFade(action: AnimationAction, defaultDuration: number) {
    if (!this.mixer) return

    // const duration = this.setCrossFadeDuration(defaultDuration)

    // // this.unpause()

    // if (startAction === this.idleAction) {
    //   this.executeCrossFade(startAction, endAction, duration)
    // } else {
    //   this.synchronizeCrossFade(startAction, endAction, duration)
    // }
  }

  // private setCrossFadeDuration(defaultDuration: number): number {
  //   if (this.useDefaultDuration) {
  //     return defaultDuration
  //   } else {
  //     return this.customDuration as number
  //   }
  // }

  // private synchronizeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
  //   if (!this.mixer) return

  //   const onLoopFinished = (event: {action: AnimationAction}) => {
  //     if (event.action === startAction) {
  //       this.mixer!.removeEventListener('loop', onLoopFinished as any)
  //       this.executeCrossFade(startAction, endAction, duration)
  //     }
  //   }

  //   this.mixer.addEventListener('loop', onLoopFinished as any)
  // }

  // private executeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
  //   this.setWeight(endAction, 1)
  //   endAction.time = 0
  //   startAction.crossFadeTo(endAction, duration, true)
  // }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  onAnimate(delta: number) {
    if (!this.mixer) return

    debug: {
      this.dispatchMutation(this.idleAction)
      this.dispatchMutation(this.walkAction)
      this.dispatchMutation(this.runAction)
    }
    // this.dispatchMutation(this.options)

    if (this.isPlaying) {
      this.mixer.update(delta)
    }
  }
}

registerEditorGroups(AnimationSkinningBlendingExample, {
  Playback: [
    'isActive',
    'isPlaying',
    'stepSize',
    'makeSingleStep',
  ],
  Crossfade: [
    'idleAction',
    'walkAction',
    'runAction',
    'walk',
    'run',
    'idle',
    'useDefaultDuration',
    'customDuration',
  ],
  'General Speed': [
    'timeScale',
  ],
  Rendering: [],
  Scene: [
    'camera',
    'model',
  ],
  Hidden: [
    'mixer',
    'actions',
    'singleStepMode',
    'sizeOfNextStep',
  ],
})
