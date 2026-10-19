import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Line,
  Line2NodeMaterial,
  LineBasicNodeMaterial,
  LineDashedNodeMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3
} from 'three/webgpu'
import { Line2 } from 'three/addons/lines/webgpu/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Dash and gap lengths by ratio. */
const DASH_GAP: Record<string, [ number, number ]> = { '2 : 1': [ 2, 1 ], '1 : 1': [ 1, 1 ], '1 : 2': [ 1, 2 ] }

/**
 * A 3D Hilbert curve as a fat `Line2` with vertex colors, beside the same curve as a 1 px `Line` strip. The line type,
 * width (pixels, or world units), `alphaToCoverage` and dash settings are in the Document tab. The source's inset view,
 * which draws the same camera's view small, is dropped: views of any size show the pixel widths. The source camera is
 * the active camera. Static.
 */
@Register
export class LinesFatExample extends Document {

  public line: Line2
  public line1: Line
  private matLine: Line2NodeMaterial
  private matLineBasic: LineBasicNodeMaterial
  private matLineDashed: LineDashedNodeMaterial

  @Property({type: String, value: 'LineGeometry'})
  declare lineType: string

  @Property({type: Boolean, value: false})
  declare worldUnits: boolean

  @Property({type: Number, value: 5})
  declare width: number

  @Property({type: Boolean, value: false})
  declare alphaToCoverage: boolean

  @Property({type: Boolean, value: false})
  declare dashed: boolean

  @Property({type: Number, value: 1})
  declare dashScale: number

  @Property({type: Number, value: 0})
  declare dashOffset: number

  @Property({type: String, value: '1 : 1'})
  declare dashGap: string

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x000000 )

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( - 40, 0, 60 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Position and THREE.Color Data

    const positions = []
    const colors = []

    const points = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 )

    const spline = new CatmullRomCurve3( points )
    const divisions = Math.round( 12 * points.length )
    const point = new Vector3()
    const lineColor = new Color()

    for ( let i = 0, l = divisions; i < l; i ++ ) {
      const t = i / l

      spline.getPoint( t, point )
      positions.push( point.x, point.y, point.z )

      lineColor.setHSL( t, 1.0, 0.5, SRGBColorSpace )
      colors.push( lineColor.r, lineColor.g, lineColor.b )
    }

    // Line2 ( LineGeometry, LineMaterial )

    const geometry = new LineGeometry()
    geometry.setPositions( positions )
    geometry.setColors( colors )

    this.matLine = new Line2NodeMaterial( {
      color: 0xffffff,
      linewidth: 5, // in world units with size attenuation, pixels otherwise
      vertexColors: true,
      dashed: false,
      alphaToCoverage: false,
    } )

    this.line = new Line2( geometry, this.matLine )
    this.line.name = 'Line2'
    this.line.computeLineDistances()
    this.line.scale.set( 1, 1, 1 )
    this.scene.add( this.line )

    // THREE.Line ( THREE.BufferGeometry, THREE.LineBasicNodeMaterial ) - rendered with gl.LINE_STRIP

    const geo = new BufferGeometry()
    geo.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geo.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )

    this.matLineBasic = new LineBasicNodeMaterial( { vertexColors: true } )
    this.matLineDashed = new LineDashedNodeMaterial( { vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 } )

    this.line1 = new Line( geo, this.matLineBasic )
    this.line1.name = 'LineStrip'
    this.line1.computeLineDistances()
    this.line1.visible = false
    this.scene.add( this.line1 )
  }

  lineTypeChanged() {
    if ( ! this.line ) return
    this.line.visible = this.lineType === 'LineGeometry'
    this.line1.visible = this.lineType !== 'LineGeometry'
    this.notify({kind: 'other'})
  }

  worldUnitsChanged() {
    if ( ! this.matLine ) return
    this.matLine.worldUnits = this.worldUnits
    this.matLine.needsUpdate = true
    // The source resets the width to the top of the new range.
    this.width = this.worldUnits ? 0.5 : 10
    this.notify({kind: 'material'})
  }

  widthChanged() {
    if ( ! this.matLine ) return
    this.matLine.linewidth = this.width
    this.notify({kind: 'material'})
  }

  alphaToCoverageChanged() {
    if ( ! this.matLine ) return
    this.matLine.alphaToCoverage = this.alphaToCoverage
    this.notify({kind: 'material'})
  }

  dashedChanged() {
    if ( ! this.matLine ) return
    this.matLine.dashed = this.dashed
    this.line1.material = this.dashed ? this.matLineDashed : this.matLineBasic
    this.notify({kind: 'material'})
  }

  dashScaleChanged() {
    if ( ! this.matLine ) return
    this.matLine.scale = this.dashScale
    this.matLineDashed.scale = this.dashScale
    this.notify({kind: 'material'})
  }

  dashOffsetChanged() {
    if ( ! this.matLine ) return
    this.matLine.dashOffset = this.dashOffset
    this.matLineDashed.dashOffset = this.dashOffset
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

registerEditorConfig(LinesFatExample, [
  ['lineType', ioOptionSelect({model: new Menu({options: [ 'LineGeometry', 'line-strip' ]})})],
  ['width', ioNumberSlider({min: 0.1, max: 10, step: 0.1})],
  ['dashScale', ioNumberSlider({min: 0.5, max: 2, step: 0.1})],
  ['dashOffset', ioNumberSlider({min: 0, max: 5, step: 0.1})],
  ['dashGap', ioOptionSelect({model: new Menu({options: Object.keys( DASH_GAP )})})],
])

registerEditorGroups(LinesFatExample, {
  Main: ['lineType', 'worldUnits', 'width', 'alphaToCoverage', 'dashed', 'dashScale', 'dashOffset', 'dashGap'],
  Hidden: ['line', 'line1', 'matLine', 'matLineBasic', 'matLineDashed'],
})
