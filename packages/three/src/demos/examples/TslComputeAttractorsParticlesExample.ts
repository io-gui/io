import {
  AdditiveBlending,
  AmbientLight,
  Box3,
  Color,
  ComputeNode,
  ConeGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  RingGeometry,
  Sphere,
  SpriteNodeMaterial,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { float, If, PI, cos, instanceIndex, Loop, mix, mod, sin, instancedArray, Fn, uint, uniform, uniformArray, hash, vec3, vec4 } from 'three/tsl'
import type { Node } from 'three/webgpu'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The source steps the particles by a fixed 1/60 s once per frame: 60 steps per second. */
const FRAME_RATE = 60

/** Longest step in seconds: scrubbing forward fast-forwards at most this far per draw. */
const MAX_DELTA = 1 / 15

const count = Math.pow( 2, 18 )

const UP = new Vector3( 0, 1, 0 )

/**
 * 262144 particles orbiting three spinning attractors under gravity, moved by a compute pass and drawn as additive
 * sprites colored by speed. The attractors are `Attractor` objects: move or turn them with the editor's tools (the
 * source's `TransformControls`), and the compute pass reads their transforms. Masses (as powers of ten), `maxSpeed`,
 * `damping`, `spinning`, `scale`, `bounds`, the two colors, the attractor `helpers` and `reset` are in the Document tab.
 * The particles are live: they step once per source frame of time played forward (`onBeforeDraw`), so scrubbing back
 * or a loop wrap does not rewind them. Plays when opened.
 */
@Register
export class TslComputeAttractorsParticlesExample extends Document {

  @Property({type: Number, value: 7})
  declare attractorMassExp: number

  @Property({type: Number, value: 4})
  declare particleMassExp: number

  @Property({type: Number, value: 8})
  declare maxSpeed: number

  @Property({type: Number, value: 0.1})
  declare damping: number

  @Property({type: Number, value: 2.75})
  declare spinning: number

  @Property({type: Number, value: 0.008})
  declare scale: number

  @Property({type: Number, value: 8})
  declare bounds: number

  @Property({type: Color, init: [ 0x5900ff ]})
  declare colorA: Color

  @Property({type: Color, init: [ 0xffa575 ]})
  declare colorB: Color

  @Property({type: Boolean, value: true})
  declare helpers: boolean

  public mesh: InstancedMesh
  public attractors: Object3D[] = []
  private attractorHelpers: Group[] = []
  private attractorsPositions = uniformArray<'vec3'>( [ new Vector3(), new Vector3(), new Vector3() ], 'vec3' )
  private attractorsRotationAxes = uniformArray<'vec3'>( [ new Vector3(), new Vector3(), new Vector3() ], 'vec3' )
  private uniforms = {
    attractorMass: uniform( 1e7 ),
    particleGlobalMass: uniform( 1e4 ),
    spinningStrength: uniform( 2.75 ),
    maxSpeed: uniform( 8 ),
    velocityDamping: uniform( 0.1 ),
    scale: uniform( 0.008 ),
    boundHalfExtent: uniform( 8 ),
    colorA: uniform( new Color( '#5900ff' ) ),
    colorB: uniform( new Color( '#ffa575' ) ),
  }
  private initCompute: ComputeNode
  private updateCompute: ComputeNode
  /** Presses of `reset`, and how many of them each renderer has applied. */
  private resets = 0
  private appliedResets = new WeakMap<WebGPURenderer, number>()
  /** Time played forward that is not a whole source frame yet, per renderer. */
  private frameTime = new WeakMap<WebGPURenderer, number>()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 25, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 3, 5, 8 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( '#000000' )

    // ambient light

    const ambientLight = new AmbientLight( '#ffffff', 0.5 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    // directional light

    const directionalLight = new DirectionalLight( '#ffffff', 1.5 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 4, 2, 0 )
    this.scene.add( directionalLight )

    // attractors

    const positions = [
      new Vector3( - 1, 0, 0 ),
      new Vector3( 1, 0, - 0.5 ),
      new Vector3( 0, 0.5, 1 )
    ]
    const rotationAxes = [
      new Vector3( 0, 1, 0 ),
      new Vector3( 0, 1, 0 ),
      new Vector3( 1, 0, - 0.5 ).normalize()
    ]
    const attractorsLength = uniform( positions.length, 'uint' )
    const helpersRingGeometry = new RingGeometry( 1, 1.02, 32, 1, 0, Math.PI * 1.5 )
    const helpersArrowGeometry = new ConeGeometry( 0.1, 0.4, 12, 1, false )
    const helpersMaterial = new MeshBasicMaterial( { side: DoubleSide } )

    for ( let i = 0; i < positions.length; i ++ ) {

      const reference = new Object3D()
      reference.name = `Attractor ${i + 1}`
      reference.position.copy( positions[ i ] )
      reference.quaternion.setFromUnitVectors( UP, rotationAxes[ i ] )
      this.scene.add( reference )
      this.attractors.push( reference )

      const helper = new Group()
      helper.name = 'Helper'
      helper.scale.setScalar( 0.325 )
      reference.add( helper )
      this.attractorHelpers.push( helper )

      const ring = new Mesh( helpersRingGeometry, helpersMaterial )
      ring.name = 'Ring'
      ring.rotation.x = - Math.PI * 0.5
      helper.add( ring )

      const arrow = new Mesh( helpersArrowGeometry, helpersMaterial )
      arrow.name = 'Arrow'
      arrow.position.x = 1
      arrow.position.z = 0.2
      arrow.rotation.x = Math.PI * 0.5
      helper.add( arrow )

    }

    this.readAttractors()

    // particles

    const material = new SpriteNodeMaterial( { blending: AdditiveBlending, depthWrite: false } )

    const { attractorMass, particleGlobalMass, spinningStrength, maxSpeed, velocityDamping, scale, boundHalfExtent, colorA, colorB } = this.uniforms
    const { attractorsPositions, attractorsRotationAxes } = this
    const gravityConstant = 6.67e-11

    const positionBuffer = instancedArray( count, 'vec3' )
    const velocityBuffer = instancedArray( count, 'vec3' )

    const sphericalToVec3 = Fn( ( [ phi, theta ]: [ Node<'float'>, Node<'float'> ] ) => {

      const sinPhiRadius = sin( phi )

      return vec3(
        sinPhiRadius.mul( sin( theta ) ),
        cos( phi ),
        sinPhiRadius.mul( cos( theta ) )
      )

    } )

    // init compute

    const init = Fn( () => {

      const position = positionBuffer.element( instanceIndex )
      const velocity = velocityBuffer.element( instanceIndex )

      const basePosition = vec3(
        hash( instanceIndex.add( uint( Math.random() * 0xffffff ) ) ),
        hash( instanceIndex.add( uint( Math.random() * 0xffffff ) ) ),
        hash( instanceIndex.add( uint( Math.random() * 0xffffff ) ) )
      ).sub( 0.5 ).mul( vec3( 5, 0.2, 5 ) )
      position.assign( basePosition )

      const phi = hash( instanceIndex.add( uint( Math.random() * 0xffffff ) ) ).mul( PI ).mul( 2 )
      const theta = hash( instanceIndex.add( uint( Math.random() * 0xffffff ) ) ).mul( PI )
      const baseVelocity = sphericalToVec3( phi, theta ).mul( 0.05 )
      velocity.assign( baseVelocity )

    } )

    this.initCompute = init().compute( count )

    // update compute

    const particleMassMultiplier = hash( instanceIndex.add( uint( Math.random() * 0xffffff ) ) ).remap( 0.25, 1 ).toVar()
    const particleMass = particleMassMultiplier.mul( particleGlobalMass ).toVar()

    const update = Fn( () => {

      const delta = float( 1 / 60 ).toVar() // uses fixed delta to consistent result
      const position = positionBuffer.element( instanceIndex )
      const velocity = velocityBuffer.element( instanceIndex )

      // force

      const force = vec3( 0 ).toVar()

      Loop( attractorsLength, ( { i } ) => {

        const attractorPosition = attractorsPositions.element( i )
        const attractorRotationAxis = attractorsRotationAxes.element( i )
        const toAttractor = attractorPosition.sub( position )
        const distance = toAttractor.length()
        const direction = toAttractor.normalize()

        // gravity
        const gravityStrength = attractorMass.mul( particleMass ).mul( gravityConstant ).div( distance.pow( 2 ) ).toVar()
        const gravityForce = direction.mul( gravityStrength )
        force.addAssign( gravityForce )

        // spinning
        const spinningForce = attractorRotationAxis.mul( gravityStrength ).mul( spinningStrength )
        const spinningVelocity = spinningForce.cross( toAttractor )
        force.addAssign( spinningVelocity )

      } )

      // velocity

      velocity.addAssign( force.mul( delta ) )
      const speed = velocity.length()
      If( speed.greaterThan( maxSpeed ), () => {

        velocity.assign( velocity.normalize().mul( maxSpeed ) )

      } )
      velocity.mulAssign( velocityDamping.oneMinus() )

      // position

      position.addAssign( velocity.mul( delta ) )

      // box loop

      const halfHalfExtent = boundHalfExtent.div( 2 ).toVar()
      position.assign( mod( position.add( halfHalfExtent ), boundHalfExtent ).sub( halfHalfExtent ) )

    } )
    this.updateCompute = update().compute( count ).setName( 'Update Particles' )

    // nodes

    material.positionNode = positionBuffer.toAttribute()

    material.colorNode = Fn( () => {

      const velocity = velocityBuffer.toAttribute()
      const speed = velocity.length()
      const colorMix = speed.div( maxSpeed ).smoothstep( 0, 0.5 )
      const finalColor = mix( colorA, colorB, colorMix )

      return vec4( finalColor, 1 )

    } )()

    material.scaleNode = particleMassMultiplier.mul( scale )

    // mesh

    const geometry = new PlaneGeometry( 1, 1 )
    this.mesh = new InstancedMesh( geometry, material, count )
    this.mesh.name = 'Particles'
    this.scene.add( this.mesh )
    this.boundsChanged()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  attractorMassExpChanged() { this.uniforms.attractorMass.value = Number( `1e${this.attractorMassExp}` ) }
  particleMassExpChanged() { this.uniforms.particleGlobalMass.value = Number( `1e${this.particleMassExp}` ) }
  maxSpeedChanged() { this.uniforms.maxSpeed.value = this.maxSpeed; this.notify({kind: 'material'}) }
  dampingChanged() { this.uniforms.velocityDamping.value = this.damping }
  spinningChanged() { this.uniforms.spinningStrength.value = this.spinning }
  scaleChanged() { this.uniforms.scale.value = this.scale; this.notify({kind: 'material'}) }

  /** The particles wrap around a cube `bounds` wide: their instances' bounds, for framing and culling. */
  boundsChanged() {
    this.uniforms.boundHalfExtent.value = this.bounds
    if ( ! this.mesh ) return
    const half = this.bounds / 2
    this.mesh.boundingBox = new Box3( new Vector3( - half, - half, - half ), new Vector3( half, half, half ) )
    this.mesh.boundingSphere = this.mesh.boundingBox.getBoundingSphere( new Sphere() )
  }

  colorAMutated() { this.uniforms.colorA.value.copy( this.colorA ); this.notify({kind: 'material'}) }
  colorBMutated() { this.uniforms.colorB.value.copy( this.colorB ); this.notify({kind: 'material'}) }

  helpersChanged() {
    for ( const helper of this.attractorHelpers ) helper.visible = this.helpers
    this.notify({kind: 'other'})
  }

  /** Starts the particles over in a flat slab. */
  reset = () => {
    this.resets++
    this.notify({kind: 'other'})
  }

  /** Copies the attractors' positions and spin axes (their local y) into the compute pass's uniforms. */
  private readAttractors() {
    this.attractors.forEach( ( reference, i ) => {
      const position = this.attractorsPositions.array[ i ] as Vector3
      const axis = this.attractorsRotationAxes.array[ i ] as Vector3
      position.copy( reference.position )
      axis.copy( UP ).applyQuaternion( reference.quaternion )
    } )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void renderer.compute( this.initCompute )
    this.appliedResets.set( renderer, this.resets )
    this._frameTarget = this.mesh
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    if ( this.appliedResets.get( renderer ) !== this.resets ) {
      this.appliedResets.set( renderer, this.resets )
      void renderer.compute( this.initCompute )
    }

    this.readAttractors()

    const time = ( this.frameTime.get( renderer ) ?? 0 ) + Math.min( delta, MAX_DELTA )
    const frames = Math.floor( time * FRAME_RATE )
    this.frameTime.set( renderer, time - frames / FRAME_RATE )
    for ( let i = 0; i < frames; i++ ) void renderer.compute( this.updateCompute )
  }
}

registerEditorConfig(TslComputeAttractorsParticlesExample, [
  ['attractorMassExp', ioNumberSlider({min: 1, max: 10, step: 1})],
  ['particleMassExp', ioNumberSlider({min: 1, max: 10, step: 1})],
  ['maxSpeed', ioNumberSlider({min: 0, max: 10, step: 0.01})],
  ['damping', ioNumberSlider({min: 0, max: 0.1, step: 0.001})],
  ['spinning', ioNumberSlider({min: 0, max: 10, step: 0.01})],
  ['scale', ioNumberSlider({min: 0, max: 0.1, step: 0.001})],
  ['bounds', ioNumberSlider({min: 0, max: 20, step: 0.01})],
])

registerEditorGroups(TslComputeAttractorsParticlesExample, {
  Main: ['attractorMassExp', 'particleMassExp', 'maxSpeed', 'damping', 'spinning', 'scale', 'bounds', 'colorA', 'colorB', 'helpers', 'reset'],
  Hidden: ['mesh', 'attractors', 'attractorHelpers', 'attractorsPositions', 'attractorsRotationAxes', 'uniforms', 'initCompute', 'updateCompute', 'resets', 'appliedResets', 'frameTime'],
})
