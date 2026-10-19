import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  BufferGeometryLoader,
  Color,
  ComputeNode,
  DirectionalLight,
  DoubleSide,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  MeshBasicNodeMaterial,
  MeshStandardMaterial,
  NearestFilter,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  RendererUtils,
  RenderTarget,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, float, texture, uv, uint, instancedArray, positionWorld, billboarding, hash, vec2, instanceIndex, positionGeometry, If, uniform } from 'three/tsl'
import type { Node } from 'three/webgpu'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The source moves the drops once per frame: 60 steps per second. */
const FRAME_RATE = 60

/** Longest step in seconds: scrubbing forward fast-forwards at most this far per draw. */
const MAX_DELTA = 1 / 15

/** Seconds of one turn of Suzanne (1 rad/s): the timeline length. */
const PERIOD = 2 * Math.PI

const maxParticleCount = 50000
const instanceCount = maxParticleCount / 2

type RendererState = ReturnType<typeof RendererUtils.resetRendererState>

/**
 * Rain falling on a slab and Suzanne, with ripples where the drops land: a camera above renders the world height of
 * the colliders (layer 1) into a target before each step, and a compute pass moves the drops and spawns ripples where
 * they hit it. `boxPosition`, `boxScale` and `dropCount` are in the Document tab; the source eases the slab toward its
 * position, here it moves there directly (or move it with the editor's tools). The rain is live: it steps once per
 * source frame of time played forward (`onBeforeDraw`), so scrubbing back or a loop wrap does not rewind it. Suzanne
 * turns with document time. Plays when opened.
 */
@Register
export class ComputeParticlesRainExample extends Document {

  /** The slab's position along z (negated, as in the source). */
  @Property({type: Number, value: 0})
  declare boxPosition: number

  @Property({type: Number, value: 3.5})
  declare boxScale: number

  @Property({type: Number, value: instanceCount})
  declare dropCount: number

  public collisionBox: Mesh<BoxGeometry, MeshStandardMaterial>
  public monkey?: Mesh
  public rainParticles: Mesh<PlaneGeometry, MeshBasicNodeMaterial>
  public rippleParticles: Mesh<BufferGeometry, MeshBasicNodeMaterial>
  private collisionCamera: OrthographicCamera
  private collisionPosRT: RenderTarget
  private collisionPosMaterial: MeshBasicNodeMaterial
  private computeInit: ComputeNode
  private computeParticles: ComputeNode
  /** Seconds per step, and the simulated time, for the source's `deltaTime` and `time`. */
  private stepDelta = uniform( 1 / FRAME_RATE )
  private stepTime = uniform( 0 )
  /** Time played forward that is not a whole source frame yet, per renderer. */
  private frameTime = new WeakMap<WebGPURenderer, number>()
  private rendererState = {} as RendererState

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 110 )
    camera.name = 'Camera'
    camera.position.set( 40, 8, 0 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    const dirLight = new DirectionalLight( 0xffffff, .5 )
    dirLight.name = 'Key'
    dirLight.position.set( 3, 17, 17 )
    this.scene.add( dirLight )

    const ambientLight = new AmbientLight( 0x111111 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    //

    this.collisionCamera = new OrthographicCamera( - 50, 50, 50, - 50, .1, 50 )
    this.collisionCamera.position.y = 50
    this.collisionCamera.lookAt( 0, 0, 0 )
    this.collisionCamera.layers.disableAll()
    this.collisionCamera.layers.enable( 1 )

    this.collisionPosRT = new RenderTarget( 1024, 1024 )
    this.collisionPosRT.texture.type = HalfFloatType
    this.collisionPosRT.texture.magFilter = NearestFilter
    this.collisionPosRT.texture.minFilter = NearestFilter
    this.collisionPosRT.texture.generateMipmaps = false

    this.collisionPosMaterial = new MeshBasicNodeMaterial()
    this.collisionPosMaterial.colorNode = positionWorld

    //

    const positionBuffer = instancedArray( maxParticleCount, 'vec3' )
    const velocityBuffer = instancedArray( maxParticleCount, 'vec3' )
    const ripplePositionBuffer = instancedArray( maxParticleCount, 'vec3' )
    const rippleTimeBuffer = instancedArray( maxParticleCount, 'vec3' )

    // compute

    const randUint = () => uint( Math.random() * 0xFFFFFF )

    this.computeInit = Fn( () => {

      const position = positionBuffer.element( instanceIndex )
      const velocity = velocityBuffer.element( instanceIndex )
      const ripplePosition = ripplePositionBuffer.element( instanceIndex )
      const rippleTime = rippleTimeBuffer.element( instanceIndex )

      const randX = hash( instanceIndex )
      const randY = hash( instanceIndex.add( randUint() ) )
      const randZ = hash( instanceIndex.add( randUint() ) )

      position.x = randX.mul( 100 ).add( - 50 )
      position.y = randY.mul( 25 )
      position.z = randZ.mul( 100 ).add( - 50 )

      velocity.y = randX.mul( - .04 ).add( - .2 )

      ripplePosition.x = randZ.mul( 100 ).add( - 50 )
      ripplePosition.y = - 1
      ripplePosition.z = randY.mul( 100 ).add( - 50 )

      rippleTime.x = 1000

    } )().compute( maxParticleCount )

    //

    const collisionPosRT = this.collisionPosRT
    const { stepDelta, stepTime } = this

    const computeUpdate = Fn( () => {

      const getCoord = ( pos: Node<'vec2'> ) => pos.add( 50 ).div( 100 )

      const position = positionBuffer.element( instanceIndex )
      const velocity = velocityBuffer.element( instanceIndex )
      const ripplePosition = ripplePositionBuffer.element( instanceIndex )
      const rippleTime = rippleTimeBuffer.element( instanceIndex )

      position.addAssign( velocity )

      rippleTime.x = rippleTime.x.add( stepDelta.mul( 4 ) )

      //

      const collisionArea = texture( collisionPosRT.texture, getCoord( position.xz ) )

      const surfaceOffset = .05

      const floorPosition = collisionArea.y.add( surfaceOffset )

      // floor

      const ripplePivotOffsetY = - .9

      If( position.y.add( ripplePivotOffsetY ).lessThan( floorPosition ), () => {

        position.y = 25

        ripplePosition.xz = position.xz
        ripplePosition.y = floorPosition

        // reset hit time: x = time

        rippleTime.x = 1

        // next drops will not fall in the same place

        position.x = hash( float( instanceIndex ).add( stepTime ) ).mul( 100 ).add( - 50 )
        position.z = hash( float( instanceIndex ).add( stepTime.add( float( randUint() ) ) ) ).mul( 100 ).add( - 50 )

      } )

      const rippleOnSurface = texture( collisionPosRT.texture, getCoord( ripplePosition.xz ) )

      const rippleFloorArea = rippleOnSurface.y.add( surfaceOffset )

      If( ripplePosition.y.greaterThan( rippleFloorArea ), () => {

        rippleTime.x = 1000

      } )

    } )

    this.computeParticles = computeUpdate().compute( maxParticleCount ).setName( 'Particles' )

    // rain

    const rainMaterial = new MeshBasicNodeMaterial()
    rainMaterial.colorNode = uv().distance( vec2( .5, 0 ) ).oneMinus().mul( 3 ).exp().mul( .1 )
    rainMaterial.positionNode = positionGeometry.add( positionBuffer.toAttribute() )
    rainMaterial.vertexNode = billboarding( { horizontalRotation: true } )
    rainMaterial.opacity = .2
    rainMaterial.depthWrite = false
    rainMaterial.depthTest = true
    rainMaterial.transparent = true

    this.rainParticles = new Mesh( new PlaneGeometry( .1, 2 ), rainMaterial )
    this.rainParticles.name = 'Rain'
    this.rainParticles.count = instanceCount
    // Its geometry is one drop at the origin.
    this.rainParticles.frustumCulled = false
    this.scene.add( this.rainParticles )

    // ripple

    const rippleTime = rippleTimeBuffer.element( instanceIndex ).x

    const rippleEffect = Fn( () => {

      const center = uv().add( vec2( - .5 ) ).length().mul( 7 )
      const distance = rippleTime.sub( center )

      return distance.min( 1 ).sub( distance.max( 1 ).sub( 1 ) )

    } )

    const rippleMaterial = new MeshBasicNodeMaterial()
    rippleMaterial.colorNode = rippleEffect()
    rippleMaterial.positionNode = positionGeometry.add( ripplePositionBuffer.toAttribute() )
    rippleMaterial.opacityNode = rippleTime.mul( .3 ).oneMinus().max( 0 ).mul( .5 )
    rippleMaterial.side = DoubleSide
    rippleMaterial.forceSinglePass = true
    rippleMaterial.depthWrite = false
    rippleMaterial.depthTest = true
    rippleMaterial.transparent = true

    // ripple geometry

    const surfaceRippleGeometry = new PlaneGeometry( 2.5, 2.5 )
    surfaceRippleGeometry.rotateX( - Math.PI / 2 )

    const xRippleGeometry = new PlaneGeometry( 1, 2 )
    xRippleGeometry.rotateY( - Math.PI / 2 )

    const zRippleGeometry = new PlaneGeometry( 1, 2 )

    const rippleGeometry = BufferGeometryUtils.mergeGeometries( [ surfaceRippleGeometry, xRippleGeometry, zRippleGeometry ] )

    this.rippleParticles = new Mesh( rippleGeometry, rippleMaterial )
    this.rippleParticles.name = 'Ripples'
    this.rippleParticles.count = instanceCount
    this.rippleParticles.frustumCulled = false
    this.scene.add( this.rippleParticles )

    // floor geometry

    const floorGeometry = new PlaneGeometry( 1000, 1000 )
    floorGeometry.rotateX( - Math.PI / 2 )

    const plane = new Mesh( floorGeometry, new MeshBasicMaterial( { color: 0x050505 } ) )
    plane.name = 'Floor'
    plane.userData.selectable = false
    this.scene.add( plane )

    //

    this.collisionBox = new Mesh( new BoxGeometry( 30, 1, 15 ), new MeshStandardMaterial() )
    this.collisionBox.name = 'Slab'
    this.collisionBox.material.color.set( 0x333333 )
    this.collisionBox.position.y = 12
    this.collisionBox.scale.x = 3.5
    this.collisionBox.layers.enable( 1 )
    this.scene.add( this.collisionBox )

    //

    void this.loadMonkey()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadMonkey() {
    try {
      const geometry = await new BufferGeometryLoader().loadAsync( 'https://threejs.org/examples/models/json/suzanne_buffergeometry.json' )

      geometry.computeVertexNormals()

      const monkey = new Mesh( geometry, new MeshStandardMaterial( { roughness: 1, metalness: 0 } ) )
      monkey.name = 'Suzanne'
      monkey.scale.setScalar( 5 )
      monkey.position.y = 4.5
      monkey.layers.enable( 1 ) // add to collision layer

      this.monkey = monkey
      this.pose( this.timeline.currentTime )
      this.scene.add( monkey )
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  boxPositionChanged() {
    if ( ! this.collisionBox ) return
    this.collisionBox.position.z = - this.boxPosition
    this.notify({kind: 'transform'})
  }

  boxScaleChanged() {
    if ( ! this.collisionBox ) return
    this.collisionBox.scale.x = this.boxScale
    this.notify({kind: 'transform'})
  }

  dropCountChanged() {
    if ( ! this.rainParticles ) return
    this.rainParticles.count = this.dropCount
    this.rippleParticles.count = this.dropCount
    this.notify({kind: 'other'})
  }

  /** Scatters the drops. The 1000-unit floor would dominate whole-scene framing: frame the rain's extent. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void renderer.compute( this.computeInit )
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 25, 6.25, - 25 ), new Vector3( 25, 18.75, 25 ) ] ) )
    this._frameTarget = standIn
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( this.monkey ) this.monkey.rotation.y = Math.PI / 2 + time
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    const time = ( this.frameTime.get( renderer ) ?? 0 ) + Math.min( delta, MAX_DELTA )
    const frames = Math.floor( time * FRAME_RATE )
    this.frameTime.set( renderer, time - frames / FRAME_RATE )
    if ( frames === 0 ) return

    // position

    const scene = this.scene
    const overrideMaterial = scene.overrideMaterial
    const rendererState = RendererUtils.resetRendererState( renderer, this.rendererState )

    scene.overrideMaterial = this.collisionPosMaterial
    renderer.setRenderTarget( this.collisionPosRT )
    renderer.render( scene, this.collisionCamera )

    RendererUtils.restoreRendererState( renderer, rendererState )
    scene.overrideMaterial = overrideMaterial

    // compute

    for ( let i = 0; i < frames; i++ ) {
      this.stepTime.value += this.stepDelta.value
      void renderer.compute( this.computeParticles )
    }
  }
}

registerEditorConfig(ComputeParticlesRainExample, [
  ['boxPosition', ioNumberSlider({min: - 50, max: 50, step: .001})],
  ['boxScale', ioNumberSlider({min: .1, max: 3.5, step: 0.01})],
  ['dropCount', ioNumberSlider({min: 200, max: maxParticleCount, step: 1})],
])

registerEditorGroups(ComputeParticlesRainExample, {
  Main: ['boxPosition', 'boxScale', 'dropCount'],
  Hidden: [
    'collisionBox', 'monkey', 'rainParticles', 'rippleParticles', 'collisionCamera', 'collisionPosRT',
    'collisionPosMaterial', 'computeInit', 'computeParticles', 'stepDelta', 'stepTime', 'frameTime', 'rendererState',
  ],
})
