import { ReactiveProperty, Register } from '@io-gui/core'
import {
  AnimationAction,
  AnimationMixer,
  AnimationUtils,
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
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three'

const loader = new GLTFLoader()

interface ActionSettings {
  weight: number
  action?: AnimationAction
}

@Register
export class AnimationSkinningAdditiveBlendingExample extends ThreeApplet {

  @ReactiveProperty({type: Boolean, value: false})
  declare isLoaded: boolean

  @ReactiveProperty({type: Boolean, value: false})
  declare showSkeleton: boolean

  @ReactiveProperty({type: Number, value: 1})
  declare timeScale: number

  // Additive action weights
  @ReactiveProperty({type: Number, value: 0})
  declare sneakPoseWeight: number

  @ReactiveProperty({type: Number, value: 0})
  declare sadPoseWeight: number

  @ReactiveProperty({type: Number, value: 0})
  declare agreeWeight: number

  @ReactiveProperty({type: Number, value: 0})
  declare headShakeWeight: number

  public camera: PerspectiveCamera
  public mixer: AnimationMixer = new AnimationMixer(new Group())
  public skeleton: SkeletonHelper | null = null

  public currentBaseAction: string = 'idle'
  public allActions: AnimationAction[] = []

  public baseActions: Record<string, ActionSettings> = {
    idle: { weight: 1 },
    walk: { weight: 0 },
    run: { weight: 0 },
  }

  public additiveActions: Record<string, ActionSettings> = {
    sneak_pose: { weight: 0 },
    sad_pose: { weight: 0 },
    agree: { weight: 0 },
    headShake: { weight: 0 },
  }

  constructor(args: ThreeAppletProps) {
    super(args)

    // Camera
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100)
    this.camera.position.set(-1, 2, 3)
    this.camera.lookAt(0, 1, 0)
    this.scene.add(this.camera)

    // Scene setup
    this.scene.background = new Color(0xa0a0a0)
    this.scene.fog = new Fog(0xa0a0a0, 10, 50)

    // Lights
    const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 3)
    hemiLight.position.set(0, 20, 0)
    this.scene.add(hemiLight)

    const dirLight = new DirectionalLight(0xffffff, 3)
    dirLight.position.set(3, 10, 10)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 2
    dirLight.shadow.camera.bottom = -2
    dirLight.shadow.camera.left = -2
    dirLight.shadow.camera.right = 2
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 40
    this.scene.add(dirLight)

    const ground = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshPhongMaterial({color: 0xcbcbcb, depthWrite: false})
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    void this.loadModel()
  }

  private async loadModel() {
    loader.load('https://threejs.org/examples/models/gltf/Xbot.glb', (gltf) => {
      const model = gltf.scene as Group
      this.scene.add(model)

      model.traverse((object) => {
        if ((object as Mesh).isMesh) {
          object.castShadow = true
        }
      })

      this.skeleton = new SkeletonHelper(model)
      this.skeleton.visible = this.showSkeleton
      this.scene.add(this.skeleton)

      this.mixer = new AnimationMixer(model)
      const animations = gltf.animations

      for (let i = 0; i < animations.length; i++) {
        let clip = animations[i]
        const name = clip.name

        if (this.baseActions[name]) {
          const action = this.mixer.clipAction(clip)
          this.activateAction(action)
          this.baseActions[name].action = action
          this.allActions.push(action)
        } else if (this.additiveActions[name]) {
          // Make the clip additive and remove the reference frame
          AnimationUtils.makeClipAdditive(clip)

          if (clip.name.endsWith('_pose')) {
            clip = AnimationUtils.subclip(clip, clip.name, 2, 3, 30)
          }

          const action = this.mixer.clipAction(clip)
          this.activateAction(action)
          this.additiveActions[name].action = action
          this.allActions.push(action)
        }
      }

      this.setProperties({
        isLoaded: true,
      })

      this.dispatch('frame-object', {object: model}, true)
    })
  }

  private activateAction(action: AnimationAction) {
    const clip = action.getClip()
    const settings = this.baseActions[clip.name] || this.additiveActions[clip.name]
    this.setWeight(action, settings.weight)
    action.play()
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  showSkeletonChanged() {
    if (this.skeleton) {
      this.skeleton.visible = this.showSkeleton
    }
  }

  timeScaleChanged() {
    this.mixer.timeScale = this.timeScale
  }

  // Additive weight change handlers
  sneakPoseWeightChanged() {
    const settings = this.additiveActions['sneak_pose']
    if (settings.action) {
      this.setWeight(settings.action, this.sneakPoseWeight)
      settings.weight = this.sneakPoseWeight
    }
  }

  sadPoseWeightChanged() {
    const settings = this.additiveActions['sad_pose']
    if (settings.action) {
      this.setWeight(settings.action, this.sadPoseWeight)
      settings.weight = this.sadPoseWeight
    }
  }

  agreeWeightChanged() {
    const settings = this.additiveActions['agree']
    if (settings.action) {
      this.setWeight(settings.action, this.agreeWeight)
      settings.weight = this.agreeWeight
    }
  }

  headShakeWeightChanged() {
    const settings = this.additiveActions['headShake']
    if (settings.action) {
      this.setWeight(settings.action, this.headShakeWeight)
      settings.weight = this.headShakeWeight
    }
  }

  // Base action crossfade triggers
  idle = () => { this.prepareCrossFade('idle') }
  walk = () => { this.prepareCrossFade('walk') }
  run = () => { this.prepareCrossFade('run') }

  private prepareCrossFade(targetName: string) {
    const currentSettings = this.baseActions[this.currentBaseAction]
    const currentAction = currentSettings?.action || null
    const targetSettings = this.baseActions[targetName]
    const targetAction = targetSettings?.action || null

    if (currentAction === targetAction) return

    const duration = 0.35

    if (this.currentBaseAction === 'idle' || !currentAction || !targetAction) {
      this.executeCrossFade(currentAction, targetAction, duration)
    } else {
      this.synchronizeCrossFade(currentAction, targetAction, duration)
    }

    this.currentBaseAction = targetAction ? targetName : 'None'
  }

  private synchronizeCrossFade(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    const onLoopFinished = (event: {action: AnimationAction}) => {
      if (event.action === startAction) {
        this.mixer.removeEventListener('loop', onLoopFinished as any)
        this.executeCrossFade(startAction, endAction, duration)
      }
    }

    this.mixer.addEventListener('loop', onLoopFinished as any)
  }

  private executeCrossFade(startAction: AnimationAction | null, endAction: AnimationAction | null, duration: number) {
    if (endAction) {
      this.setWeight(endAction, 1)
      endAction.time = 0

      if (startAction) {
        startAction.crossFadeTo(endAction, duration, true)
      } else {
        endAction.fadeIn(duration)
      }
    } else if (startAction) {
      startAction.fadeOut(duration)
    }
  }

  onAnimate(delta: number) {
    if (!this.isLoaded || !this.mixer) return

    // Update effective weights for UI feedback
    for (const action of this.allActions) {
      const clip = action.getClip()
      const settings = this.baseActions[clip.name] || this.additiveActions[clip.name]
      if (settings) {
        settings.weight = action.getEffectiveWeight()
      }
    }

    this.mixer.update(delta)
  }
}

@Register
export class IoAnimationSkinningAdditiveBlendingExample extends IoThreeExample {

  @ReactiveProperty({type: AnimationSkinningAdditiveBlendingExample, init: {playing: true}})
  declare applet: AnimationSkinningAdditiveBlendingExample

  // init() {
  //   this.uiConfig = [
  //     ['showSkeleton', ioBoolean({label: 'Show Skeleton'})],
  //     ['timeScale', ioNumberSlider({min: 0, max: 1.5, step: 0.01})],
  //     ['sneakPoseWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  //     ['sadPoseWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  //     ['agreeWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  //     ['headShakeWeight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  //   ]

  //   this.uiGroups = {
  //     Main: [
  //       'isLoaded',
  //       'showSkeleton',
  //       'timeScale',
  //     ],
  //     'Base Actions': [
  //       'idle',
  //       'walk',
  //       'run',
  //     ],
  //     'Additive Weights': [
  //       'sneakPoseWeight',
  //       'sadPoseWeight',
  //       'agreeWeight',
  //       'headShakeWeight',
  //     ],
  //     Hidden: [
  //       'scene',
  //       'camera',
  //       'mixer',
  //       'allActions',
  //       'baseActions',
  //       'additiveActions',
  //       'currentBaseAction',
  //       'skeleton',
  //     ],
  //   }
  // }
}

export const ioAnimationSkinningAdditiveBlendingExample = IoAnimationSkinningAdditiveBlendingExample.vConstructor
