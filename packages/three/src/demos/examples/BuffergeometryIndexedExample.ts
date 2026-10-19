import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, SRGBColorSpace } from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds in which the spin repeats (0.25 and 0.5 rad/s): the timeline length. */
const PERIOD = 8 * Math.PI

/** A 10 × 10 indexed grid with vertex colors, built by hand. Spins with document time; plays when opened. */
@Register
export class BuffergeometryIndexedExample extends Document {

  public mesh: Mesh
  private material: MeshPhongMaterial

  @Property({type: Boolean, value: false})
  declare wireframe: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 27, 400 / 250, 1, 3500 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 64 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x050505 )

    //

    const light = new HemisphereLight()
    light.name = 'Hemisphere'
    light.intensity = 3
    this.scene.add( light )

    //

    const geometry = new BufferGeometry()

    const indices: number[] = []

    const vertices: number[] = []
    const normals: number[] = []
    const colors: number[] = []

    const size = 20
    const segments = 10

    const halfSize = size / 2
    const segmentSize = size / segments

    const _color = new Color()

    // generate vertices, normals and color data for a simple grid geometry

    for ( let i = 0; i <= segments; i ++ ) {
      const y = ( i * segmentSize ) - halfSize

      for ( let j = 0; j <= segments; j ++ ) {
        const x = ( j * segmentSize ) - halfSize

        vertices.push( x, - y, 0 )
        normals.push( 0, 0, 1 )

        const r = ( x / size ) + 0.5
        const g = ( y / size ) + 0.5

        _color.setRGB( r, g, 1, SRGBColorSpace )

        colors.push( _color.r, _color.g, _color.b )
      }
    }

    // generate indices (data for element array buffer)

    for ( let i = 0; i < segments; i ++ ) {
      for ( let j = 0; j < segments; j ++ ) {
        const a = i * ( segments + 1 ) + ( j + 1 )
        const b = i * ( segments + 1 ) + j
        const c = ( i + 1 ) * ( segments + 1 ) + j
        const d = ( i + 1 ) * ( segments + 1 ) + ( j + 1 )

        // generate two faces (triangles) per iteration

        indices.push( a, b, d ) // face one
        indices.push( b, c, d ) // face two
      }
    }

    //

    geometry.setIndex( indices )
    geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
    geometry.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) )
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )

    this.material = new MeshPhongMaterial( {
      side: DoubleSide,
      vertexColors: true
    } )

    this.mesh = new Mesh( geometry, this.material )
    this.mesh.name = 'Grid'
    this.scene.add( this.mesh )

    this.wireframeChanged()
  }

  wireframeChanged() {
    if (this.material) this.material.wireframe = this.wireframe
  }

  override onAnimate(delta: number, time: number) {
    this.mesh.rotation.x = time * 0.25
    this.mesh.rotation.y = time * 0.5
  }
}

registerEditorGroups(BuffergeometryIndexedExample, {
  Main: ['wireframe'],
})
