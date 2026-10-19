import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  DodecahedronGeometry,
  DoubleSide,
  Float32BufferAttribute,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  TetrahedronGeometry,
  Vector3
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

const _a = new Vector3(), _b = new Vector3()

/** Paper colors: one material each, shared across all solids. */
const PALETTE = [ 0xe4002b, 0xff7f11, 0xffd100, 0x00a651, 0x0072ce, 0x8a2be2 ]

// rebuilds a polyhedron with a hole cut into each polygon face, like an open paper model
function makeHoleyGeometry( geometry: BufferGeometry, verticesPerFace: number, holeScale = 0.6 ) {
  if ( geometry.index !== null ) geometry = geometry.toNonIndexed()

  const position = geometry.getAttribute( 'position' )
  const positions: number[] = []
  const holey = new BufferGeometry()

  for ( let face = 0; face < position.count / verticesPerFace; face ++ ) {
    // collect the unique corner vertices of the face

    const corners: Vector3[] = []
    const keys = new Set()

    for ( let i = 0; i < verticesPerFace; i ++ ) {
      const v = new Vector3().fromBufferAttribute( position, face * verticesPerFace + i )
      const key = v.toArray().join( ',' )

      if ( keys.has( key ) === false ) {
        keys.add( key )
        corners.push( v )
      }
    }

    // sort the corners counterclockwise around the face centroid

    const centroid = corners.reduce( ( c, v ) => c.add( v ), new Vector3() ).divideScalar( corners.length )
    const normal = new Vector3().crossVectors( _a.subVectors( corners[ 1 ], corners[ 0 ] ), _b.subVectors( corners[ 2 ], corners[ 0 ] ) ).normalize()
    const tangent = new Vector3().subVectors( corners[ 0 ], centroid ).normalize()
    const bitangent = new Vector3().crossVectors( normal, tangent )

    const angleOf = ( v: Vector3 ) => Math.atan2( _b.subVectors( v, centroid ).dot( bitangent ), _b.dot( tangent ) )
    corners.sort( ( p, q ) => angleOf( p ) - angleOf( q ) )

    // bridge each outer edge with its scaled-down inner edge

    const inner = corners.map( v => new Vector3().lerpVectors( centroid, v, holeScale ) )

    holey.addGroup( positions.length / 3, corners.length * 6, face % PALETTE.length )

    for ( let i = 0; i < corners.length; i ++ ) {
      const j = ( i + 1 ) % corners.length

      positions.push(
        ...corners[ i ].toArray(), ...corners[ j ].toArray(), ...inner[ j ].toArray(),
        ...corners[ i ].toArray(), ...inner[ j ].toArray(), ...inner[ i ].toArray()
      )
    }
  }

  holey.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
  holey.computeVertexNormals()

  return holey
}

/**
 * Sixteen open paper polyhedra on a table, each face drawn with one of six materials through geometry groups and a
 * material array. Static.
 */
@Register
export class MaterialsArraysExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 40, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( - 6, 7, 14 )
    camera.lookAt( 0, 0.5, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x222222 )

    // environment

    const hemiLight = new HemisphereLight( 0xffffff, 0x0e696c )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    // lights

    const dirLight = new DirectionalLight( 0xffffff, 6 )
    dirLight.name = 'Key'
    dirLight.position.set( 5, 10, 6 )
    dirLight.castShadow = true
    dirLight.shadow.camera.left = - 10
    dirLight.shadow.camera.right = 10
    dirLight.shadow.camera.top = 10
    dirLight.shadow.camera.bottom = - 10
    dirLight.shadow.camera.far = 20
    dirLight.shadow.mapSize.set( 2048, 2048 )
    dirLight.shadow.radius = 10
    this.scene.add( dirLight )

    // materials, one per paper color, shared across all solids

    const materials = PALETTE.map( color => new MeshStandardMaterial( { color, roughness: 0.8, side: DoubleSide } ) )

    const geometries = [
      makeHoleyGeometry( new TetrahedronGeometry( 1.2 ), 3 ), // 4 faces, 1 triangle each
      makeHoleyGeometry( new BoxGeometry( 1.5, 1.5, 1.5 ), 6 ), // 6 faces, 2 triangles each (indexed)
      makeHoleyGeometry( new OctahedronGeometry( 1.2 ), 3 ), // 8 faces, 1 triangle each
      makeHoleyGeometry( new DodecahedronGeometry( 1.1 ), 9 ), // 12 faces, 3 triangles each
      makeHoleyGeometry( new IcosahedronGeometry( 1.1 ), 3 ) // 20 faces, 1 triangle each
    ]
    const names = [ 'Tetrahedron', 'Cube', 'Octahedron', 'Dodecahedron', 'Icosahedron' ]

    // table

    const table = new Mesh(
      new BoxGeometry( 17, 0.5, 17 ),
      new MeshStandardMaterial( { color: 0x0e696c, roughness: 0.5 } )
    )
    table.name = 'Table'
    table.position.y = - 0.25
    table.receiveShadow = true
    table.userData.selectable = false
    this.scene.add( table )

    // grid

    const order = [
      0, 1, 2, 3,
      3, 4, 0, 1,
      1, 2, 3, 4,
      4, 0, 1, 2
    ]

    for ( let i = 0; i < 16; i ++ ) {
      const row = Math.floor( i / 4 )
      const col = i % 4

      const mesh = new Mesh( geometries[ order[ i ] ], materials )
      mesh.name = `${names[ order[ i ] ]} ${i + 1}`
      mesh.castShadow = true
      mesh.scale.setScalar( 0.5 + row * 0.25 )
      mesh.position.set( ( col - 1.5 ) * 3.5, 0, ( 1.5 - row ) * 3.5 )
      mesh.position.y = - new Box3().setFromObject( mesh, true ).min.y - 0.01

      this.scene.add( mesh )
    }
  }
}
