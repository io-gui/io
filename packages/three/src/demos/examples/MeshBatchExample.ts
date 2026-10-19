import {
  BatchedMesh,
  BoxGeometry,
  BufferGeometry,
  Camera,
  Color,
  ConeGeometry,
  Euler,
  Matrix4,
  MeshBasicNodeMaterial,
  PerspectiveCamera,
  Quaternion,
  SphereGeometry,
  Vector3
} from 'three/webgpu'
import { radixSort } from 'three/addons/utils/SortUtils.js'
import { normalView, packNormalToRGB, diffuseColor, vec4 } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds in which the spinning instances come back to their start: the timeline length, so looping is seamless. */
const PERIOD = 20 * Math.PI

/** Spin rates are rounded to whole turns per period. */
const RATE_STEP = 2 * Math.PI / PERIOD

const MAX_GEOMETRY_COUNT = 20000

const position = new Vector3()
const rotation = new Euler()
const quaternion = new Quaternion()
const scale = new Vector3()
const spin = new Quaternion()
const matrix = new Matrix4()

function randomizeMatrix( matrix: Matrix4 ) {
  position.x = Math.random() * 40 - 20
  position.y = Math.random() * 40 - 20
  position.z = Math.random() * 40 - 20

  rotation.x = Math.random() * 2 * Math.PI
  rotation.y = Math.random() * 2 * Math.PI
  rotation.z = Math.random() * 2 * Math.PI

  quaternion.setFromEuler( rotation )

  scale.x = scale.y = scale.z = 0.5 + ( Math.random() * 0.5 )

  return matrix.compose( position, quaternion, scale )
}

type SortItem = { start: number; count: number; z: number }
type SortOptions = { get: ( el: SortItem ) => number; aux: SortItem[]; reversed?: boolean }

/** Sorts the draw list by depth with a radix sort, front to back (back to front when transparent). */
function sortFunction( this: BatchedMesh & { _options?: SortOptions }, list: SortItem[], camera: Camera ) {
  // initialize options
  this._options = this._options || {
    get: el => el.z,
    aux: new Array( this.maxInstanceCount )
  }

  const options = this._options
  options.reversed = this.material.transparent

  // convert depth to unsigned 32 bit range
  const factor = ( 2 ** 32 - 1 ) / ( camera as Camera & { far: number } ).far // UINT32_MAX / max_depth
  for ( let i = 0, l = list.length; i < l; i ++ ) {
    list[ i ].z *= factor
  }

  // perform a fast-sort using the hybrid radix sort function
  radixSort( list, options )
}

/**
 * A `BatchedMesh` of cones, boxes and spheres in random colors, shaded by their view-space normals. The first `dynamic`
 * instances spin with document time (the source turns them by a small random rotation per frame; here each spins about
 * that rotation's axis, at a rate rounded to whole turns per loop). `count` rebuilds the mesh; `dynamic`, `opacity`,
 * `sortObjects`, `perObjectFrustumCulled`, `useCustomSort` and `randomizeGeometry` are in the Document tab. Sorting and
 * culling run for each drawing camera. The active camera turns once per loop (the source's auto-rotation, once a
 * minute). The `webgpu` toggle (WebGL fallback) is dropped. Plays when opened.
 */
@Register
export class MeshBatchExample extends Document {

  public mesh!: BatchedMesh
  private geometries: BufferGeometry[]
  private material: MeshBasicNodeMaterial
  private ids: number[] = []
  /** Per instance: its start matrix, spin axis and spin rate (rad/s). */
  private spins: { base: Matrix4; axis: Vector3; rate: number }[] = []
  private camera: PerspectiveCamera

  @Property({type: Number, value: 512})
  declare count: number

  @Property({type: Number, value: 16})
  declare dynamic: number

  @Property({type: Number, value: 1})
  declare opacity: number

  @Property({type: Boolean, value: true})
  declare sortObjects: boolean

  @Property({type: Boolean, value: true})
  declare perObjectFrustumCulled: boolean

  @Property({type: Boolean, value: true})
  declare useCustomSort: boolean

  randomizeGeometry = () => {
    for ( let i = 0; i < this.count; i ++ ) {
      this.mesh.setGeometryIdAt( this.ids[ i ], Math.floor( Math.random() * this.geometries.length ) )
    }
    this.notify({kind: 'geometry'})
  }

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.camera = new PerspectiveCamera( 70, 400 / 250, 1, 100 )
    this.camera.name = 'Camera'
    this.activeCamera = this.camera
    this.turnCamera( this.timeline.currentTime )

    this.scene.background = new Color( 0xc1c1ff )

    this.geometries = [
      new ConeGeometry( 1.0, 2.0 ),
      new BoxGeometry( 2.0, 2.0, 2.0 ),
      new SphereGeometry( 1.0, 16, 8 ),
    ]

    this.material = new MeshBasicNodeMaterial()
    this.material.outputNode = vec4(
      diffuseColor.mul( packNormalToRGB( normalView ).y.add( 0.5 ) ).rgb,
      diffuseColor.a,
    )

    this.initMesh()
    this.opacityChanged()
  }

  private initMesh() {
    if ( this.mesh ) {
      this.mesh.removeFromParent()
      this.mesh.dispose()
    }

    const geometryCount = this.count
    const vertexCount = this.geometries.length * 512
    const indexCount = this.geometries.length * 1024

    const euler = new Euler()

    this.mesh = new BatchedMesh( geometryCount, vertexCount, indexCount, this.material )
    this.mesh.name = 'BatchedMesh'
    // disable full-object frustum culling since all of the objects can be dynamic.
    this.mesh.frustumCulled = false
    this.ids.length = 0
    this.spins.length = 0

    const geometryIds = [
      this.mesh.addGeometry( this.geometries[ 0 ] ),
      this.mesh.addGeometry( this.geometries[ 1 ] ),
      this.mesh.addGeometry( this.geometries[ 2 ] ),
    ]

    for ( let i = 0; i < this.count; i ++ ) {
      const id = this.mesh.addInstance( geometryIds[ i % geometryIds.length ] )
      const base = randomizeMatrix( new Matrix4() )
      this.mesh.setMatrixAt( id, base )
      this.mesh.setColorAt( id, new Color( Math.random() * 0xffffff ) )

      // The source's rotation per frame (up to 0.01 rad about each axis), as an axis and a rate at 60 fps.
      euler.set( Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01 )
      const perFrame = new Quaternion().setFromEuler( euler )
      const angle = 2 * Math.acos( Math.min( 1, perFrame.w ) )
      const axis = new Vector3( perFrame.x, perFrame.y, perFrame.z ).normalize()
      const rate = Math.max( 1, Math.round( angle * 60 / RATE_STEP ) ) * RATE_STEP
      this.spins.push( { base, axis, rate } )

      this.ids.push( id )
    }

    this.scene.add( this.mesh )
    this.sortObjectsChanged()
    this.perObjectFrustumCulledChanged()
    this.useCustomSortChanged()
    this.pose( this.timeline.currentTime )
    this.notify({kind: 'structure'})
  }

  countChanged() {
    if ( this.material ) this.initMesh()
  }

  opacityChanged() {
    if ( ! this.material ) return
    if ( this.opacity < 1 ) {
      this.material.transparent = true
      this.material.depthWrite = false
    } else {
      this.material.transparent = false
      this.material.depthWrite = true
    }

    this.material.opacity = this.opacity
    this.material.needsUpdate = true
    this.notify({kind: 'material'})
  }

  sortObjectsChanged() { if ( this.mesh ) this.mesh.sortObjects = this.sortObjects }
  perObjectFrustumCulledChanged() { if ( this.mesh ) this.mesh.perObjectFrustumCulled = this.perObjectFrustumCulled }
  useCustomSortChanged() { if ( this.mesh ) this.mesh.setCustomSort( this.useCustomSort ? sortFunction : null ) }

  /** Instances that stop spinning go back to their start. */
  dynamicChanged() {
    if ( ! this.mesh ) return
    for ( let i = 0; i < this.ids.length; i ++ ) this.mesh.setMatrixAt( this.ids[ i ], this.spins[ i ].base )
    this.pose( this.timeline.currentTime )
    this.notify({kind: 'transform'})
  }

  override onAnimate(delta: number, time: number) {
    this.turnCamera( time )
    this.pose( time )
  }

  /** The source's `OrbitControls.autoRotate` (one turn a minute): one turn per loop, clockwise seen from above. */
  private turnCamera(time: number) {
    const angle = - time * 2 * Math.PI / PERIOD
    this.camera.position.set( Math.sin( angle ) * 30, 0, Math.cos( angle ) * 30 )
    this.camera.lookAt( 0, 0, 0 )
  }

  /** Spins the first `dynamic` instances about their axes. */
  private pose(time: number) {
    const loopNum = Math.min( this.ids.length, this.dynamic )

    for ( let i = 0; i < loopNum; i ++ ) {
      const { base, axis, rate } = this.spins[ i ]
      spin.setFromAxisAngle( axis, rate * time )
      this.mesh.setMatrixAt( this.ids[ i ], matrix.makeRotationFromQuaternion( spin ).premultiply( base ) )
    }
  }
}

registerEditorConfig(MeshBatchExample, [
  ['count', ioNumberSlider({min: 1, max: MAX_GEOMETRY_COUNT, step: 1})],
  ['dynamic', ioNumberSlider({min: 0, max: MAX_GEOMETRY_COUNT, step: 1})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MeshBatchExample, {
  Main: ['count', 'dynamic', 'opacity', 'sortObjects', 'perObjectFrustumCulled', 'useCustomSort', 'randomizeGeometry'],
  Hidden: ['mesh', 'geometries', 'material', 'ids', 'spins', 'camera'],
})
