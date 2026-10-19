import { Color, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, ShapeGeometry } from 'three/webgpu'
import { SVGLoader, SVGResult, StrokeStyle } from 'three/addons/loaders/SVGLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const FILES: Record<string, string> = {
  'Tiger': 'tiger.svg',
  'Joins and caps': 'lineJoinsAndCaps.svg',
  'Hexagon': 'hexagon.svg',
  'Energy': 'energy.svg',
  'Test 1': 'tests/1.svg',
  'Test 2': 'tests/2.svg',
  'Test 3': 'tests/3.svg',
  'Test 4': 'tests/4.svg',
  'Test 5': 'tests/5.svg',
  'Test 6': 'tests/6.svg',
  'Test 7': 'tests/7.svg',
  'Test 8': 'tests/8.svg',
  'Test 9': 'tests/9.svg',
  'Units': 'tests/units.svg',
  'Ordering': 'tests/ordering.svg',
  'Defs': 'tests/testDefs/Svg-defs.svg',
  'Defs2': 'tests/testDefs/Svg-defs2.svg',
  'Defs3': 'tests/testDefs/Wave-defs.svg',
  'Defs4': 'tests/testDefs/defs4.svg',
  'Defs5': 'tests/testDefs/defs5.svg',
  'Style CSS inside defs': 'style-css-inside-defs.svg',
  'Styled Paths': 'styled-paths.svg',
  'Multiple CSS classes': 'multiple-css-classes.svg',
  'Zero Radius': 'zero-radius.svg',
  'Styles in svg tag': 'tests/styles.svg',
  'Round join': 'tests/roundJoinPrecisionIssue.svg',
  'Ellipse Transformations': 'tests/ellipseTransform.svg',
  'singlePointTest': 'singlePointTest.svg',
  'singlePointTest2': 'singlePointTest2.svg',
  'singlePointTest3': 'singlePointTest3.svg',
  'emptyPath': 'emptyPath.svg',
  'emoji': 'emoji.svg',
  'blueprint': 'blueprint.svg',
  'wideStroke': 'tests/wideStroke.svg',
  'letter': 'tests/letter.svg',
}

/**
 * SVG files turned into meshes: fill shapes and strokes, each optionally in wireframe (Document tab: `file`,
 * `fills`, `strokes`, `fillWire`, `strokeWire`). Shapes and strokes draw in file order (`renderOrder`). The source's
 * grid is dropped.
 */
@Register
export class LoaderSvgExample extends Document {

  public drawing?: Group

  /** The SVG file, a path under the examples' `models/svg/`. */
  @Property({type: String, value: 'tiger.svg'})
  declare file: string

  /** Draws the fill shapes (the source's `drawFillShapes`). */
  @Property({type: Boolean, value: true})
  declare fills: boolean

  /** Draws the strokes (the source's `drawStrokes`). */
  @Property({type: Boolean, value: true})
  declare strokes: boolean

  /** Fill shapes in wireframe (the source's `fillShapesWireframe`). */
  @Property({type: Boolean, value: false})
  declare fillWire: boolean

  /** Strokes in wireframe (the source's `strokesWireframe`). */
  @Property({type: Boolean, value: false})
  declare strokeWire: boolean

  private loader = new SVGLoader()
  private data?: SVGResult
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 200 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xb0b0b0 )

    this.fileChanged()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  fileChanged() {
    if ( ! this.loader ) return
    void this.loadSVG( this.file )
  }

  fillsChanged() { this.build() }
  strokesChanged() { this.build() }
  fillWireChanged() { this.build() }
  strokeWireChanged() { this.build() }

  private async loadSVG(file: string) {
    const load = ++ this.loads

    try {
      const data = await this.loader.loadAsync( 'https://threejs.org/examples/models/svg/' + file )
      if ( load !== this.loads ) return

      this.data = data
      this.build()
      if ( this.drawing ) this._frameTarget = this.drawing
    } catch ( e ) {
      console.error( e )
    }
  }

  /** Builds the meshes of the loaded file for the current drawing options, replacing the previous ones. */
  private build() {
    if ( ! this.data ) return

    this.disposeDrawing()

    const group = new Group()
    group.name = 'Drawing'
    group.scale.multiplyScalar( 0.25 )
    group.position.x = - 70
    group.position.y = 70
    group.scale.y *= - 1

    let renderOrder = 0

    for ( const path of this.data.paths ) {

      if ( this.fills ) {
        const material = SVGLoader.createFillMaterial( path )
        if ( material ) {
          material.wireframe = this.fillWire
          const shapes = path.toShapes()
          for ( const shape of shapes ) {
            const geometry = new ShapeGeometry( shape )
            const mesh = new Mesh( geometry, material )
            mesh.name = 'Fill'
            mesh.renderOrder = renderOrder ++
            group.add( mesh )
          }
        }
      }

      if ( this.strokes ) {
        const material = SVGLoader.createStrokeMaterial( path )
        if ( material ) {
          material.wireframe = this.strokeWire
          for ( const subPath of path.subPaths ) {
            const geometry = SVGLoader.pointsToStroke( subPath.getPoints(), path.userData.style as StrokeStyle )
            if ( geometry ) {
              const mesh = new Mesh( geometry, material )
              mesh.name = 'Stroke'
              mesh.renderOrder = renderOrder ++
              group.add( mesh )
            }
          }
        }
      }
    }

    this.drawing = group
    this.scene.add( group )
    this.notify({kind: 'structure'})
  }

  private disposeDrawing() {
    if ( ! this.drawing ) return
    this.drawing.traverse( ( child ) => {
      const mesh = child as Mesh<ShapeGeometry, MeshBasicMaterial>
      if ( ! mesh.isMesh ) return
      mesh.geometry.dispose()
      mesh.material.dispose()
    } )
    this.scene.remove( this.drawing )
    this.drawing = undefined
  }
}

registerEditorConfig(LoaderSvgExample, [
  ['file', ioOptionSelect({model: new Menu({options: Object.entries( FILES ).map( ( [ id, value ] ) => ({id, value}) )})})],
])

registerEditorGroups(LoaderSvgExample, {
  Main: ['file', 'fills', 'strokes', 'fillWire', 'strokeWire'],
  Hidden: ['drawing', 'loader', 'data', 'loads'],
})
