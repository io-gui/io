import { AmbientLight, DirectionalLight, LoadingManager, Object3D } from 'three/webgpu'
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one turn of the elf: the timeline length, so looping is seamless (the source turns 0.5 rad/s). */
const PERIOD = 4 * Math.PI

/** The elf from a Collada file, turning with document time. Plays when opened. */
@Register
export class LoaderColladaExample extends Document {

  public elf?: Object3D

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffffff, 2.5 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 1, 1, 0 ).normalize()
    this.scene.add( directionalLight )

    void this.loadModel()
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
      this.dispatch('frame-object', {object: this.elf}, true)
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
