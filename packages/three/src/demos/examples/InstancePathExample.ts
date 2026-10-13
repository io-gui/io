import {
  Box3,
  Color,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshStandardNodeMaterial,
  NeutralToneMapping,
  Path,
  PMREMGenerator,
  Sphere,
  Vector2,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { abs, add, instancedBufferAttribute, positionLocal, mod, sin, vec3, select, float, screenUV, color } from 'three/tsl'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of playback: eight pulses around the heart (2.5 s each). The 1 rad/s bobbing jumps at the wrap. */
const DURATION = 20

const count = 1000

/**
 * A thousand spheres scattered along a heart-shaped path, bobbing, with a pulse of larger spheres running around it.
 * Per-instance position, color, path time and seed are instanced attributes read by TSL; document time drives the
 * motion. Plays when opened.
 */
@Register
export class InstancePathExample extends Document {

  public mesh: InstancedMesh

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    this.scene.backgroundNode = screenUV.distance( .5 ).remap( 0, 0.65 ).mix( color( 0x94254c ), color( 0x000000 ) )

    // generate a path representing a heart shape

    const x = 0, y = 0
    const path = new Path()
      .moveTo( x - 2.5, y - 2.5 )
      .bezierCurveTo( x - 2.5, y - 2.5, x - 2, y, x, y )
      .bezierCurveTo( x + 3, y, x + 3, y - 3.5, x + 3, y - 3.5 )
      .bezierCurveTo( x + 3, y - 5.5, x + 1, y - 7.7, x - 2.5, y - 9.5 )
      .bezierCurveTo( x - 6, y - 7.7, x - 8, y - 5.5, x - 8, y - 3.5 )
      .bezierCurveTo( x - 8, y - 3.5, x - 8, y, x - 5, y )
      .bezierCurveTo( x - 3.5, y, x - 2.5, y - 2.5, x - 2.5, y - 2.5 )

    // generate instanced ico-spheres along the path

    const geometry = new IcosahedronGeometry( 0.1 )
    const material = new MeshStandardNodeMaterial()

    // The source draws a plain `Mesh` with `count` instances. An `InstancedMesh` (identity matrices) carries the
    // bounds of the heart for framing and culling; the instances are placed in TSL either way.
    this.mesh = new InstancedMesh( geometry, material, count )
    this.mesh.name = 'Heart'
    this.mesh.position.set( 2.5, 5, 0 )
    this.scene.add( this.mesh )

    // instance data

    const point = new Vector2()
    const v = new Vector3()
    const c = new Color()

    const positions: number[] = []
    const times: number[] = []
    const seeds: number[] = []
    const colors: number[] = []

    for ( let i = 0; i < count; i ++ ) {
      const t = i / count
      path.getPointAt( t, point )
      v.set( point.x, point.y, 0 )

      v.x += ( 0.5 - Math.random() )
      v.y += ( 0.5 - Math.random() )
      v.z = ( 0.5 - Math.random() )

      positions.push( v.x, v.y, v.z )
      times.push( t )
      seeds.push( Math.random() )

      c.setHSL( 0.75 + ( Math.random() * 0.25 ), 1, 0.4 )

      colors.push( c.r, c.g, c.b )
    }

    // Bobbing moves the spheres up to 0.25, the pulse scales them up to three times their 0.1 radius.
    this.mesh.boundingBox = new Box3().setFromArray( positions ).expandByScalar( 0.55 )
    this.mesh.boundingSphere = this.mesh.boundingBox.getBoundingSphere( new Sphere() )

    const positionAttribute = new InstancedBufferAttribute( new Float32Array( positions ), 3 )
    const colorAttribute = new InstancedBufferAttribute( new Float32Array( colors ), 3 )
    const timeAttribute = new InstancedBufferAttribute( new Float32Array( times ), 1 )
    const seedAttribute = new InstancedBufferAttribute( new Float32Array( seeds ), 1 )

    // TSL

    const time = this.timeline.timeNode

    const instancePosition = instancedBufferAttribute<'vec3'>( positionAttribute )
    const instanceColor = instancedBufferAttribute<'vec3'>( colorAttribute )
    const instanceSeed = instancedBufferAttribute<'float'>( seedAttribute )
    const instanceTime = instancedBufferAttribute<'float'>( timeAttribute )

    const localTime = instanceTime.add( time )
    const modTime = mod( time.mul( 0.4 ), 1 )
    const s0 = sin( localTime.add( instanceSeed ) ).mul( 0.25 )

    const dist = abs( instanceTime.sub( modTime ) ).toConst() // modTime and instanceTime are in the range [0,1]
    const wrapDist = select( dist.greaterThan( 0.5 ), dist.oneMinus(), dist ).toConst() // the normalized distance should wrap around 0/1
    const s1 = select( wrapDist.greaterThan( 0.1 ), float( 1 ), wrapDist.remap( 0, 0.1, 3, 1 ) ) // compute a scale in a range around the current interpolated value

    const offset = vec3( instancePosition.x, instancePosition.y.add( s0 ), instancePosition.z ).toConst( 'offset' )
    material.positionNode = add( positionLocal.mul( s1 ), offset )
    material.colorNode = instanceColor
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.scene.environment = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
  }
}
