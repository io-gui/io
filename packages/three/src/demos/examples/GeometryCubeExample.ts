import { BoxGeometry, Mesh, MeshBasicMaterial, SRGBColorSpace, TextureLoader } from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds in which the spin repeats: the timeline length, so looping is seamless. */
const SPIN_PERIOD = 20

/** A crate-textured cube spinning with document time. Plays when opened. */
@Register
export class GeometryCubeExample extends Document {

  public mesh: Mesh

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: SPIN_PERIOD}), ...args})

    // Views draw on document changes only, so report the texture when it arrives.
    const texture = new TextureLoader().load( 'https://threejs.org/examples/textures/crate.gif', () => this.notify({kind: 'material'}) )
    texture.colorSpace = SRGBColorSpace

    const geometry = new BoxGeometry()
    const material = new MeshBasicMaterial( { map: texture } )

    this.mesh = new Mesh( geometry, material )
    this.mesh.name = 'Cube'
    this.scene.add( this.mesh )
  }

  override onAnimate(delta: number, time: number) {
    const angle = time / SPIN_PERIOD * Math.PI * 2
    this.mesh.rotation.x = angle
    this.mesh.rotation.y = angle * 2
  }
}
