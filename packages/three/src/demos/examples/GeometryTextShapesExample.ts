import {
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  ShapeGeometry
} from 'three/webgpu'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * Two lines of text from a typeface's shapes: a translucent `ShapeGeometry` fill, and the outlines (shapes and holes)
 * as lines 150 units in front of it, which stay visible edge-on. Static.
 */
@Register
export class GeometryTextShapesExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 10000 )
    camera.name = 'Camera'
    camera.position.set( 0, - 400, 600 )
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
      const font = await new FontLoader().loadAsync( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' )

      const color = 0x006699

      const matDark = new LineBasicMaterial( {
        color: color,
        side: DoubleSide
      } )

      const matLite = new MeshBasicMaterial( {
        color: color,
        transparent: true,
        opacity: 0.4,
        side: DoubleSide
      } )

      const message = '   Three.js\nSimple text.'

      const shapes = font.generateShapes( message, 100 )

      const geometry = new ShapeGeometry( shapes )

      geometry.computeBoundingBox()

      const xMid = - 0.5 * ( geometry.boundingBox!.max.x - geometry.boundingBox!.min.x )

      geometry.translate( xMid, 0, 0 )

      // make shape ( N.B. edge view not visible )

      const text = new Mesh( geometry, matLite )
      text.name = 'Fill'
      text.position.z = - 150
      this.scene.add( text )

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

      const lineText = new Group()
      lineText.name = 'Outlines'

      for ( let i = 0; i < outlines.length; i ++ ) {
        const shape = outlines[ i ]

        const points = shape.getPoints()
        const geometry = new BufferGeometry().setFromPoints( points )

        geometry.translate( xMid, 0, 0 )

        const lineMesh = new Line( geometry, matDark )
        lineMesh.name = 'Outline'
        lineText.add( lineMesh )
      }

      this.scene.add( lineText )

      this.notify({kind: 'structure'})
      this._frameTarget = [ text, lineText ]
    } catch ( e ) {
      console.error( e )
    }
  }
}
