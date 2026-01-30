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
  PlaneGeometry,
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ThreeApplet, IoThreeExample, ThreeAppletProps, ioThreeViewport } from '@io-gui/three'
import { ioSplit, Split } from '@io-gui/layout'
import { ioObject, ioPropertyEditor } from '@io-gui/editors'

const loader = new GLTFLoader()

@Register
export class AnimationSkinningAdditiveBlendingExample extends ThreeApplet {

  @ReactiveProperty({type: Boolean, value: false})
  declare isLoaded: boolean

  public mixer: AnimationMixer = new AnimationMixer(new Group())

  public currentBaseAction: string = 'idle'

  public baseActions: Record<string, AnimationAction | null> = {
    idle: null,
    walk: null,
    run: null,
  }

  public additiveActions: Record<string, AnimationAction | null> = {
    sneak_pose: null,
    sad_pose: null,
    agree: null,
    headShake: null,
  }

  constructor(args: ThreeAppletProps) {
    super(args)

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

      this.mixer = new AnimationMixer(model)
      const animations = gltf.animations

      for (let i = 0; i < animations.length; i++) {
        let clip = animations[i]
        const name = clip.name

        if (name in this.baseActions) {
          const action = this.mixer.clipAction(clip)
          this.setWeight(action, name === 'idle' ? 1 : 0)
          action.play()
          this.baseActions[name] = action
        } else if (name in this.additiveActions) {
          // Make the clip additive and remove the reference frame
          AnimationUtils.makeClipAdditive(clip)

          if (clip.name.endsWith('_pose')) {
            clip = AnimationUtils.subclip(clip, clip.name, 2, 3, 30)
          }

          const action = this.mixer.clipAction(clip)
          this.setWeight(action, 0)
          action.play()
          this.additiveActions[name] = action
        }
        this.additiveActions = Object.assign({}, this.additiveActions)
        this.dispatchMutation(this.additiveActions)
      }

      this.setProperties({
        isLoaded: true,
      })

      this.dispatch('frame-object', {object: model}, true)
    })
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  // Base action crossfade triggers
  none = () => { this.prepareCrossFade(null) }
  idle = () => { this.prepareCrossFade('idle') }
  walk = () => { this.prepareCrossFade('walk') }
  run = () => { this.prepareCrossFade('run') }

  private prepareCrossFade(targetName: string | null) {
    const currentAction = this.baseActions[this.currentBaseAction]
    const targetAction = targetName ? this.baseActions[targetName] : null

    if (currentAction === targetAction) return

    const duration = 0.35

    if (this.currentBaseAction === 'idle' || !currentAction || !targetAction) {
      this.executeCrossFade(currentAction, targetAction, duration)
    } else {
      this.synchronizeCrossFade(currentAction, targetAction, duration)
    }

    this.currentBaseAction = targetName || 'None'
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

    debug: {
      // Dispatch mutations for UI reactivity
      Object.values(this.baseActions).forEach(action => {
        if (action) this.dispatchMutation(action)
      })
      Object.values(this.additiveActions).forEach(action => {
        if (action) this.dispatchMutation(action)
      })
      this.dispatchMutation(this.mixer)
    }

    this.mixer.update(delta)
  }
}

@Register
export class IoAnimationSkinningAdditiveBlendingExample extends IoThreeExample {

  @ReactiveProperty({type: AnimationSkinningAdditiveBlendingExample, init: {isPlaying: true}})
  declare applet: AnimationSkinningAdditiveBlendingExample

  ready() {

    this.render([
      ioSplit({
        elements: [
          ioThreeViewport({id: 'Top', applet: this.applet, cameraSelect: 'top'}),
          ioThreeViewport({id: 'Left', applet: this.applet, cameraSelect: 'left'}),
          ioThreeViewport({id: 'Back', applet: this.applet, cameraSelect: 'back'}),
          ioThreeViewport({id: 'Perspective', applet: this.applet, cameraSelect: 'perspective'}),
          ioPropertyEditor({id: 'PropertyEditor', value: this.applet,
            config: [
              [AnimationMixer, ioObject({expanded: true, properties: ['timeScale']})],
              [AnimationAction, ioObject({expanded: true, properties: ['weight']})],
              ['additiveActions', ioPropertyEditor({label: '_hidden_'})],
            ],
            groups: {
              'Main': [
                'none',
                'idle',
                'walk',
                'run',
                'additiveActions',
                'mixer',
              ],
              Hidden: [
                'isLoaded',
                'scene',
                'camera',
                'baseActions',
                'currentBaseAction',
              ],
            }
          })
        ],
        split: new Split({
          type: 'split',
          orientation: 'horizontal',
          children: [
            {
              type: 'split',
              flex: '2 1 auto',
              orientation: 'vertical',
              children: [
                {
                  type: 'split',
                  flex: '1 1 50%',
                  orientation: 'horizontal',
                  children: [
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Top'}]},
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Left'}]}
                  ]
                },
                {
                  type: 'split',
                  flex: '1 1 50%',
                  orientation: 'horizontal',
                  children: [
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Back'}]},
                    {type: 'panel',flex: '1 1 50%',tabs: [{id: 'Perspective'}]},
                  ]
                }
              ]
            },
            {
              type: 'panel',
              flex: '0 0 280px',
              tabs: [{id: 'PropertyEditor'}]
            }
          ]
        })
      })
    ])

  }

}

export const ioAnimationSkinningAdditiveBlendingExample = IoAnimationSkinningAdditiveBlendingExample.vConstructor
