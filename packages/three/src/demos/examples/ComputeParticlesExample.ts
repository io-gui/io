import {
  BufferGeometry,
  Color,
  ComputeNode,
  Mesh,
  PerspectiveCamera,
  Sprite,
  SpriteNodeMaterial,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, If, uniform, float, uv, vec3, hash, shapeCircle, instancedArray, instanceIndex } from 'three/tsl'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The source steps the particles once per frame: 60 steps per second. */
const FRAME_RATE = 60

/** Longest step in seconds: scrubbing forward fast-forwards at most this far per draw. */
const MAX_DELTA = 1 / 15

const particleCount = 200000

const separation = 0.2
const amount = Math.sqrt( particleCount )

/**
 * 200000 particles on a 90-unit grid under gravity, bouncing on the floor, moved by a compute pass and drawn as
 * circular sprites. `gravity`, `bounce`, `friction` and `size` are in the Document tab. The source pushes the particles
 * away from the pointer; here `hit` pushes them away from the middle of the grid. The particles are live: they step
 * once per source frame of time played forward (`onBeforeDraw`), so scrubbing back or a loop wrap does not rewind
 * them. `alphaToCoverage` rounds the sprites in views with MSAA only. Plays when opened.
 */
@Register
export class ComputeParticlesExample extends Document {

  @Property({type: Number, value: - .00098})
  declare gravity: number

  @Property({type: Number, value: .8})
  declare bounce: number

  @Property({type: Number, value: .99})
  declare friction: number

  @Property({type: Number, value: .12})
  declare size: number

  public particles: Sprite
  private gravityUniform = uniform( - .00098 )
  private bounceUniform = uniform( .8 )
  private frictionUniform = uniform( .99 )
  private sizeUniform = uniform( .12 )
  private computeInit: ComputeNode
  private computeParticles: ComputeNode
  private computeHit: ComputeNode
  /** Presses of `hit`, and how many of them each renderer has applied. */
  private hits = 0
  private appliedHits = new WeakMap<WebGPURenderer, number>()
  /** Time played forward that is not a whole source frame yet, per renderer. */
  private frameTime = new WeakMap<WebGPURenderer, number>()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 5, 20 )
    camera.lookAt( 0, - 8, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    //

    const positions = instancedArray( particleCount, 'vec3' )
    const velocities = instancedArray( particleCount, 'vec3' )
    const colors = instancedArray( particleCount, 'vec3' )

    // compute

    const offset = float( amount / 2 )

    const computeInit = Fn( () => {

      const position = positions.element( instanceIndex )
      const color = colors.element( instanceIndex )

      const x = instanceIndex.mod( amount )
      const z = instanceIndex.div( amount )

      position.x = offset.sub( x ).mul( separation )
      position.z = offset.sub( z ).mul( separation )

      color.x = hash( instanceIndex )
      color.y = hash( instanceIndex.add( 2 ) )

    } )().compute( particleCount ).setName( 'Init Particles' )

    //

    const computeUpdate = Fn( () => {

      const position = positions.element( instanceIndex )
      const velocity = velocities.element( instanceIndex )

      velocity.addAssign( vec3( 0.00, this.gravityUniform, 0.00 ) )
      position.addAssign( velocity )

      velocity.mulAssign( this.frictionUniform )

      // floor

      If( position.y.lessThan( 0 ), () => {

        position.y = 0
        velocity.y = velocity.y.negate().mul( this.bounceUniform )

        // floor friction

        velocity.x = velocity.x.mul( .9 )
        velocity.z = velocity.z.mul( .9 )

      } )

    } )

    this.computeInit = computeInit
    this.computeParticles = computeUpdate().compute( particleCount ).setName( 'Update Particles' )

    // Hit: the source's pointer position on the floor, lowered by 1.

    const clickPosition = uniform( new Vector3( 0, - 1, 0 ) )

    this.computeHit = Fn( () => {

      const position = positions.element( instanceIndex )
      const velocity = velocities.element( instanceIndex )

      const dist = position.distance( clickPosition )
      const direction = position.sub( clickPosition ).normalize()
      const distArea = float( 3 ).sub( dist ).max( 0 )

      const power = distArea.mul( .01 )
      const relativePower = power.mul( hash( instanceIndex ).mul( 1.5 ).add( .5 ) )

      velocity.assign( velocity.add( direction.mul( relativePower ) ) )

    } )().compute( particleCount ).setName( 'Hit Particles' )

    // create particles

    const material = new SpriteNodeMaterial()
    material.colorNode = uv().mul( colors.element( instanceIndex ) )
    material.positionNode = positions.toAttribute()
    material.scaleNode = this.sizeUniform
    material.opacityNode = shapeCircle()
    material.alphaToCoverage = true
    material.transparent = true

    this.particles = new Sprite( material )
    this.particles.name = 'Particles'
    this.particles.count = particleCount
    this.particles.frustumCulled = false
    this.scene.add( this.particles )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  gravityChanged() { this.gravityUniform.value = this.gravity }
  bounceChanged() { this.bounceUniform.value = this.bounce }
  frictionChanged() { this.frictionUniform.value = this.friction }
  sizeChanged() {
    this.sizeUniform.value = this.size
    this.notify({kind: 'material'})
  }

  /** Pushes the particles near the middle of the grid away from it, as the source's pointer does. */
  hit = () => {
    this.hits++
    this.notify({kind: 'other'})
  }

  /** Lays the particles out on the grid. Framing reads one quad: frame a stand-in for the grid. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void renderer.compute( this.computeInit )
    const half = amount / 2 * separation
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - half, 0, - half ), new Vector3( half, 1, half ) ] ) )
    this._frameTarget = standIn
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    const hits = this.hits - ( this.appliedHits.get( renderer ) ?? 0 )
    this.appliedHits.set( renderer, this.hits )
    for ( let i = 0; i < hits; i++ ) void renderer.compute( this.computeHit )

    const time = ( this.frameTime.get( renderer ) ?? 0 ) + Math.min( delta, MAX_DELTA )
    const frames = Math.floor( time * FRAME_RATE )
    this.frameTime.set( renderer, time - frames / FRAME_RATE )
    for ( let i = 0; i < frames; i++ ) void renderer.compute( this.computeParticles )
  }
}

registerEditorConfig(ComputeParticlesExample, [
  ['gravity', ioNumberSlider({min: - .0098, max: 0, step: 0.0001})],
  ['bounce', ioNumberSlider({min: .1, max: 1, step: 0.01})],
  ['friction', ioNumberSlider({min: .96, max: .99, step: 0.01})],
  ['size', ioNumberSlider({min: .12, max: .5, step: 0.01})],
])

registerEditorGroups(ComputeParticlesExample, {
  Main: ['gravity', 'bounce', 'friction', 'size', 'hit'],
  Hidden: ['particles', 'gravityUniform', 'bounceUniform', 'frictionUniform', 'sizeUniform', 'computeInit', 'computeParticles', 'computeHit', 'hits', 'appliedHits', 'frameTime'],
})
