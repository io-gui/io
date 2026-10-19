import {
  AdditiveBlending,
  BoxGeometry,
  BoxHelper,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Group,
  InstancedBufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  PointsNodeMaterial,
  Sprite,
  Vector3
} from 'three/webgpu'
import { instancedBufferAttribute } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds in which the group's turn repeats (0.1 rad/s): the timeline length. */
const PERIOD = 20 * Math.PI

/** The source moves each particle by its velocity once per frame: per second at 60 fps. */
const FRAME_RATE = 60

const maxParticleCount = 1000
const r = 800
const rHalf = r / 2

interface ParticleData {
  velocity: Vector3
  numConnections: number
}

/**
 * Particles bouncing in a box, joined by lines whose brightness falls off with distance. Both geometries are allocated
 * once and drawn up to a draw range: `particleCount` points, and as many line segments as particles closer than
 * `minDistance` (at most `maxConnections` each with `limitConnections`). The particles move by `delta`, so scrubbing
 * moves them back along their paths. WebGPU draws `Points` 1 px wide: a child `Sprite` draws them at 3 px. Plays when
 * opened.
 */
@Register
export class BuffergeometryDrawrangeExample extends Document {

  public group: Group
  public pointCloud: Points<BufferGeometry, PointsMaterial>
  public linesMesh: LineSegments<BufferGeometry, LineBasicMaterial>

  @Property({type: Boolean, value: true})
  declare showDots: boolean

  @Property({type: Boolean, value: true})
  declare showLines: boolean

  @Property({type: Number, value: 150})
  declare minDistance: number

  @Property({type: Boolean, value: false})
  declare limitConnections: boolean

  @Property({type: Number, value: 20})
  declare maxConnections: number

  @Property({type: Number, value: 500})
  declare particleCount: number

  private particlesData: ParticleData[] = []
  private particlePositions: Float32Array
  private spritePositions: InstancedBufferAttribute
  private sprites: Sprite
  private positions: Float32Array
  private colors: Float32Array

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 4000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 1750 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.group = new Group()
    this.group.name = 'Plexus'
    this.scene.add( this.group )

    const helper = new BoxHelper( new Mesh( new BoxGeometry( r, r, r ) ) )
    helper.name = 'Bounds'
    helper.material.color.setHex( 0x474747 )
    helper.material.blending = AdditiveBlending
    helper.material.transparent = true
    this.group.add( helper )

    const segments = maxParticleCount * maxParticleCount

    this.positions = new Float32Array( segments * 3 )
    this.colors = new Float32Array( segments * 3 )

    const pMaterial = new PointsMaterial( {
      color: 0xFFFFFF,
      size: 3,
      blending: AdditiveBlending,
      transparent: true,
      sizeAttenuation: false
    } )

    const particles = new BufferGeometry()
    this.particlePositions = new Float32Array( maxParticleCount * 3 )

    for ( let i = 0; i < maxParticleCount; i ++ ) {

      const x = Math.random() * r - r / 2
      const y = Math.random() * r - r / 2
      const z = Math.random() * r - r / 2

      this.particlePositions[ i * 3 ] = x
      this.particlePositions[ i * 3 + 1 ] = y
      this.particlePositions[ i * 3 + 2 ] = z

      // add it to the geometry
      this.particlesData.push( {
        velocity: new Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
        numConnections: 0
      } )

    }

    particles.setAttribute( 'position', new BufferAttribute( this.particlePositions, 3 ).setUsage( DynamicDrawUsage ) )

    // create the particle system

    this.pointCloud = new Points( particles, pMaterial )
    this.pointCloud.name = 'Dots'
    this.group.add( this.pointCloud )

    // A quad per particle at the points' size, reading the same positions.

    this.spritePositions = new InstancedBufferAttribute( this.particlePositions, 3 ).setUsage( DynamicDrawUsage )

    this.sprites = new Sprite( new PointsNodeMaterial( {
      positionNode: instancedBufferAttribute( this.spritePositions ),
      size: pMaterial.size,
      sizeAttenuation: false,
      blending: AdditiveBlending,
      transparent: true,
    } ) )
    this.sprites.name = 'Sprites'
    // A sprite's bounds are one quad at its origin.
    this.sprites.frustumCulled = false
    this.sprites.userData.selectable = false
    this.pointCloud.add( this.sprites )

    const geometry = new BufferGeometry()

    // Workaround (upstream: dynamic-usage): not DynamicDrawUsage, which WebGPURenderer uploads whole on every draw of
    // every view, and these hold a million segments. `connect()` marks the drawn range instead.
    geometry.setAttribute( 'position', new BufferAttribute( this.positions, 3 ) )
    geometry.setAttribute( 'color', new BufferAttribute( this.colors, 3 ) )

    geometry.computeBoundingSphere()

    geometry.setDrawRange( 0, 0 )

    const material = new LineBasicMaterial( {
      vertexColors: true,
      blending: AdditiveBlending,
      transparent: true
    } )

    this.linesMesh = new LineSegments( geometry, material )
    this.linesMesh.name = 'Lines'
    this.group.add( this.linesMesh )

    this.particleCountChanged()
  }

  showDotsChanged() {
    if ( ! this.pointCloud ) return
    this.pointCloud.visible = this.showDots
  }

  showLinesChanged() {
    if ( ! this.linesMesh ) return
    this.linesMesh.visible = this.showLines
  }

  particleCountChanged() {
    if ( ! this.pointCloud ) return
    this.pointCloud.geometry.setDrawRange( 0, this.particleCount )
    this.sprites.count = this.particleCount
    this.connect()
  }

  minDistanceChanged() { this.connect() }
  limitConnectionsChanged() { this.connect() }
  maxConnectionsChanged() { this.connect() }

  override onAnimate(delta: number, time: number) {
    this.group.rotation.y = time * 0.1
    this.move( delta * FRAME_RATE )
    this.connect()
  }

  /** Moves the particles by `steps` source frames of their velocity, bouncing off the box. */
  private move(steps: number) {
    const particlePositions = this.particlePositions

    for ( let i = 0; i < this.particleCount; i ++ ) {

      // get the particle
      const particleData = this.particlesData[ i ]

      particlePositions[ i * 3 ] += particleData.velocity.x * steps
      particlePositions[ i * 3 + 1 ] += particleData.velocity.y * steps
      particlePositions[ i * 3 + 2 ] += particleData.velocity.z * steps

      if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
        particleData.velocity.y = - particleData.velocity.y

      if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
        particleData.velocity.x = - particleData.velocity.x

      if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
        particleData.velocity.z = - particleData.velocity.z

    }

    this.pointCloud.geometry.attributes.position.needsUpdate = true
    this.spritePositions.needsUpdate = true
  }

  /** Rebuilds the line segments between particles closer than `minDistance`. */
  private connect() {
    if ( ! this.linesMesh ) return

    const { particlesData, particlePositions, positions, colors } = this
    const particleCount = this.particleCount

    let vertexpos = 0
    let colorpos = 0
    let numConnected = 0

    for ( let i = 0; i < particleCount; i ++ )
      particlesData[ i ].numConnections = 0

    for ( let i = 0; i < particleCount; i ++ ) {

      const particleData = particlesData[ i ]

      if ( this.limitConnections && particleData.numConnections >= this.maxConnections )
        continue

      // Check collision
      for ( let j = i + 1; j < particleCount; j ++ ) {

        const particleDataB = particlesData[ j ]
        if ( this.limitConnections && particleDataB.numConnections >= this.maxConnections )
          continue

        const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ]
        const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ]
        const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ]
        const dist = Math.sqrt( dx * dx + dy * dy + dz * dz )

        if ( dist < this.minDistance ) {

          particleData.numConnections ++
          particleDataB.numConnections ++

          const alpha = 1.0 - dist / this.minDistance

          positions[ vertexpos ++ ] = particlePositions[ i * 3 ]
          positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ]
          positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ]

          positions[ vertexpos ++ ] = particlePositions[ j * 3 ]
          positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ]
          positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ]

          colors[ colorpos ++ ] = alpha
          colors[ colorpos ++ ] = alpha
          colors[ colorpos ++ ] = alpha

          colors[ colorpos ++ ] = alpha
          colors[ colorpos ++ ] = alpha
          colors[ colorpos ++ ] = alpha

          numConnected ++

        }

      }

    }

    const geometry = this.linesMesh.geometry
    geometry.setDrawRange( 0, numConnected * 2 )

    // Workaround (upstream: dynamic-usage): the source sets `needsUpdate` only.
    for ( const attribute of [ geometry.attributes.position, geometry.attributes.color ] as BufferAttribute[] ) {
      attribute.clearUpdateRanges()
      attribute.addUpdateRange( 0, Math.max( numConnected * 6, 1 ) )
      attribute.needsUpdate = true
    }

    this.notify({kind: 'geometry'})
  }
}

registerEditorConfig(BuffergeometryDrawrangeExample, [
  ['minDistance', ioNumberSlider({min: 10, max: 300, step: 1})],
  ['maxConnections', ioNumberSlider({min: 0, max: 30, step: 1})],
  ['particleCount', ioNumberSlider({min: 0, max: maxParticleCount, step: 1})],
])

registerEditorGroups(BuffergeometryDrawrangeExample, {
  Main: ['showDots', 'showLines', 'minDistance', 'limitConnections', 'maxConnections', 'particleCount'],
  Hidden: ['group', 'pointCloud', 'linesMesh', 'particlesData', 'particlePositions', 'spritePositions', 'sprites', 'positions', 'colors'],
})
