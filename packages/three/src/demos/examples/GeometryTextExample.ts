import {
  Color,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight
} from 'three/webgpu'
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const FONTS = [ 'helvetiker', 'optimer', 'gentilis', 'droid/droid_sans', 'droid/droid_serif' ]
const WEIGHTS = [ 'regular', 'bold' ]

const depth = 20,
  size = 70,
  hover = 30,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5

/**
 * Extruded 3D text over a translucent floor that shows its mirror image. Type in `text` (the source takes key presses);
 * `font`, `weight`, `bevelEnabled` and `changeColor` (the point light's hue) are in the Document tab. The floor is
 * unselectable, and views frame the text. The pointer drag that turned the text is dropped. Static.
 */
@Register
export class GeometryTextExample extends Document {

  public group: Group
  public pointLight: PointLight
  private materials = [
    new MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
    new MeshPhongMaterial( { color: 0xffffff } ) // side
  ]
  private textMesh1?: Mesh
  private textMesh2?: Mesh
  private font?: Font
  /** Loaded fonts by file, as the source's `Cache`. */
  private fonts = new Map<string, Promise<Font>>()
  /** Counts font loads, so a slow font does not replace a newer pick. */
  private loads = 0
  private framed = false

  @Property({type: String, value: 'three.js'})
  declare text: string

  @Property({type: String, value: 'optimer'})
  declare fontName: string

  @Property({type: String, value: 'bold'})
  declare fontWeight: string

  @Property({type: Boolean, value: true})
  declare bevelEnabled: boolean

  /** Gives the point light a random hue. */
  changeColor = () => {
    this.pointLight.color.setHSL( Math.random(), 1, 0.5 )
    this.notify({kind: 'other'})
  }

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x000000 )
    this.scene.fog = new Fog( 0x000000, 250, 1400 )

    // LIGHTS

    const dirLight = new DirectionalLight( 0xffffff, 0.4 )
    dirLight.name = 'Key'
    dirLight.position.set( 0, 0, 1 ).normalize()
    this.scene.add( dirLight )

    this.pointLight = new PointLight( 0xffffff, 4.5, 0, 0 )
    this.pointLight.name = 'Point'
    this.pointLight.color.setHSL( Math.random(), 1, 0.5 )
    this.pointLight.position.set( 0, 100, 90 )
    this.scene.add( this.pointLight )

    this.group = new Group()
    this.group.name = 'Text'
    this.group.position.y = 100
    this.scene.add( this.group )

    const plane = new Mesh(
      new PlaneGeometry( 10000, 10000 ),
      new MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    )
    plane.name = 'Floor'
    plane.position.y = 100
    plane.rotation.x = - Math.PI / 2
    plane.userData.selectable = false
    this.scene.add( plane )

    void this.loadFont()
  }

  textChanged() { this.refreshText() }
  bevelEnabledChanged() { this.refreshText() }
  fontNameChanged() { void this.loadFont() }
  fontWeightChanged() { void this.loadFont() }

  private async loadFont() {
    if ( ! this.fonts ) return
    const load = ++ this.loads
    const file = 'https://threejs.org/examples/fonts/' + this.fontName + '_' + this.fontWeight + '.typeface.json'

    let font = this.fonts.get( file )
    if ( ! font ) {
      font = new FontLoader().loadAsync( file )
      this.fonts.set( file, font )
    }

    try {
      const loaded = await font
      if ( load !== this.loads ) return
      this.font = loaded
      this.refreshText()
    } catch ( e ) {
      this.fonts.delete( file )
      console.error( e )
    }
  }

  private createText(font: Font) {
    const textGeo = new TextGeometry( this.text, {
      font: font,
      size: size,
      depth: depth,
      curveSegments: curveSegments,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: this.bevelEnabled
    } )

    textGeo.computeBoundingBox()

    const centerOffset = - 0.5 * ( textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x )

    this.textMesh1 = new Mesh( textGeo, this.materials )
    this.textMesh1.name = 'Text'
    this.textMesh1.position.x = centerOffset
    this.textMesh1.position.y = hover
    this.textMesh1.position.z = 0
    this.textMesh1.rotation.x = 0
    this.textMesh1.rotation.y = Math.PI * 2
    this.group.add( this.textMesh1 )

    this.textMesh2 = new Mesh( textGeo, this.materials )
    this.textMesh2.name = 'Mirror'
    this.textMesh2.position.x = centerOffset
    this.textMesh2.position.y = - hover
    this.textMesh2.position.z = depth
    this.textMesh2.rotation.x = Math.PI
    this.textMesh2.rotation.y = Math.PI * 2
    this.group.add( this.textMesh2 )
  }

  private refreshText() {
    if ( ! this.group ) return

    if ( this.textMesh1 ) {
      this.textMesh1.geometry.dispose()
      this.group.remove( this.textMesh1 )
      this.textMesh1 = undefined
    }

    if ( this.textMesh2 ) {
      this.group.remove( this.textMesh2 )
      this.textMesh2 = undefined
    }

    if ( this.text && this.font ) this.createText( this.font )

    this.notify({kind: 'structure'})

    // The floor dwarfs the text: frame the text once it first shows.
    if ( ! this.framed && this.textMesh1 ) {
      this.framed = true
      this.group.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: this.group}, true)
    }
  }
}

registerEditorConfig(GeometryTextExample, [
  ['fontName', ioOptionSelect({model: new Menu({options: FONTS})})],
  ['fontWeight', ioOptionSelect({model: new Menu({options: WEIGHTS})})],
])

registerEditorGroups(GeometryTextExample, {
  Main: ['text', 'fontName', 'fontWeight', 'bevelEnabled', 'changeColor'],
  Hidden: ['group', 'pointLight', 'materials', 'textMesh1', 'textMesh2', 'font', 'fonts', 'loads', 'framed'],
})
