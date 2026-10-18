import {
  Color,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  SRGBColorSpace
} from 'three/webgpu'
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js'
import { Font } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

const depth = 20,
  size = 70,
  hover = 30,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5

/**
 * Extruded text in a TrueType pixel font (`TTFLoader`, kenpixel), mirrored in a translucent floor as in GeometryText. Type
 * in `text` (Document tab; the source takes key presses). The floor is unselectable, and views frame the text. The
 * pointer drag that turned the text is dropped. Static.
 */
@Register
export class LoaderTtfExample extends Document {

  public group: Group
  private material = new MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
  private textMesh1?: Mesh
  private textMesh2?: Mesh
  private font?: Font
  private framed = false

  @Property({type: String, value: 'three.js'})
  declare text: string

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x000000 )
    this.scene.fog = new Fog( 0x000000, 250, 1400 )

    // LIGHTS

    const dirLight1 = new DirectionalLight( 0xffffff, 0.4 )
    dirLight1.name = 'Fill'
    dirLight1.position.set( 0, 0, 1 ).normalize()
    this.scene.add( dirLight1 )

    const dirLight2 = new DirectionalLight( 0xffffff, 2 )
    dirLight2.name = 'Key'
    dirLight2.position.set( 0, hover, 10 ).normalize()
    dirLight2.color.setHSL( Math.random(), 1, 0.5, SRGBColorSpace )
    this.scene.add( dirLight2 )

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

  private async loadFont() {
    try {
      const json = await new TTFLoader().loadAsync( 'https://threejs.org/examples/fonts/ttf/kenpixel.ttf' )
      this.font = new Font( json )
      this.refreshText()
    } catch ( e ) {
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
      bevelEnabled: true
    } )

    textGeo.computeBoundingBox()
    textGeo.computeVertexNormals()

    const centerOffset = - 0.5 * ( textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x )

    this.textMesh1 = new Mesh( textGeo, this.material )
    this.textMesh1.name = 'Text'
    this.textMesh1.position.x = centerOffset
    this.textMesh1.position.y = hover
    this.textMesh1.position.z = 0
    this.textMesh1.rotation.x = 0
    this.textMesh1.rotation.y = Math.PI * 2
    this.group.add( this.textMesh1 )

    this.textMesh2 = new Mesh( textGeo, this.material )
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

registerEditorGroups(LoaderTtfExample, {
  Main: ['text'],
  Hidden: ['group', 'material', 'textMesh1', 'textMesh2', 'font', 'framed'],
})
