import { AmbientLight, AnimationMixer, DirectionalLight, PerspectiveCamera } from 'three/webgpu'
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/** The skinned stormtrooper from a Collada file, playing its clip. The source's grid is dropped. Plays when opened. */
@Register
export class LoaderColladaSkinningExample extends Document {

  public mixer?: AnimationMixer

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 25, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 15, 10, - 15 )
    camera.lookAt( 0, 2, 0 )
    this.activeCamera = camera

    const ambientLight = new AmbientLight( 0xffffff, 0.6 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffffff, 3 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 1.5, 1, - 1.5 )
    this.scene.add( directionalLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const collada = await new ColladaLoader().loadAsync( 'https://threejs.org/examples/models/collada/stormtrooper/stormtrooper.dae' )
      if ( ! collada ) return

      const avatar = collada.scene
      avatar.name = 'Stormtrooper'
      const clip = avatar.animations[ 0 ]

      this.timeline.duration = clip.duration
      this.mixer = new AnimationMixer( avatar )
      this.mixer.clipAction( clip ).play()
      this.mixer.setTime( this.timeline.currentTime )

      this.scene.add( avatar )

      this.notify({kind: 'structure'})
      // Skinned bounds read the bones' world matrices, which nothing has drawn yet.
      avatar.updateMatrixWorld( true )
      this._frameTarget = avatar
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}
