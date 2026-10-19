import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3
} from 'three/webgpu'
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds in which the lines turn once (0.5 rad/s): the timeline length. */
const PERIOD = 4 * Math.PI

/**
 * Six 3D Hilbert curves with vertex colors: the top row draws the curve's points, the bottom row a Catmull-Rom spline
 * through them, colored by x, by y and by length. Neighbors turn in opposite directions with document time. The
 * active camera stands where the source's pointer-driven camera rests. Plays when opened.
 */
@Register
export class LinesColorsExample extends Document {

  public lines: Line[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 33, 400 / 250, 1, 10000 )
    camera.name = 'Camera'
    camera.position.set( 0, 200, 1000 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const hilbertPoints = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 )

    const geometry1 = new BufferGeometry()
    const geometry2 = new BufferGeometry()
    const geometry3 = new BufferGeometry()

    const subdivisions = 6

    let vertices: number[] = []
    let colors1: number[] = []
    let colors2: number[] = []
    let colors3: number[] = []

    const point = new Vector3()
    const color = new Color()

    const spline = new CatmullRomCurve3( hilbertPoints )

    for ( let i = 0; i < hilbertPoints.length * subdivisions; i ++ ) {

      const t = i / ( hilbertPoints.length * subdivisions )
      spline.getPoint( t, point )

      vertices.push( point.x, point.y, point.z )

      color.setHSL( 0.6, 1.0, Math.max( 0, - point.x / 200 ) + 0.5, SRGBColorSpace )
      colors1.push( color.r, color.g, color.b )

      color.setHSL( 0.9, 1.0, Math.max( 0, - point.y / 200 ) + 0.5, SRGBColorSpace )
      colors2.push( color.r, color.g, color.b )

      color.setHSL( i / ( hilbertPoints.length * subdivisions ), 1.0, 0.5, SRGBColorSpace )
      colors3.push( color.r, color.g, color.b )

    }

    geometry1.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
    geometry2.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
    geometry3.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )

    geometry1.setAttribute( 'color', new Float32BufferAttribute( colors1, 3 ) )
    geometry2.setAttribute( 'color', new Float32BufferAttribute( colors2, 3 ) )
    geometry3.setAttribute( 'color', new Float32BufferAttribute( colors3, 3 ) )

    //

    const geometry4 = new BufferGeometry()
    const geometry5 = new BufferGeometry()
    const geometry6 = new BufferGeometry()

    vertices = []
    colors1 = []
    colors2 = []
    colors3 = []

    for ( let i = 0; i < hilbertPoints.length; i ++ ) {

      const point = hilbertPoints[ i ]

      vertices.push( point.x, point.y, point.z )

      color.setHSL( 0.6, 1.0, Math.max( 0, ( 200 - hilbertPoints[ i ].x ) / 400 ) * 0.5 + 0.5, SRGBColorSpace )
      colors1.push( color.r, color.g, color.b )

      color.setHSL( 0.3, 1.0, Math.max( 0, ( 200 + hilbertPoints[ i ].x ) / 400 ) * 0.5, SRGBColorSpace )
      colors2.push( color.r, color.g, color.b )

      color.setHSL( i / hilbertPoints.length, 1.0, 0.5, SRGBColorSpace )
      colors3.push( color.r, color.g, color.b )

    }

    geometry4.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
    geometry5.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
    geometry6.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )

    geometry4.setAttribute( 'color', new Float32BufferAttribute( colors1, 3 ) )
    geometry5.setAttribute( 'color', new Float32BufferAttribute( colors2, 3 ) )
    geometry6.setAttribute( 'color', new Float32BufferAttribute( colors3, 3 ) )

    // Create lines and add to scene

    const material = new LineBasicMaterial( { color: 0xffffff, vertexColors: true } )

    const scale = 0.3, d = 225

    const parameters: [ string, [ number, number, number ], BufferGeometry ][] = [
      [ 'Spline X', [ - d, - d / 2, 0 ], geometry1 ],
      [ 'Spline Y', [ 0, - d / 2, 0 ], geometry2 ],
      [ 'Spline Hue', [ d, - d / 2, 0 ], geometry3 ],
      [ 'Points X', [ - d, d / 2, 0 ], geometry4 ],
      [ 'Points X Inverse', [ 0, d / 2, 0 ], geometry5 ],
      [ 'Points Hue', [ d, d / 2, 0 ], geometry6 ],
    ]

    for ( const [ name, position, geometry ] of parameters ) {

      const line = new Line( geometry, material )
      line.name = name
      line.scale.setScalar( scale * 1.5 )
      line.position.fromArray( position )
      this.scene.add( line )
      this.lines.push( line )

    }
  }

  override onAnimate(delta: number, time: number) {
    for ( let i = 0; i < this.lines.length; i ++ ) {
      this.lines[ i ].rotation.y = time * 0.5 * ( i % 2 ? 1 : - 1 )
    }
  }
}
