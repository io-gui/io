import { AnimationMixer, Color, DirectionalLight, PerspectiveCamera } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/**
 * The morph-target galloping horse, its clip played in 1 s. The active camera stands where the source's orbit starts
 * (one turn a minute). Plays when opened.
 */
@Register
export class MorphtargetsHorseExample extends Document {

  public mixer?: AnimationMixer

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: 1}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 10000 )
    camera.name = 'Camera'
    camera.position.set( 0, 300, 600 )
    camera.lookAt( 0, 150, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xf0f0f0 )

    const light1 = new DirectionalLight( 0xefefff, 5 )
    light1.name = 'Key'
    light1.position.set( 1, 1, 1 ).normalize()
    this.scene.add( light1 )

    const light2 = new DirectionalLight( 0xffefef, 5 )
    light2.name = 'Fill'
    light2.position.set( - 1, - 1, - 1 ).normalize()
    this.scene.add( light2 )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Horse.glb' )
      const mesh = gltf.scene.children[ 0 ]
      // Keeps its glTF name, `mesh_0`: the clip's morph track targets it by name.
      mesh.scale.set( 1.5, 1.5, 1.5 )
      this.scene.add( mesh )

      this.mixer = new AnimationMixer( mesh )
      this.mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play()
      this.mixer.setTime( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}
