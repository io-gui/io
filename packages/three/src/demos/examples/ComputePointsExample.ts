import {
  BufferAttribute,
  BufferGeometry,
  ComputeNode,
  Mesh,
  OrthographicCamera,
  Points,
  PointsNodeMaterial,
  Vector2,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, uniform, instancedArray, float, vec2, color, instanceIndex } from 'three/tsl'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The source moves each particle by its velocity once per frame: per second at 60 fps. */
const FRAME_RATE = 60

/** Longest step in seconds: scrubbing forward fast-forwards at most this far per draw. */
const MAX_DELTA = 1 / 15

const particlesCount = 300000

/**
 * 300000 particles bouncing in a rectangle, moved by a compute pass and drawn as 1 px points colored by position.
 * `scaleX` and `scaleY` (the rectangle's half size) are in the Document tab. The particles are live: the compute pass
 * steps by the time played forward (`onBeforeDraw`), so scrubbing back or a loop wrap does not rewind them. The pointer
 * that resets particles is dropped. Plays when opened.
 */
@Register
export class ComputePointsExample extends Document {

  @Property({type: Number, value: 1})
  declare scaleX: number

  @Property({type: Number, value: 1})
  declare scaleY: number

  public points: Points<BufferGeometry, PointsNodeMaterial>
  private computeNode: ComputeNode
  private scaleVector = new Vector2( 1, 1 )
  private steps = uniform( 1 )

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new OrthographicCamera( - 1.0, 1.0, 1.0, - 1.0, 0, 1 )
    camera.name = 'Camera'
    camera.position.z = 1
    this.activeCamera = camera

    // initialize particles

    const particleArray = instancedArray( particlesCount, 'vec2' )
    const velocityArray = instancedArray( particlesCount, 'vec2' )

    // create function

    const computeShaderFn = Fn( () => {

      const particle = particleArray.element( instanceIndex )
      const velocity = velocityArray.element( instanceIndex )

      const limit = uniform( this.scaleVector )

      // The source adds the velocity once per frame.
      const position = particle.add( velocity.mul( this.steps ) ).toVar()

      velocity.x = position.x.abs().greaterThanEqual( limit.x ).select( velocity.x.negate(), velocity.x )
      velocity.y = position.y.abs().greaterThanEqual( limit.y ).select( velocity.y.negate(), velocity.y )

      position.assign( position.min( limit ).max( limit.negate() ) )

      particle.assign( position )

    } )

    // compute

    this.computeNode = computeShaderFn().compute( particlesCount ).setName( 'Update Particles' )
    this.computeNode.onInit( ( { renderer } ) => {

      const precomputeShaderNode = Fn( () => {

        const particleIndex = float( instanceIndex )

        const randomAngle = particleIndex.mul( .005 ).mul( Math.PI * 2 )
        const randomSpeed = particleIndex.mul( 0.00000001 ).add( 0.0000001 )

        const velX = randomAngle.sin().mul( randomSpeed )
        const velY = randomAngle.cos().mul( randomSpeed )

        const velocity = velocityArray.element( instanceIndex )

        velocity.xy = vec2( velX, velY )

      } )

      void renderer.compute( precomputeShaderNode().compute( particlesCount ) )

    } )

    // use a compute shader to animate the point cloud's vertex data.

    const pointsGeometry = new BufferGeometry()
    pointsGeometry.setAttribute( 'position', new BufferAttribute( new Float32Array( 3 ), 3 ) ) // single vertex ( not triangle )
    pointsGeometry.drawRange.count = 1 // force render points as instances ( not triangle )

    const pointsMaterial = new PointsNodeMaterial()
    pointsMaterial.colorNode = particleArray.element( instanceIndex ).add( color( 0xFFFFFF ) )
    pointsMaterial.positionNode = particleArray.element( instanceIndex )

    this.points = new Points( pointsGeometry, pointsMaterial )
    this.points.name = 'Particles'
    this.points.count = particlesCount
    // Its geometry is one vertex at the origin.
    this.points.frustumCulled = false
    this.scene.add( this.points )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  scaleXChanged() { this.scaleVector.x = this.scaleX }
  scaleYChanged() { this.scaleVector.y = this.scaleY }

  /** Framing reads the one vertex: frame a stand-in for the rectangle the particles fill. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 1, - 1, 0 ), new Vector3( 1, 1, 0 ) ] ) )
    this._frameTarget = standIn
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    if ( delta <= 0 ) return
    this.steps.value = Math.min( delta, MAX_DELTA ) * FRAME_RATE
    void renderer.compute( this.computeNode )
  }
}

registerEditorConfig(ComputePointsExample, [
  ['scaleX', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['scaleY', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(ComputePointsExample, {
  Main: ['scaleX', 'scaleY'],
  Hidden: ['points', 'computeNode', 'scaleVector', 'steps'],
})
