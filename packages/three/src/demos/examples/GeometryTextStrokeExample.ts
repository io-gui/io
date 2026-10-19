import {
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  ShapeGeometry
} from 'three/webgpu'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

type TextMaterials = { dark: MeshBasicMaterial; lite: MeshBasicMaterial; color: Color }

/**
 * Text in three writing directions (English left to right, Hebrew right to left, Chinese top to bottom), each a
 * translucent `ShapeGeometry` fill and, 150 units in front of it, its outlines as stroke meshes from
 * `SVGLoader.pointsToStroke`. Static.
 */
@Register
export class GeometryTextStrokeExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 10000 )
    camera.name = 'Camera'
    camera.position.set( 0, - 400, 1000 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xf0f0f0 )

    void this.loadFont()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadFont() {
    try {
      const font = await new FontLoader().loadAsync( 'https://threejs.org/examples/fonts/MPLUSRounded1c/MPLUSRounded1c-Regular.typeface.json' )

      const color = new Color( 0x006699 )

      const matDark = new MeshBasicMaterial( {
        color: color,
        side: DoubleSide
      } )

      const matLite = new MeshBasicMaterial( {
        color: color,
        transparent: true,
        opacity: 0.4,
        side: DoubleSide
      } )

      const material = {
        dark: matDark,
        lite: matLite,
        color: color
      }

      const english = '   Three.js\nStroke text.' // Left to right

      const hebrew = 'טקסט קו' // Right to left

      const chinese = '文字描邊' // Top to bottom

      const message1 = generateStrokeText( font, material, english, 80, 'ltr' )
      const message2 = generateStrokeText( font, material, hebrew, 80, 'rtl' )
      const message3 = generateStrokeText( font, material, chinese, 80, 'tb' )

      message1.name = 'English'
      message2.name = 'Hebrew'
      message3.name = 'Chinese'

      message1.position.x = - 100

      message2.position.x = - 100
      message2.position.y = - 300

      message3.position.x = 300
      message3.position.y = - 300

      this.scene.add( message1, message2, message3 )

      this.notify({kind: 'structure'})
      this._frameTarget = [ message1, message2, message3 ]
    } catch ( e ) {
      console.error( e )
    }
  }
}

function generateStrokeText( font: Font, material: TextMaterials, message: string, size: number, direction: 'ltr' | 'rtl' | 'tb' = 'ltr' ) {
  const shapes = font.generateShapes( message, size, direction )
  const geometry = new ShapeGeometry( shapes )
  const strokeText = new Group()

  geometry.computeBoundingBox()
  const xMid = - 0.5 * ( geometry.boundingBox!.max.x - geometry.boundingBox!.min.x )
  geometry.translate( xMid, 0, 0 )

  // make shape ( N.B. edge view not visible )

  const text = new Mesh( geometry, material.lite )
  text.name = 'Fill'
  text.position.z = - 150
  strokeText.add( text )

  // make line shape ( N.B. edge view remains visible )

  const holeShapes: Path[] = []

  for ( let i = 0; i < shapes.length; i ++ ) {
    const shape = shapes[ i ]

    if ( shape.holes && shape.holes.length > 0 ) {
      for ( let j = 0; j < shape.holes.length; j ++ ) {
        const hole = shape.holes[ j ]
        holeShapes.push( hole )
      }
    }
  }

  const outlines: Path[] = [ ...shapes, ...holeShapes ]

  const style = SVGLoader.getStrokeStyle( 5, material.color.getStyle() )

  for ( let i = 0; i < outlines.length; i ++ ) {
    const shape = outlines[ i ]

    const points = shape.getPoints()

    const geometry = SVGLoader.pointsToStroke( points, style )

    geometry.translate( xMid, 0, 0 )

    const strokeMesh = new Mesh( geometry, material.dark )
    strokeMesh.name = 'Stroke'
    strokeText.add( strokeMesh )
  }

  return strokeText
}
