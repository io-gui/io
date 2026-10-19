import {
  BoxHelper,
  BufferGeometry,
  EdgesGeometry,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  PointLight,
  PolarGridHelper,
  WireframeGeometry
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js'
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the light's path repeats: the timeline length, so looping is seamless. Its axes move at 0.51, 0.45
 * and 0.39 rad/s, 17, 15 and 13 times 0.03 rad/s.
 */
const PERIOD = 200 * Math.PI / 3

/**
 * Helpers as the subject: vertex normals and tangents of Lee Perry-Smith's head, its wireframe and edges beside it, box
 * helpers around each part, the group and the whole scene, and a square and a polar grid. The helpers are content in an
 * unselectable `Helpers` group (`showHelpers` in the Document tab); the point light's helper comes from the light
 * helpers overlay. The light and the active camera, circling the head as in the source, move with document time. Plays
 * when opened.
 */
@Register
export class HelpersExample extends Document {

  public light: PointLight
  public camera: PerspectiveCamera
  public helpers: Group
  private vnh?: VertexNormalsHelper
  private vth?: VertexTangentsHelper

  @Property({type: Boolean, value: true})
  declare showHelpers: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.camera = new PerspectiveCamera( 70, 400 / 250, 1, 1000 )
    this.camera.name = 'Camera'
    this.activeCamera = this.camera

    this.light = new PointLight()
    this.light.name = 'Point'
    this.light.position.set( 200, 100, 150 )
    this.scene.add( this.light )

    this.helpers = new Group()
    this.helpers.name = 'Helpers'
    this.helpers.userData.selectable = false
    this.scene.add( this.helpers )

    const gridHelper = new GridHelper( 400, 40, 0x0000ff, 0x808080 )
    gridHelper.name = 'Grid'
    gridHelper.position.y = - 150
    gridHelper.position.x = - 150
    this.helpers.add( gridHelper )

    const polarGridHelper = new PolarGridHelper( 200, 16, 8, 64, 0x0000ff, 0x808080 )
    polarGridHelper.name = 'Polar Grid'
    polarGridHelper.position.y = - 150
    polarGridHelper.position.x = 200
    this.helpers.add( polarGridHelper )

    this.pose( this.timeline.currentTime )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb' )
      const mesh = gltf.scene.children[ 0 ] as Mesh
      mesh.name = 'Head'

      mesh.geometry.computeTangents() // generates bad data due to degenerate UVs

      const group = new Group()
      group.name = 'LeePerrySmith'
      group.scale.multiplyScalar( 50 )
      this.scene.add( group )

      // To make sure that the matrixWorld is up to date for the boxhelpers
      group.updateMatrixWorld( true )

      group.add( mesh )

      // The helpers follow world matrices: add them after the objects they follow.
      const helpers = this.helpers

      this.vnh = new VertexNormalsHelper( mesh, 5 )
      this.vnh.name = 'Normals'
      helpers.add( this.vnh )

      this.vth = new VertexTangentsHelper( mesh, 5 )
      this.vth.name = 'Tangents'
      helpers.add( this.vth )

      helpers.add( named( new BoxHelper( mesh ), 'Head Box' ) )

      const wireframe = new WireframeGeometry( mesh.geometry )
      let line: LineSegments<BufferGeometry, LineBasicMaterial> = new LineSegments( wireframe, new LineBasicMaterial() )
      line.name = 'Wireframe'
      line.material.depthTest = false
      line.material.opacity = 0.25
      line.material.transparent = true
      line.position.x = 4
      group.add( line )
      helpers.add( named( new BoxHelper( line ), 'Wireframe Box' ) )

      const edges = new EdgesGeometry( mesh.geometry )
      line = new LineSegments( edges, new LineBasicMaterial() )
      line.name = 'Edges'
      line.material.depthTest = false
      line.material.opacity = 0.25
      line.material.transparent = true
      line.position.x = - 4
      group.add( line )
      helpers.add( named( new BoxHelper( line ), 'Edges Box' ) )

      helpers.add( named( new BoxHelper( group ), 'Group Box' ) )
      helpers.add( named( new BoxHelper( this.scene ), 'Scene Box' ) )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  showHelpersChanged() {
    if ( ! this.helpers ) return
    this.helpers.visible = this.showHelpers
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const t = - time * 0.3

    this.light.position.x = Math.sin( t * 1.7 ) * 300
    this.light.position.y = Math.cos( t * 1.5 ) * 400
    this.light.position.z = Math.cos( t * 1.3 ) * 300

    // Ten turns per loop.
    this.camera.position.x = 400 * Math.cos( t )
    this.camera.position.z = 400 * Math.sin( t )
    this.camera.lookAt( 0, 0, 0 )
  }
}

function named<T extends { name: string }>(object: T, name: string): T {
  object.name = name
  return object
}

registerEditorGroups(HelpersExample, {
  Main: ['showHelpers'],
  Hidden: ['light', 'camera', 'helpers', 'vnh', 'vth'],
})
