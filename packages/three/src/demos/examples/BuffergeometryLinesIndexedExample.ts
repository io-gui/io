import { BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments, Vector3 } from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one turn (0.5 rad/s): the timeline length. */
const PERIOD = 4 * Math.PI

/** Four rows of Koch snowflake iterations as one indexed LineSegments geometry, turning with document time. Plays when opened. */
@Register
export class BuffergeometryLinesIndexedExample extends Document {

  public parentNode: Group

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const geometry = new BufferGeometry()
    const material = new LineBasicMaterial( { vertexColors: true } )

    const indices: number[] = []
    const positions: number[] = []
    const colors: number[] = []

    let nextPositionsIndex = 0

    //

    const iterationCount = 4
    const rangle = 60 * Math.PI / 180.0

    function addVertex( v: Vector3 ) {
      positions.push( v.x, v.y, v.z )
      colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 )

      return nextPositionsIndex ++
    }

    // simple Koch curve

    function snowflakeIteration( p0: Vector3, p4: Vector3, depth: number ) {
      if ( -- depth < 0 ) {
        const i = nextPositionsIndex - 1 // p0 already there
        addVertex( p4 )
        indices.push( i, i + 1 )

        return
      }

      const v = p4.clone().sub( p0 )
      const vTier = v.clone().multiplyScalar( 1 / 3 )
      const p1 = p0.clone().add( vTier )

      const angle = Math.atan2( v.y, v.x ) + rangle
      const length = vTier.length()
      const p2 = p1.clone()
      p2.x += Math.cos( angle ) * length
      p2.y += Math.sin( angle ) * length

      const p3 = p0.clone().add( vTier ).add( vTier )

      snowflakeIteration( p0, p1, depth )
      snowflakeIteration( p1, p2, depth )
      snowflakeIteration( p2, p3, depth )
      snowflakeIteration( p3, p4, depth )
    }

    function snowflake( points: Vector3[], loop: boolean, xOffset: number ) {
      for ( let iteration = 0; iteration !== iterationCount; iteration ++ ) {
        addVertex( points[ 0 ] )

        for ( let pIndex = 0, pCount = points.length - 1; pIndex !== pCount; pIndex ++ ) {
          snowflakeIteration( points[ pIndex ], points[ pIndex + 1 ], iteration )
        }

        if ( loop ) snowflakeIteration( points[ points.length - 1 ], points[ 0 ], iteration )

        // translate input curve for next iteration

        for ( let pIndex = 0, pCount = points.length; pIndex !== pCount; pIndex ++ ) {
          points[ pIndex ].x += xOffset
        }
      }
    }

    let y = 0

    snowflake(
      [
        new Vector3( 0, y, 0 ),
        new Vector3( 500, y, 0 )
      ],
      false, 600
    )

    y += 600

    snowflake(
      [
        new Vector3( 0, y, 0 ),
        new Vector3( 250, y + 400, 0 ),
        new Vector3( 500, y, 0 )
      ],
      true, 600
    )

    y += 600

    snowflake(
      [
        new Vector3( 0, y, 0 ),
        new Vector3( 500, y, 0 ),
        new Vector3( 500, y + 500, 0 ),
        new Vector3( 0, y + 500, 0 )
      ],
      true, 600
    )

    y += 1000

    snowflake(
      [
        new Vector3( 250, y, 0 ),
        new Vector3( 500, y, 0 ),
        new Vector3( 250, y, 0 ),
        new Vector3( 250, y + 250, 0 ),
        new Vector3( 250, y, 0 ),
        new Vector3( 0, y, 0 ),
        new Vector3( 250, y, 0 ),
        new Vector3( 250, y - 250, 0 ),
        new Vector3( 250, y, 0 )
      ],
      false, 600
    )

    //

    geometry.setIndex( indices )
    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )
    geometry.computeBoundingSphere()

    const lineSegments = new LineSegments( geometry, material )
    lineSegments.name = 'Snowflakes'
    lineSegments.position.x -= 1200
    lineSegments.position.y -= 1200

    this.parentNode = new Group()
    this.parentNode.name = 'Pivot'
    this.parentNode.add( lineSegments )

    this.scene.add( this.parentNode )
  }

  override onAnimate(delta: number, time: number) {
    this.parentNode.rotation.z = time * 0.5
  }
}
