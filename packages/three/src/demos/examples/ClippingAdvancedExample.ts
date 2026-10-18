import {
  AmbientLight,
  BoxGeometry,
  ClippingGroup,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Plane,
  PlaneGeometry,
  SpotLight,
  Vector3
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The cubes turn 0.5 and 0.2 rad/s,
 * the volume bounces with `cos( t / 2 )` and the global planes turn 0.1 rad/s: one turn in 20π s.
 */
const PERIOD = 20 * Math.PI

function planesFromMesh( vertices: Vector3[], indices: number[] ) {

  // creates a clipping volume from a convex triangular mesh
  // specified by the arrays 'vertices' and 'indices'

  const n = indices.length / 3,
    result: Plane[] = new Array( n )

  for ( let i = 0, j = 0; i < n; ++ i, j += 3 ) {

    const a = vertices[ indices[ j ] ],
      b = vertices[ indices[ j + 1 ] ],
      c = vertices[ indices[ j + 2 ] ]

    result[ i ] = new Plane().
      setFromCoplanarPoints( a, b, c )

  }

  return result

}

function createPlanes( n: number ) {

  // creates an array of n uninitialized plane objects

  const result: Plane[] = new Array( n )

  for ( let i = 0; i !== n; ++ i )
    result[ i ] = new Plane()

  return result

}

function assignTransformedPlanes( planesOut: Plane[], planesIn: Plane[], matrix: Matrix4 ) {

  // sets an array of existing planes to transformed 'planesIn'

  for ( let i = 0, n = planesIn.length; i !== n; ++ i )
    planesOut[ i ].copy( planesIn[ i ] ).applyMatrix4( matrix )

}

function cylindricalPlanes( n: number, innerRadius: number ) {

  const result = createPlanes( n )

  for ( let i = 0; i !== n; ++ i ) {

    const plane = result[ i ],
      angle = i * Math.PI * 2 / n

    plane.normal.set(
      Math.cos( angle ), 0, Math.sin( angle ) )

    plane.constant = innerRadius

  }

  return result

}

const planeToMatrix = ( function () {

  // creates a matrix that aligns X/Y to a given plane

  // temporaries:
  const xAxis = new Vector3(),
    yAxis = new Vector3(),
    trans = new Vector3()

  return function planeToMatrix( plane: Plane ) {

    const zAxis = plane.normal,
      matrix = new Matrix4()

    // Hughes & Moeller '99
    // "Building an Orthonormal Basis from a Unit Vector."

    if ( Math.abs( zAxis.x ) > Math.abs( zAxis.z ) ) {

      yAxis.set( - zAxis.y, zAxis.x, 0 )

    } else {

      yAxis.set( 0, - zAxis.z, zAxis.y )

    }

    xAxis.crossVectors( yAxis.normalize(), zAxis )

    plane.coplanarPoint( trans )
    return matrix.set(
      xAxis.x, yAxis.x, zAxis.x, trans.x,
      xAxis.y, yAxis.y, zAxis.y, trans.y,
      xAxis.z, yAxis.z, zAxis.z, trans.z,
      0,	 0, 0, 1 )

  }

} )()

// A regular tetrahedron for the clipping volume:

const Vertices = [
    new Vector3( + 1, 0, + Math.SQRT1_2 ),
    new Vector3( - 1, 0, + Math.SQRT1_2 ),
    new Vector3( 0, + 1, - Math.SQRT1_2 ),
    new Vector3( 0, - 1, - Math.SQRT1_2 )
  ],

  Indices = [
    0, 1, 2,	0, 2, 3,	0, 3, 1,	1, 3, 2
  ],

  Planes = planesFromMesh( Vertices, Indices ),
  PlaneMatrices = Planes.map( planeToMatrix ),

  GlobalClippingPlanes = cylindricalPlanes( 5, 2.5 )

const transform = new Matrix4(),
  tmpMatrix = new Matrix4()

/**
 * A spinning grid of cubes clipped by a bouncing tetrahedron, its planes moved every frame. WebGPU clips with
 * `ClippingGroup`s instead of per-material and renderer planes: `Local` holds the tetrahedron's four planes (with
 * `clipShadows`), `Global` the renderer's five turning planes around everything. `visualize` shows the volume: each face
 * in a group clipped by the other three. `localClipping`, `clipShadows`, `visualize` and `globalClipping` are in the
 * Document tab. Plays when opened.
 */
@Register
export class ClippingAdvancedExample extends Document {

  public object: InstancedMesh<BoxGeometry, MeshPhongMaterial>
  public globalGroup: ClippingGroup
  public localGroup: ClippingGroup
  public volumeVisualization: Group
  private localPlanes = createPlanes( Planes.length )
  private globalPlanes = createPlanes( GlobalClippingPlanes.length )
  private planeMeshes: Mesh[] = []

  @Property({type: Boolean, value: true})
  declare localClipping: boolean

  @Property({type: Boolean, value: true})
  declare clipShadows: boolean

  @Property({type: Boolean, value: false})
  declare visualize: boolean

  @Property({type: Boolean, value: false})
  declare globalClipping: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // Lights

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const spotLight = new SpotLight( 0xffffff, 60 )
    spotLight.name = 'Spot'
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set( 2, 3, 3 )
    spotLight.castShadow = true
    spotLight.shadow.camera.near = 3
    spotLight.shadow.camera.far = 10
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    this.scene.add( spotLight )

    const dirLight = new DirectionalLight( 0xffffff, 1.5 )
    dirLight.name = 'Key'
    dirLight.position.set( 0, 2, 0 )
    dirLight.castShadow = true
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 10

    dirLight.shadow.camera.right = 1
    dirLight.shadow.camera.left = - 1
    dirLight.shadow.camera.top	= 1
    dirLight.shadow.camera.bottom = - 1

    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    this.scene.add( dirLight )

    // Clipping setup: the renderer's planes clip everything, the material's the cubes.

    this.globalGroup = new ClippingGroup()
    this.globalGroup.name = 'Global'
    this.globalGroup.clippingPlanes = this.globalPlanes
    this.scene.add( this.globalGroup )

    this.localGroup = new ClippingGroup()
    this.localGroup.name = 'Local'
    this.localGroup.clippingPlanes = this.localPlanes
    this.globalGroup.add( this.localGroup )

    // Geometry

    const clipMaterial = new MeshPhongMaterial( {
      color: 0xee0a10,
      shininess: 100,
      side: DoubleSide
    } )

    const count = 5 * 5 * 5
    const geometry = new BoxGeometry( 0.18, 0.18, 0.18 )

    this.object = new InstancedMesh( geometry, clipMaterial, count )
    this.object.name = 'Cubes'
    this.object.castShadow = true

    let i = 0
    const matrix = new Matrix4()

    for ( let z = - 2; z <= 2; ++ z )
      for ( let y = - 2; y <= 2; ++ y )
        for ( let x = - 2; x <= 2; ++ x ) {

          matrix.setPosition( x / 5, y / 5, z / 5 )
          this.object.setMatrixAt( i ++, matrix )

        }

    this.object.computeBoundingBox()
    this.object.computeBoundingSphere()
    this.localGroup.add( this.object )

    const planeGeometry = new PlaneGeometry( 3, 3, 1, 1 ),
      color = new Color()

    this.volumeVisualization = new Group()
    this.volumeVisualization.name = 'Volume'
    this.volumeVisualization.userData.selectable = false

    for ( let i = 0, n = Planes.length; i !== n; ++ i ) {

      const material = new MeshBasicMaterial( {
        color: color.setHSL( i / n, 0.5, 0.5 ).getHex(),
        side: DoubleSide,

        opacity: 0.2,
        transparent: true
      } )

      // clip to the others to show the volume (wildly
      // intersecting transparent planes look bad)
      const others = new ClippingGroup()
      others.name = `Face ${i + 1}`
      others.clippingPlanes = this.localPlanes.filter( function ( _, j ) {

        return j !== i

      } )
      // no need to enable shadow clipping - the plane
      // visualization does not cast shadows

      const mesh = new Mesh( planeGeometry, material )
      mesh.name = 'Plane'
      others.add( mesh )
      this.volumeVisualization.add( others )
      this.planeMeshes.push( mesh )

    }

    this.globalGroup.add( this.volumeVisualization )

    const ground = new Mesh( planeGeometry,
      new MeshPhongMaterial( {
        color: 0xa0adaf, shininess: 10 } ) )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.scale.multiplyScalar( 3 )
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.globalGroup.add( ground )

    this.localClippingChanged()
    this.clipShadowsChanged()
    this.visualizeChanged()
    this.globalClippingChanged()
    this.pose( this.timeline.currentTime )
  }

  localClippingChanged() {
    if ( ! this.localGroup ) return
    this.localGroup.enabled = this.localClipping
    if ( ! this.localClipping ) this.visualize = false
    this.notify({kind: 'other'})
  }

  clipShadowsChanged() {
    if ( ! this.localGroup ) return
    this.localGroup.clipShadows = this.clipShadows
    this.notify({kind: 'other'})
  }

  visualizeChanged() {
    if ( ! this.volumeVisualization ) return
    if ( this.visualize && ! this.localClipping ) {
      this.visualize = false
      return
    }
    this.volumeVisualization.visible = this.visualize
    this.notify({kind: 'other'})
  }

  globalClippingChanged() {
    if ( ! this.globalGroup ) return
    this.globalGroup.enabled = this.globalClipping
    this.notify({kind: 'other'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const object = this.object

    object.position.y = 1
    object.rotation.x = time * 0.5
    object.rotation.y = time * 0.2

    object.updateMatrix()
    transform.copy( object.matrix )

    const bouncy = Math.cos( time * .5 ) * 0.5 + 0.7
    transform.multiply(
      tmpMatrix.makeScale( bouncy, bouncy, bouncy ) )

    assignTransformedPlanes( this.localPlanes, Planes, transform )

    // The visualization groups sit at the origin: the faces' world matrices are their own.
    for ( let i = 0, n = this.planeMeshes.length; i !== n; ++ i ) {

      tmpMatrix.multiplyMatrices( transform, PlaneMatrices[ i ] )
      const mesh = this.planeMeshes[ i ]
      tmpMatrix.decompose( mesh.position, mesh.quaternion, mesh.scale )

    }

    transform.makeRotationY( time * 0.1 )
    assignTransformedPlanes( this.globalPlanes, GlobalClippingPlanes, transform )
  }
}

registerEditorGroups(ClippingAdvancedExample, {
  Main: ['localClipping', 'clipShadows', 'visualize', 'globalClipping'],
  Hidden: ['object', 'globalGroup', 'localGroup', 'volumeVisualization', 'localPlanes', 'globalPlanes', 'planeMeshes'],
})
