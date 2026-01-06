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
import { ThreeApplet } from '@io-gui/three'
import { ioButton, ioBoolean } from '@io-gui/inputs'
import { ioPropertyEditor } from '@io-gui/editors'

const loader = new GLTFLoader()

@Register
export class AnimationSkinningBlendingExample extends ThreeApplet {

  @ReactiveProperty({type: Boolean, value: false})
  declare isActive: boolean

  @ReactiveProperty({type: Boolean, value: false})
  declare isPlaying: boolean

  public camera: PerspectiveCamera
  public mixer: AnimationMixer = new AnimationMixer(new Group())
  public actions: Record<string, AnimationAction> = {}

  // Playback
  public stepSize: number = 0.05

  // Crossfading
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

    this.uiConfig = [
      ['isPlaying', ioBoolean({true: 'io:circle_pause', false: 'io:circle_fill_arrow_right'})],
      ['makeSingleStep', ioButton({label: 'Make Single Step'})],
      ['actions', ioPropertyEditor()],
      [AnimationAction, ioPropertyEditor({groups: {
        Playback: [
          'isActive',
          'isPlaying',
          'stepSize',
          'makeSingleStep',
        ],
        Crossfade: [
          'actions',
          'walk',
          'run',
          'idle',
          'useDefaultDuration',
          'customDuration',
        ],
        Scene: [
          'camera',
        ],
        Rendering: []
      }})],
      [AnimationMixer, ioPropertyEditor({groups: {Hidden: ['stats']}})],
    ]

    this.uiGroups = {
      Playback: [
        'isActive',
        'isPlaying',
        'stepSize',
        'makeSingleStep',
      ],
      Crossfade: [
        'actions',
        'walk',
        'run',
        'idle',
        'useDefaultDuration',
        'customDuration',
      ],
      Scene: [
        'camera',
      ],
      Rendering: [],
      Hidden: [],
    }

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

      this.setProperties({
        isActive: true,
        isPlaying: true,
      })

      this.dispatch('scene-ready', {scene: this.scene}, true)
    })
  }

  isActiveChanged() {
    if (this.isActive) {
      Object.values(this.actions).forEach((action: AnimationAction) => action.play())
    } else {
      Object.values(this.actions).forEach((action: AnimationAction) => action.stop())
    }
  }

  idle = () => { this.prepareCrossFade(this.actions.idle, this.actions.walk, 1.0) }
  walk = () => { this.prepareCrossFade(this.actions.walk, this.actions.run, 0.5) }
  run = () => { this.prepareCrossFade(this.actions.run, this.actions.idle, 2.5) }

  public makeSingleStep = () => {
    if (this.mixer && !this.isPlaying) {
      this.mixer.update(this.stepSize)
    }
  }

  private prepareCrossFade(startAction: AnimationAction, endAction: AnimationAction, defaultDuration: number) {

    const duration = this.setCrossFadeDuration(defaultDuration)

    this.isPlaying = true

    if (startAction === this.actions.idle) {
      this.executeCrossFade(startAction, endAction, duration)
    } else {
      this.synchronizeCrossFade(startAction, endAction, duration)
    }
  }

  private setCrossFadeDuration(defaultDuration: number): number {
    if (this.useDefaultDuration) {
      return defaultDuration
    } else {
      return this.customDuration as number
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
    this.setWeight(endAction, 1)
    endAction.time = 0
    startAction.crossFadeTo(endAction, duration, true)
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true
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