import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Fog, Line, LineDashedMaterial, LineSegments, PerspectiveCamera, Vector3 } from 'three/webgpu'
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one turn (0.25 rad/s about x and y): the timeline length. */
const PERIOD = 8 * Math.PI

/** The edges of a box, as line segment pairs. */
function box( width: number, height: number, depth: number ) {
  width = width * 0.5
  height = height * 0.5
  depth = depth * 0.5

  const geometry = new BufferGeometry()
  const position: number[] = []

  position.push(
    - width, - height, - depth,
    - width, height, - depth,

    - width, height, - depth,
    width, height, - depth,

    width, height, - depth,
    width, - height, - depth,

    width, - height, - depth,
    - width, - height, - depth,

    - width, - height, depth,
    - width, height, depth,

    - width, height, depth,
    width, height, depth,

    width, height, depth,
    width, - height, depth,

    width, - height, depth,
    - width, - height, depth,

    - width, - height, - depth,
    - width, - height, depth,

    - width, height, - depth,
    - width, height, depth,

    width, height, - depth,
    width, height, depth,

    width, - height, - depth,
    width, - height, depth
  )

  geometry.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) )

  return geometry
}

/** A dashed Hilbert curve inside a dashed box (`LineDashedMaterial`, `computeLineDistances`). Turns with document time; plays when opened. */
@Register
export class LinesDashedExample extends Document {

  public objects: Line[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 200 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 150 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x111111 )
    this.scene.fog = new Fog( 0x111111, 150, 200 )

    const subdivisions = 6
    const recursion = 1

    const points = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7 )
    const spline = new CatmullRomCurve3( points )

    const samples = spline.getPoints( points.length * subdivisions )
    const geometrySpline = new BufferGeometry().setFromPoints( samples )

    const line = new Line( geometrySpline, new LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 0.5 } ) )
    line.name = 'Hilbert'
    line.computeLineDistances()

    this.objects.push( line )
    this.scene.add( line )

    const geometryBox = box( 50, 50, 50 )

    const lineSegments = new LineSegments( geometryBox, new LineDashedMaterial( { color: 0xffaa00, dashSize: 3, gapSize: 1 } ) )
    lineSegments.name = 'Box'
    lineSegments.computeLineDistances()

    this.objects.push( lineSegments )
    this.scene.add( lineSegments )
  }

  override onAnimate(delta: number, time: number) {
    for ( const object of this.objects ) {
      object.rotation.x = 0.25 * time
      object.rotation.y = 0.25 * time
    }
  }
}
