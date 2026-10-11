import { Property, Register } from '@io-gui/core'
import {
  AnimationAction,
  AnimationClip,
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
  SkeletonHelper,
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

type GltfModel = {
  scene: Group
  animations: AnimationClip[]
}

type AnimationLoopEvent = {
  type: 'loop'
  action: AnimationAction
  loopDelta: number
}

/**
 * Default crossfade seconds from one action (outer key) to another: the source's four transitions, plus idle <-> run,
 * which the source doesn't offer.
 */
const CROSSFADE_DURATIONS: Record<string, Record<string, number>> = {
  idle: {walk: 0.5, run: 2.5},
  walk: {idle: 1.0, run: 2.5},
  run: {walk: 5.0, idle: 5.0},
}

const loader = new GLTFLoader()

const loadGltf = (url: string) => new Promise<GltfModel>((resolve, reject) => {
  loader.load(url, resolve, undefined, reject)
})

/**
 * The Soldier model crossfading between idle, walk and run. The Document tab has model and skeleton visibility,
 * the crossfade buttons and the actions' effective weights. A live demo (ADR-0009): the timeline is only its clock,
 * so it pauses and steps forward with the timeline, and ignores time going back. Plays when opened.
 */
@Register
export class AnimationSkinningBlendingExample extends Document {

  @Property({type: Boolean, value: true})
  declare showModel: boolean

  @Property({type: Boolean, value: false})
  declare showSkeleton: boolean

  @Property({type: Boolean, value: false})
  declare isActive: boolean

  @Property({type: Boolean, value: false})
  declare isCrossfading: boolean

  /** Effective weights, the blend crossfades produce (`action.weight` stays put while fading). Read-only. */
  @Property({type: Number, value: 0})
  declare idleWeight: number

  @Property({type: Number, value: 0})
  declare walkWeight: number

  @Property({type: Number, value: 0})
  declare runWeight: number

  public camera: PerspectiveCamera
  public model?: Group
  public skeleton?: SkeletonHelper
  public mixer: AnimationMixer = new AnimationMixer(new Group())
  public actions: Record<string, AnimationAction> = {}

  public useDefaultDuration: boolean = true
  public customDuration: number = 3.5

  /** Mixer time at which the running crossfade ends; Infinity while none runs or one waits for a loop end. */
  private crossfadeEnd = Infinity

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    // Camera
    this.camera = new PerspectiveCamera( 45, 1, 1, 100 )
    this.camera.name = 'Camera'
    this.camera.position.set( 1, 2, - 3 )
    this.camera.lookAt( 0, 1, 0 )
    this.scene.add(this.camera)

    // Scene setup
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 10, 50)

    // Lights
    const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 3)
    hemiLight.name = 'Hemisphere'
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    const dirLight = new DirectionalLight(0xffffff, 3)
    dirLight.name = 'Sun'
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
    ground.name = 'Ground'
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add(ground)

    void this.loadModel()
  }

  private async loadModel() {
    const gltf = await loadGltf('https://threejs.org/examples/models/gltf/Soldier.glb')
    const model = gltf.scene
    model.visible = this.showModel
    this.model = model
    this.scene.add(model)

    model.traverse((object) => {
      if ((object as Mesh).isMesh) {
        object.castShadow = true
      }
    })

    this.skeleton = new SkeletonHelper(model)
    this.skeleton.visible = this.showSkeleton
    this.skeleton.userData.selectable = false
    this.scene.add(this.skeleton)

    this.mixer = new AnimationMixer(model)

    this.actions = {
      idle: this.mixer.clipAction(gltf.animations[0]),
      walk: this.mixer.clipAction(gltf.animations[3]),
      run: this.mixer.clipAction(gltf.animations[1]),
    }

    this.setWeight(this.actions.idle, 0)
    this.setWeight(this.actions.walk, 1)
    this.setWeight(this.actions.run, 0)

    this.isActive = true
    this.updateWeights()

    this.notify({kind: 'structure'})
    this.dispatch('frame-object', {object: model}, true)
  }

  showModelChanged() {
    if (this.model) this.model.visible = this.showModel
  }

  showSkeletonChanged() {
    if (this.skeleton) this.skeleton.visible = this.showSkeleton
  }

  isActiveChanged() {
    if (!this.actions.idle) return
    if (this.isActive) {
      Object.values(this.actions).forEach((action: AnimationAction) => action.play())
      this.setWeight(this.actions.idle, 0)
      this.setWeight(this.actions.walk, 1)
      this.setWeight(this.actions.run, 0)
    } else {
      Object.values(this.actions).forEach((action: AnimationAction) => action.stop())
    }
    this.updateWeights()
  }

  idle = () => { this.crossfadeTo('idle') }
  walk = () => { this.crossfadeTo('walk') }
  run = () => { this.crossfadeTo('run') }

  /** The name of the action at full weight; none while blended or inactive. */
  private getCurrentActionName(): string | null {
    for (const [name, action] of Object.entries(this.actions)) {
      if (action.getEffectiveWeight() >= 0.99) {
        return name
      }
    }
    return null
  }

  private crossfadeTo(targetName: string) {
    if (this.isCrossfading) return

    const targetAction = this.actions[targetName]
    if (!targetAction) return

    const startName = this.getCurrentActionName()
    if (!startName || startName === targetName) return
    const startAction = this.actions[startName]

    const duration = this.useDefaultDuration ? CROSSFADE_DURATIONS[startName][targetName] : this.customDuration

    this.isCrossfading = true

    if (startAction === this.actions.idle) {
      this.executeCrossFade(startAction, targetAction, duration)
    } else {
      this.synchronizeCrossFade(startAction, targetAction, duration)
    }
  }

  private synchronizeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    const onLoopFinished = (event: AnimationLoopEvent) => {
      if (event.action === startAction) {
        this.mixer.removeEventListener('loop', onLoopFinished)
        this.executeCrossFade(startAction, endAction, duration)
      }
    }

    this.mixer.addEventListener('loop', onLoopFinished)
  }

  private executeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    endAction.enabled = true
    endAction.time = 0
    endAction.setEffectiveTimeScale(1)
    endAction.setEffectiveWeight(1)
    startAction.crossFadeTo(endAction, duration, true)
    this.crossfadeEnd = this.mixer.time + duration
  }

  /** Fades are scheduled in mixer time, so a crossfade ends when the mixer reaches its end, not after wall-clock seconds. */
  private advanceMixer(delta: number) {
    this.mixer.update(delta)
    if (this.mixer.time >= this.crossfadeEnd) {
      this.crossfadeEnd = Infinity
      this.isCrossfading = false
    }
    this.updateWeights()
  }

  private updateWeights() {
    const weight = (action?: AnimationAction) => action?.isRunning() ? action.getEffectiveWeight() : 0
    this.setProperties({
      idleWeight: weight(this.actions.idle),
      walkWeight: weight(this.actions.walk),
      runWeight: weight(this.actions.run),
    })
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = weight !== 0 ? true : false
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  /**
   * Playback and frame steps forward advance the mixer. Time going back (a loop wrap, scrubbing or stepping back) is
   * ignored: crossfade state only moves forward, like a game clock.
   */
  override onAnimate(delta: number) {
    if (delta > 0) this.advanceMixer(delta)
  }
}

registerEditorConfig(AnimationSkinningBlendingExample, [
  [AnimationMixer, ioObject({expanded: true, properties: ['timeScale']})],
  ['idleWeight', ioNumberSlider({min: 0, max: 1, step: 0.01, disabled: true})],
  ['walkWeight', ioNumberSlider({min: 0, max: 1, step: 0.01, disabled: true})],
  ['runWeight', ioNumberSlider({min: 0, max: 1, step: 0.01, disabled: true})],
])

registerEditorGroups(AnimationSkinningBlendingExample, {
  Main: [
    'showModel',
    'showSkeleton',
    'isActive',
    'mixer',
    'idle',
    'walk',
    'run',
    'idleWeight',
    'walkWeight',
    'runWeight',
    'useDefaultDuration',
    'customDuration',
  ],
  Hidden: [
    'camera',
    'actions',
    'model',
    'skeleton',
    'isCrossfading',
  ],
})
