import { AmbientLight, DirectionalLight, LoadingManager, Object3D, PerspectiveCamera } from 'three/webgpu'
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/** Seconds of one turn of the elf: the timeline length, so looping is seamless (the source turns 0.5 rad/s). */
const PERIOD = 4 * Math.PI

/** The elf from a Collada file, turning with document time. Plays when opened. */
@Register
export class LoaderColladaExample extends Document {

  public elf?: Object3D

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 8, 10, 8 )
    camera.lookAt( 0, 3, 0 )
    this.activeCamera = camera

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffffff, 2.5 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 1, 1, 0 ).normalize()
    this.scene.add( directionalLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    // The elf's textures load in the background: report them when they arrive.
    const manager = new LoadingManager( () => this.notify({kind: 'material'}) )

    try {
      const collada = await new ColladaLoader( manager ).loadAsync( 'https://threejs.org/examples/models/collada/elf/elf.dae' )
      if ( ! collada ) return

      // A Z-up asset: the loader turns it upright about x, so its own z is the vertical axis.
      this.elf = collada.scene
      this.elf.name = 'Elf'
      this.pose( this.timeline.currentTime )
      this.scene.add( this.elf )

      this.notify({kind: 'structure'})
      this._frameTarget = this.elf
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( this.elf ) this.elf.rotation.z = time / PERIOD * Math.PI * 2
  }
}
