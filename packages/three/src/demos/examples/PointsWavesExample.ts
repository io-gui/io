import { Box3, InstancedMesh, PlaneGeometry, PointsNodeMaterial, Sphere, Vector3 } from 'three/webgpu'
import { color, distance, float, instanceIndex, positionView, sin, step, uv, vec2, vec3 } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50

/** The source's wave phase advances 0.1 per frame: 6 per second at 60 fps. */
const PHASE_RATE = 6

/**
 * Seconds in which the waves repeat: the timeline length, so looping is seamless. The phase moves the x wave by
 * `0.3 * 6` and the z wave by `0.5 * 6` rad/s: three and five cycles in 10π/3 s.
 */
const PERIOD = 10 * Math.PI / 3

/**
 * A 50 × 50 grid of dots rippling in two sine waves, each dot growing with its height. The source's GLSL point shader is
 * a `PointsNodeMaterial` whose position and size come from the instance index and document time, drawn as one
 * `InstancedMesh` of quads (WebGPU points are 1 px). The pointer-driven camera is dropped. Plays when opened.
 */
@Register
export class PointsWavesExample extends Document {

  public particles: InstancedMesh<PlaneGeometry, PointsNodeMaterial>

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const numParticles = AMOUNTX * AMOUNTY

    const ix = float( instanceIndex.div( AMOUNTY ) )
    const iy = float( instanceIndex.mod( AMOUNTY ) )
    const count = this.timeline.timeNode.mul( PHASE_RATE )

    const waveX = sin( ix.add( count ).mul( 0.3 ) )
    const waveY = sin( iy.add( count ).mul( 0.5 ) )

    const position = vec3(
      ix.mul( SEPARATION ).sub( ( AMOUNTX * SEPARATION ) / 2 ),
      waveX.mul( 50 ).add( waveY.mul( 50 ) ),
      iy.mul( SEPARATION ).sub( ( AMOUNTY * SEPARATION ) / 2 )
    )

    const scale = waveX.add( 1 ).mul( 20 ).add( waveY.add( 1 ).mul( 20 ) )

    const material = new PointsNodeMaterial( {
      positionNode: position,
      // gl_PointSize = scale * ( 300.0 / - mvPosition.z )
      sizeNode: scale.mul( 300 ).div( positionView.z.negate() ),
      sizeAttenuation: false,
      colorNode: color( 0xffffff ),
      // if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
      opacityNode: step( distance( uv(), vec2( 0.5 ) ), float( 0.475 ) ),
      alphaTest: 0.5,
    } )

    this.particles = new InstancedMesh( new PlaneGeometry( 1, 1 ), material, numParticles )
    this.particles.name = 'Particles'

    // The instance matrices stay identity: the bounds of one quad. Use the grid's.
    this.particles.boundingBox = new Box3(
      new Vector3( - ( AMOUNTX * SEPARATION ) / 2, - 100, - ( AMOUNTY * SEPARATION ) / 2 ),
      new Vector3( ( AMOUNTX - 1 ) * SEPARATION - ( AMOUNTX * SEPARATION ) / 2, 100, ( AMOUNTY - 1 ) * SEPARATION - ( AMOUNTY * SEPARATION ) / 2 )
    )
    this.particles.boundingSphere = this.particles.boundingBox.getBoundingSphere( new Sphere() )

    this.scene.add( this.particles )
  }
}
