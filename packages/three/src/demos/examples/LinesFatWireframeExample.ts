import {
  Color,
  IcosahedronGeometry,
  Line2NodeMaterial,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  PerspectiveCamera,
  WireframeGeometry
} from 'three/webgpu'
import { Wireframe } from 'three/addons/lines/webgpu/Wireframe.js'
import { WireframeGeometry2 } from 'three/addons/lines/WireframeGeometry2.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Dash and gap lengths by ratio. */
const DASH_GAP: Record<string, [ number, number ]> = { '2 : 1': [ 2, 1 ], '1 : 1': [ 1, 1 ], '1 : 2': [ 1, 2 ] }

/**
 * An icosahedron's edges as a fat `Wireframe` (`WireframeGeometry2`), beside the same edges as 1 px `LineSegments`.
 * The line type, pixel width and dash settings are in the Document tab. The source's inset view, which draws the same
 * camera's view small, is dropped: views of any size show the pixel widths. The source camera is kept as `Camera`.
 * Static.
 */
@Register
export class LinesFatWireframeExample extends Document {

  public wireframe: Wireframe
  public wireframe1: LineSegments
  private matLine: Line2NodeMaterial
  private matLineBasic: LineBasicMaterial
  private matLineDashed: LineDashedMaterial

  @Property({type: String, value: 'LineGeometry'})
  declare lineType: string

  @Property({type: Number, value: 5})
  declare width: number

  @Property({type: Boolean, value: false})
  declare dashed: boolean

  @Property({type: Number, value: 1})
  declare dashScale: number

  @Property({type: String, value: '1 : 1'})
  declare dashGap: string

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x000000 )

    const camera = new PerspectiveCamera( 40, 1, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 50, 0, 50 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )

    // Wireframe ( WireframeGeometry2, Line2NodeMaterial )

    const geo = new IcosahedronGeometry( 20, 1 )

    const geometry = new WireframeGeometry2( geo )

    this.matLine = new Line2NodeMaterial( {
      color: 0x4080ff,
      linewidth: 5, // in world units with size attenuation, pixels otherwise
      dashed: false
    } )

    this.wireframe = new Wireframe( geometry, this.matLine )
    this.wireframe.name = 'Wireframe'
    this.wireframe.computeLineDistances()
    this.wireframe.scale.set( 1, 1, 1 )
    this.scene.add( this.wireframe )

    // Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE

    const wireGeo = new WireframeGeometry( geo )

    this.matLineBasic = new LineBasicMaterial( { color: 0x4080ff } )
    this.matLineDashed = new LineDashedMaterial( { scale: 2, dashSize: 1, gapSize: 1 } )

    this.wireframe1 = new LineSegments( wireGeo, this.matLineBasic )
    this.wireframe1.name = 'LineSegments'
    this.wireframe1.computeLineDistances()
    this.wireframe1.visible = false
    this.scene.add( this.wireframe1 )
  }

  lineTypeChanged() {
    if ( ! this.wireframe ) return
    this.wireframe.visible = this.lineType === 'LineGeometry'
    this.wireframe1.visible = this.lineType !== 'LineGeometry'
    this.notify({kind: 'other'})
  }

  widthChanged() {
    if ( ! this.matLine ) return
    this.matLine.linewidth = this.width
    this.notify({kind: 'material'})
  }

  dashedChanged() {
    if ( ! this.matLine ) return
    this.matLine.dashed = this.dashed
    this.wireframe1.material = this.dashed ? this.matLineDashed : this.matLineBasic
    this.notify({kind: 'material'})
  }

  dashScaleChanged() {
    if ( ! this.matLine ) return
    this.matLine.scale = this.dashScale
    this.matLineDashed.scale = this.dashScale
    this.notify({kind: 'material'})
  }

  dashGapChanged() {
    if ( ! this.matLine ) return
    const [ dashSize, gapSize ] = DASH_GAP[ this.dashGap ]
    this.matLine.dashSize = dashSize
    this.matLine.gapSize = gapSize
    this.matLineDashed.dashSize = dashSize
    this.matLineDashed.gapSize = gapSize
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(LinesFatWireframeExample, [
  ['lineType', ioOptionSelect({model: new Menu({options: [ 'LineGeometry', 'gl.LINE' ]})})],
  ['width', ioNumberSlider({min: 1, max: 10, step: 0.1})],
  ['dashScale', ioNumberSlider({min: 0.5, max: 1, step: 0.1})],
  ['dashGap', ioOptionSelect({model: new Menu({options: Object.keys( DASH_GAP )})})],
])

registerEditorGroups(LinesFatWireframeExample, {
  Main: ['lineType', 'width', 'dashed', 'dashScale', 'dashGap'],
  Hidden: ['wireframe', 'wireframe1', 'matLine', 'matLineBasic', 'matLineDashed'],
})
