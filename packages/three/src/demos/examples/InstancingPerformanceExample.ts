import {
  BufferGeometry,
  BufferGeometryLoader,
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshNormalMaterial,
  Quaternion,
  Vector3
} from 'three/webgpu'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const METHODS = [ 'INSTANCED', 'MERGED', 'NAIVE' ]

const randomizeMatrix = function () {

  const position = new Vector3()
  const quaternion = new Quaternion()
  const scale = new Vector3()

  return function ( matrix: Matrix4 ) {

    position.x = Math.random() * 40 - 20
    position.y = Math.random() * 40 - 20
    position.z = Math.random() * 40 - 20

    quaternion.random()

    scale.x = scale.y = scale.z = Math.random() * 1

    matrix.compose( position, quaternion, scale )

  }

}()

function getGeometryByteLength( geometry: BufferGeometry ) {

  let total = 0

  if ( geometry.index ) total += geometry.index.array.byteLength

  for ( const name in geometry.attributes ) {

    total += geometry.attributes[ name ].array.byteLength

  }

  return total

}

// Source: https://stackoverflow.com/a/18650828/1314762
function formatBytes( bytes: number, decimals: number ) {

  if ( bytes === 0 ) return '0 bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = [ 'bytes', 'KB', 'MB' ]

  const i = Math.floor( Math.log( bytes ) / Math.log( k ) )

  return parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + ' ' + sizes[ i ]

}

/**
 * `count` Suzanne heads at random places, built one of three ways (`method`, Document tab): one `InstancedMesh`, one
 * merged geometry, or a mesh each (in a `Naive` group). `drawCalls` and `gpuMemory` show what the method costs, as in
 * the source's Performance folder. The auto-rotating camera is dropped. Static.
 */
@Register
export class InstancingPerformanceExample extends Document {

  @Property({type: String, value: 'INSTANCED'})
  declare method: string

  @Property({type: Number, value: 1000})
  declare count: number

  /** GPU draw calls of the current method. */
  @Property({type: Number, value: 0})
  declare drawCalls: number

  /** GPU memory of the current method's geometry and matrices. */
  @Property({type: String, value: ''})
  declare gpuMemory: string

  public content?: Mesh | Group
  private material = new MeshNormalMaterial()
  private geometry?: BufferGeometry
  private framed = false

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0xffffff )

    void this.loadGeometry()
  }

  methodChanged() { this.initMesh() }
  countChanged() { this.initMesh() }

  private async loadGeometry() {
    try {
      const geometry = await new BufferGeometryLoader().loadAsync( 'https://threejs.org/examples/models/json/suzanne_buffergeometry.json' )
      geometry.computeVertexNormals()
      this.geometry = geometry
      this.initMesh()
    } catch ( e ) {
      console.error( e )
    }
  }

  private clean() {
    const content = this.content
    if ( ! content ) return

    content.traverse( ( object ) => {
      const mesh = object as Mesh
      if ( mesh.isMesh && mesh.geometry !== this.geometry ) mesh.geometry.dispose()
    } )

    this.scene.remove( content )
    this.content = undefined
  }

  private initMesh() {
    const geometry = this.geometry
    if ( ! geometry ) return

    this.clean()

    switch ( this.method ) {

      case 'INSTANCED':
        this.makeInstanced( geometry )
        break

      case 'MERGED':
        this.makeMerged( geometry )
        break

      case 'NAIVE':
        this.makeNaive( geometry )
        break

    }

    this.scene.add( this.content! )
    this.notify({kind: 'structure'})

    // The views showed an empty scene: frame the heads once they first show.
    if ( ! this.framed ) {
      this.framed = true
      this.content!.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: this.content}, true)
    }
  }

  private makeInstanced(geometry: BufferGeometry) {
    const matrix = new Matrix4()
    const mesh = new InstancedMesh( geometry, this.material, this.count )
    mesh.name = 'Instanced'

    for ( let i = 0; i < this.count; i ++ ) {

      randomizeMatrix( matrix )
      mesh.setMatrixAt( i, matrix )

    }

    mesh.computeBoundingBox()
    mesh.computeBoundingSphere()
    this.content = mesh

    //

    const geometryByteLength = getGeometryByteLength( geometry )

    this.drawCalls = 1
    this.gpuMemory = formatBytes( this.count * 16 + geometryByteLength, 2 )
  }

  private makeMerged(geometry: BufferGeometry) {
    const geometries: BufferGeometry[] = []
    const matrix = new Matrix4()

    for ( let i = 0; i < this.count; i ++ ) {

      randomizeMatrix( matrix )

      const instanceGeometry = geometry.clone()
      instanceGeometry.applyMatrix4( matrix )

      geometries.push( instanceGeometry )

    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries( geometries )

    const mesh = new Mesh( mergedGeometry, this.material )
    mesh.name = 'Merged'
    this.content = mesh

    //

    this.drawCalls = 1
    this.gpuMemory = formatBytes( getGeometryByteLength( mergedGeometry ), 2 )
  }

  private makeNaive(geometry: BufferGeometry) {
    const matrix = new Matrix4()
    const group = new Group()
    group.name = 'Naive'

    for ( let i = 0; i < this.count; i ++ ) {

      randomizeMatrix( matrix )

      const mesh = new Mesh( geometry, this.material )
      mesh.name = 'Suzanne'
      mesh.applyMatrix4( matrix )
      group.add( mesh )

    }

    this.content = group

    //

    const geometryByteLength = getGeometryByteLength( geometry )

    this.drawCalls = this.count
    this.gpuMemory = formatBytes( this.count * 16 + geometryByteLength, 2 )
  }
}

registerEditorConfig(InstancingPerformanceExample, [
  ['method', ioOptionSelect({model: new Menu({options: METHODS})})],
  ['count', ioNumberSlider({min: 1, max: 10000, step: 1})],
])

registerEditorGroups(InstancingPerformanceExample, {
  Main: ['method', 'count', 'drawCalls', 'gpuMemory'],
  Hidden: ['content', 'material', 'geometry', 'framed'],
})
