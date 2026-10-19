import {
  BufferGeometry,
  Color,
  Fog,
  InstancedInterleavedBuffer,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  PointsNodeMaterial,
  Sprite,
  SRGBColorSpace
} from 'three/webgpu'
import { instancedBufferAttribute, vec3 } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the tumble repeats: the timeline length, so looping is seamless. The source turns 0.25 rad/s about x
 * and 0.5 rad/s about y: one and two turns in 8π s.
 */
const PERIOD = 8 * Math.PI

/**
 * Half a million points as in BuffergeometryPoints, from one interleaved buffer of 16 bytes per point: a float32
 * position, then an 8-bit normalized color. WebGPU draws `Points` 1 px wide, so a child `Sprite` named `Sprites` draws
 * a quad per point from the same bytes, unpacking the color from the fourth 32-bit word. Plays when opened.
 */
@Register
export class BuffergeometryPointsInterleavedExample extends Document {

  public points: Points<BufferGeometry, PointsMaterial>

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 27, 400 / 250, 5, 3500 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 2750 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x050505 )
    this.scene.fog = new Fog( 0x050505, 2000, 3500 )

    //

    const particles = 500000

    const geometry = new BufferGeometry()

    // create a generic buffer of binary data (a single particle has 16 bytes of data)

    const arrayBuffer = new ArrayBuffer( particles * 16 )

    // the following typed arrays share the same buffer

    const interleavedFloat32Buffer = new Float32Array( arrayBuffer )
    const interleavedUint8Buffer = new Uint8Array( arrayBuffer )

    //

    const color = new Color()

    const n = 1000, n2 = n / 2 // particles spread in the cube

    for ( let i = 0; i < interleavedFloat32Buffer.length; i += 4 ) {

      // position (first 12 bytes)

      const x = Math.random() * n - n2
      const y = Math.random() * n - n2
      const z = Math.random() * n - n2

      interleavedFloat32Buffer[ i + 0 ] = x
      interleavedFloat32Buffer[ i + 1 ] = y
      interleavedFloat32Buffer[ i + 2 ] = z

      // color (last 4 bytes)

      const vx = ( x / n ) + 0.5
      const vy = ( y / n ) + 0.5
      const vz = ( z / n ) + 0.5

      color.setRGB( vx, vy, vz, SRGBColorSpace )

      const j = ( i + 3 ) * 4

      interleavedUint8Buffer[ j + 0 ] = color.r * 255
      interleavedUint8Buffer[ j + 1 ] = color.g * 255
      interleavedUint8Buffer[ j + 2 ] = color.b * 255
      interleavedUint8Buffer[ j + 3 ] = 0 // not needed

    }

    const interleavedBuffer32 = new InterleavedBuffer( interleavedFloat32Buffer, 4 )
    const interleavedBuffer8 = new InterleavedBuffer( interleavedUint8Buffer, 16 )

    geometry.setAttribute( 'position', new InterleavedBufferAttribute( interleavedBuffer32, 3, 0, false ) )
    geometry.setAttribute( 'color', new InterleavedBufferAttribute( interleavedBuffer8, 3, 12, true ) )

    //

    const material = new PointsMaterial( { size: 15, vertexColors: true } )

    this.points = new Points( geometry, material )
    this.points.name = 'Points'
    this.points.add( createSprites( arrayBuffer, particles, material.size ) )
    this.scene.add( this.points )
  }

  override onAnimate(delta: number, time: number) {
    this.points.rotation.x = time * 0.25
    this.points.rotation.y = time * 0.5
  }
}

/**
 * A quad per point of the interleaved `arrayBuffer`, drawn at `size`. Node buffer attributes take no `normalized` flag,
 * so the color is read as one 32-bit word and split into its bytes.
 */
function createSprites(arrayBuffer: ArrayBuffer, count: number, size: number) {
  const position = instancedBufferAttribute<'vec3'>( new InstancedInterleavedBuffer( new Float32Array( arrayBuffer ), 4 ), 'vec3', 4, 0 )
  const packed = instancedBufferAttribute<'uint'>( new InstancedInterleavedBuffer( new Uint32Array( arrayBuffer ), 4 ), 'uint', 4, 3 )

  const material = new PointsNodeMaterial( {
    positionNode: position,
    colorNode: vec3( packed.bitAnd( 255 ), packed.shiftRight( 8 ).bitAnd( 255 ), packed.shiftRight( 16 ).bitAnd( 255 ) ).div( 255 ),
    size: size,
    sizeAttenuation: true,
  } )

  const sprites = new Sprite( material )
  sprites.name = 'Sprites'
  sprites.count = count
  // A sprite's bounds are one quad at its origin.
  sprites.frustumCulled = false
  sprites.userData.selectable = false

  return sprites
}
