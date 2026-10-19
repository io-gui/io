import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Fog,
  InstancedBufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  PointsNodeMaterial,
  Sprite,
  SRGBColorSpace
} from 'three/webgpu'
import { instancedBufferAttribute } from 'three/tsl'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the tumble repeats: the timeline length, so looping is seamless. The source turns 0.25 rad/s about x
 * and 0.5 rad/s about y: one and two turns in 8π s.
 */
const PERIOD = 8 * Math.PI

/**
 * Half a million points in a cube, colored by position, tumbling with document time. WebGPU draws `Points` 1 px wide,
 * so a child `Sprite` named `Sprites` draws a quad per point at the source's size; the `Points` stay for picking and
 * framing. Plays when opened.
 */
@Register
export class BuffergeometryPointsExample extends Document {

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

    const positions: number[] = []
    const colors: number[] = []

    const color = new Color()

    const n = 1000, n2 = n / 2 // particles spread in the cube

    for ( let i = 0; i < particles; i ++ ) {

      // positions

      const x = Math.random() * n - n2
      const y = Math.random() * n - n2
      const z = Math.random() * n - n2

      positions.push( x, y, z )

      // colors

      const vx = ( x / n ) + 0.5
      const vy = ( y / n ) + 0.5
      const vz = ( z / n ) + 0.5

      color.setRGB( vx, vy, vz, SRGBColorSpace )

      colors.push( color.r, color.g, color.b )

    }

    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )

    geometry.computeBoundingSphere()

    //

    const material = new PointsMaterial( { size: 15, vertexColors: true } )

    this.points = new Points( geometry, material )
    this.points.name = 'Points'
    this.points.add( createSprites( this.points ) )
    this.scene.add( this.points )
  }

  override onAnimate(delta: number, time: number) {
    this.points.rotation.x = time * 0.25
    this.points.rotation.y = time * 0.5
  }
}

/** A quad per point of `points`, drawn at the points material's size. */
function createSprites(points: Points<BufferGeometry, PointsMaterial>) {
  const geometry = points.geometry
  const position = geometry.getAttribute( 'position' )
  const color = geometry.getAttribute( 'color' )

  const material = new PointsNodeMaterial( {
    positionNode: instancedBufferAttribute( new InstancedBufferAttribute( position.array, 3 ) ),
    colorNode: instancedBufferAttribute<'vec3'>( new InstancedBufferAttribute( color.array, 3 ) ),
    size: points.material.size,
    sizeAttenuation: true,
  } )

  const sprites = new Sprite( material )
  sprites.name = 'Sprites'
  sprites.count = position.count
  // A sprite's bounds are one quad at its origin.
  sprites.frustumCulled = false
  sprites.userData.selectable = false

  return sprites
}
