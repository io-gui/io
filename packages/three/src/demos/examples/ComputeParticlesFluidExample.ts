import {
  ACESFilmicToneMapping,
  BufferGeometry,
  ComputeNode,
  EquirectangularReflectionMapping,
  IcosahedronGeometry,
  Mesh,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, If, Return, instancedArray, instanceIndex, uniform, attribute, float, clamp, struct, atomicStore, int, ivec3, array, vec3, atomicAdd, Loop, atomicLoad, max, pow, mat3, vec4, cross, step } from 'three/tsl'
import type { Node } from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

const maxParticles = 8192 * 16
const gridSize1d = 64
const workgroupSize = 64
const gridSize = new Vector3( gridSize1d, gridSize1d, gridSize1d )
const fixedPointMultiplier = 1e7

/** Longest step in seconds, as the source caps its frame delta. */
const MAX_DELTA = 1 / 60

// @types/three 0.186 types neither struct buffers nor named `Loop` variables: those nodes go through `any`.
/* eslint-disable @typescript-eslint/no-explicit-any */
const NamedLoop = Loop as any

// because webgpu only supports int atomics, we use fixed point floats by multiplying/dividing the float values with a high integer constant
const encodeFixedPoint = ( f32: Node<'float'> ) => {

  return int( f32.mul( fixedPointMultiplier ) )

}

const decodeFixedPoint = ( i32: Node<'int'> ) => {

  return float( i32 ).div( fixedPointMultiplier )

}

const clampToRoundedBox = ( pos: Node<'vec3'>, box: Node<'vec3'>, radius: Node<'float'> ) => {

  const result = pos.sub( 0.5 ).toVar()
  const pp = step( box, result.abs() ).mul( result.add( box.negate().mul( result.sign() ) ) )
  const ppLen = pp.length().toVar()
  const dist = ppLen.sub( radius )
  If( dist.greaterThan( 0.0 ), () => {

    result.subAssign( pp.normalize().mul( dist ).mul( 1.3 ) )

  } )
  result.addAssign( 0.5 )
  return result

}

/**
 * A fluid of up to 131072 particles sloshing in a rounded box: an MLS-MPM simulation in five compute passes (clear
 * the grid, particles to grid twice, update the grid, grid to particles) on a 64³ grid, drawn as small blue spheres.
 * `particleCount` is in the Document tab. The fluid is live: it steps once per draw by the time played forward, up to
 * 1/60 s as in the source (`onBeforeDraw`), so scrubbing back or a loop wrap does not rewind it. The pointer that stirs
 * the fluid is dropped. Plays when opened.
 */
@Register
export class ComputeParticlesFluidExample extends Document {

  @Property({type: Number, value: 8192 * 4})
  declare particleCount: number

  public particleMesh: Mesh<BufferGeometry, MeshStandardNodeMaterial>
  private kernels: ComputeNode[]
  private particleKernels: ComputeNode[]
  private dtUniform = uniform( 1 / 60 )

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.35, timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 0.01, 10 )
    camera.name = 'Camera'
    camera.position.set( - 1.3, 1.3, - 1.3 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // buffers

    const particleStruct = struct( {
      position: { type: 'vec3' },
      velocity: { type: 'vec3' },
      C: { type: 'mat3' },
    } )
    const particleStructSize = 20 // each vec3 occupies 4 floats and mat3 occupies 12 floats in memory because of webgpu memory alignment
    const particleArray = new Float32Array( maxParticles * particleStructSize )

    for ( let i = 0; i < maxParticles; i ++ ) {

      particleArray[ i * particleStructSize ] = ( Math.random() * 0.8 + 0.1 )
      particleArray[ i * particleStructSize + 1 ] = ( Math.random() * 0.8 + 0.1 )
      particleArray[ i * particleStructSize + 2 ] = ( Math.random() * 0.8 + 0.1 )

    }

    const particleBuffer: any = instancedArray( particleArray, particleStruct as any )

    const cellCount = gridSize.x * gridSize.y * gridSize.z

    const cellStruct = struct( {
      x: { type: 'int', atomic: true },
      y: { type: 'int', atomic: true },
      z: { type: 'int', atomic: true },
      mass: { type: 'int', atomic: true },
    } )

    const cellBuffer: any = instancedArray( cellCount, cellStruct as any )
    const cellBufferFloat = instancedArray( cellCount, 'vec4' )

    // uniforms

    const gridSizeUniform = uniform( gridSize )
    const stiffnessUniform = uniform( 50 )
    const restDensityUniform = uniform( 1.5 )
    const dynamicViscosityUniform = uniform( 0.1 )
    const dtUniform = this.dtUniform
    const gravityUniform = uniform( new Vector3( 0, - ( 9.81 * 9.81 ), 0 ) )
    // The source's pointer ray and force; without a pointer the force stays zero.
    const mouseRayOriginUniform = uniform( new Vector3( 0, 0, 0 ) )
    const mouseRayDirectionUniform = uniform( new Vector3( 0, 0, 0 ) )
    const mouseForceUniform = uniform( new Vector3( 0, 0, 0 ) )

    // the MLS-MPM system uses five compute shaders:
    // 1. clearGridKernel: this clears the grid before each pass
    // 2. p2g1Kernel & 3. p2g2Kernel: These particle2grid kernels transfer the particles' energy to the grid
    // 4. updateGridKernel: updates the grid
    // 5. g2pKernel: grid2particle kernel, transfers the grid energy back to the particles
    // the implementation closely follows https://github.com/matsuoka-601/WebGPU-Ocean

    const clearGridKernel = Fn( () => {

      atomicStore( cellBuffer.element( instanceIndex ).get( 'x' ), 0 )
      atomicStore( cellBuffer.element( instanceIndex ).get( 'y' ), 0 )
      atomicStore( cellBuffer.element( instanceIndex ).get( 'z' ), 0 )
      atomicStore( cellBuffer.element( instanceIndex ).get( 'mass' ), 0 )

    } )().compute( cellCount ).setName( 'clearGridKernel' )

    const p2g1Kernel = Fn( () => {

      const particlePosition = particleBuffer.element( instanceIndex ).get( 'position' ).toConst( 'particlePosition' )
      const particleVelocity = particleBuffer.element( instanceIndex ).get( 'velocity' ).toConst( 'particleVelocity' )
      const C = particleBuffer.element( instanceIndex ).get( 'C' ).toConst( 'C' )

      const gridPosition = particlePosition.mul( gridSizeUniform ).toVar()
      const cellIndex = ivec3( gridPosition ).sub( 1 ).toConst( 'cellIndex' )
      const cellDiff = gridPosition.fract().sub( 0.5 ).toConst( 'cellDiff' )
      const w0 = float( 0.5 ).mul( float( 0.5 ).sub( cellDiff ) ).mul( float( 0.5 ).sub( cellDiff ) )
      const w1 = float( 0.75 ).sub( cellDiff.mul( cellDiff ) )
      const w2 = float( 0.5 ).mul( float( 0.5 ).add( cellDiff ) ).mul( float( 0.5 ).add( cellDiff ) )
      const weights: any = array( [ w0, w1, w2 ] ).toConst( 'weights' )

      NamedLoop( { start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ( { gx }: any ) => {

        NamedLoop( { start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ( { gy }: any ) => {

          NamedLoop( { start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ( { gz }: any ) => {

            const weight = weights.element( gx ).x.mul( weights.element( gy ).y ).mul( weights.element( gz ).z )
            const cellX = cellIndex.add( ivec3( gx, gy, gz ) ).toConst()
            const cellDist = vec3( cellX ).add( 0.5 ).sub( gridPosition ).toConst( 'cellDist' )
            const Q = C.mul( cellDist )

            const massContrib = weight // assuming particle mass = 1.0
            const velContrib = massContrib.mul( particleVelocity.add( Q ) ).toConst( 'velContrib' )
            const cellPtr = cellX.x.mul( int( gridSize.y * gridSize.z ) ).add( cellX.y.mul( int( gridSize.z ) ) ).add( cellX.z ).toConst()
            const cell = cellBuffer.element( cellPtr )

            atomicAdd( cell.get( 'x' ), encodeFixedPoint( velContrib.x ) )
            atomicAdd( cell.get( 'y' ), encodeFixedPoint( velContrib.y ) )
            atomicAdd( cell.get( 'z' ), encodeFixedPoint( velContrib.z ) )
            atomicAdd( cell.get( 'mass' ), encodeFixedPoint( massContrib ) )

          } )

        } )

      } )

    } )().compute( this.particleCount, [ workgroupSize, 1, 1 ] ).setName( 'p2g1Kernel' )

    const p2g2Kernel = Fn( () => {

      const particlePosition = particleBuffer.element( instanceIndex ).get( 'position' ).toConst( 'particlePosition' )
      const gridPosition = particlePosition.mul( gridSizeUniform ).toVar()

      const cellIndex = ivec3( gridPosition ).sub( 1 ).toConst( 'cellIndex' )
      const cellDiff = gridPosition.fract().sub( 0.5 ).toConst( 'cellDiff' )
      const w0 = float( 0.5 ).mul( float( 0.5 ).sub( cellDiff ) ).mul( float( 0.5 ).sub( cellDiff ) )
      const w1 = float( 0.75 ).sub( cellDiff.mul( cellDiff ) )
      const w2 = float( 0.5 ).mul( float( 0.5 ).add( cellDiff ) ).mul( float( 0.5 ).add( cellDiff ) )
      const weights: any = array( [ w0, w1, w2 ] ).toConst( 'weights' )

      const density = float( 0 ).toVar( 'density' )
      NamedLoop( { start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ( { gx }: any ) => {

        NamedLoop( { start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ( { gy }: any ) => {

          NamedLoop( { start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ( { gz }: any ) => {

            const weight = weights.element( gx ).x.mul( weights.element( gy ).y ).mul( weights.element( gz ).z )
            const cellX = cellIndex.add( ivec3( gx, gy, gz ) ).toConst()
            const cellPtr = cellX.x.mul( int( gridSize.y * gridSize.z ) ).add( cellX.y.mul( int( gridSize.z ) ) ).add( cellX.z ).toConst()
            const cell = cellBuffer.element( cellPtr )
            const mass = decodeFixedPoint( atomicLoad( cell.get( 'mass' ) ) )
            density.addAssign( mass.mul( weight ) )

          } )

        } )

      } )

      const volume = float( 1 ).div( density )
      const pressure = max( 0.0, pow( density.div( restDensityUniform ), 5.0 ).sub( 1 ).mul( stiffnessUniform ) ).toConst( 'pressure' )
      const stress = mat3( pressure.negate(), 0, 0, 0, pressure.negate(), 0, 0, 0, pressure.negate() ).toVar( 'stress' )
      const dudv = particleBuffer.element( instanceIndex ).get( 'C' ).toConst( 'C' )

      const strain = dudv.add( dudv.transpose() )
      stress.addAssign( strain.mul( dynamicViscosityUniform ) )
      const eq16Term0 = volume.mul( - 4 ).mul( stress ).mul( dtUniform )

      NamedLoop( { start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ( { gx }: any ) => {

        NamedLoop( { start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ( { gy }: any ) => {

          NamedLoop( { start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ( { gz }: any ) => {

            const weight = weights.element( gx ).x.mul( weights.element( gy ).y ).mul( weights.element( gz ).z )
            const cellX = cellIndex.add( ivec3( gx, gy, gz ) ).toConst()
            const cellDist = vec3( cellX ).add( 0.5 ).sub( gridPosition ).toConst( 'cellDist' )
            const momentum = eq16Term0.mul( weight ).mul( cellDist ).toConst( 'momentum' )

            const cellPtr = cellX.x.mul( int( gridSize.y * gridSize.z ) ).add( cellX.y.mul( int( gridSize.z ) ) ).add( cellX.z ).toConst()
            const cell = cellBuffer.element( cellPtr )
            atomicAdd( cell.get( 'x' ), encodeFixedPoint( momentum.x ) )
            atomicAdd( cell.get( 'y' ), encodeFixedPoint( momentum.y ) )
            atomicAdd( cell.get( 'z' ), encodeFixedPoint( momentum.z ) )

          } )

        } )

      } )

    } )().compute( this.particleCount, [ workgroupSize, 1, 1 ] ).setName( 'p2g2Kernel' )

    const updateGridKernel = Fn( () => {

      const cell = cellBuffer.element( instanceIndex )
      const mass = decodeFixedPoint( atomicLoad( cell.get( 'mass' ) ) ).toConst()
      If( mass.lessThanEqual( 0 ), () => {

        Return()

      } )

      const vx = decodeFixedPoint( atomicLoad( cell.get( 'x' ) ) ).div( mass ).toVar()
      const vy = decodeFixedPoint( atomicLoad( cell.get( 'y' ) ) ).div( mass ).toVar()
      const vz = decodeFixedPoint( atomicLoad( cell.get( 'z' ) ) ).div( mass ).toVar()

      const x = int( instanceIndex ).div( int( gridSize.z * gridSize.y ) )
      const y = int( instanceIndex ).div( int( gridSize.z ) ).mod( int( gridSize.y ) )
      const z = int( instanceIndex ).mod( int( gridSize.z ) )
      If( x.lessThan( int( 1 ) ).or( x.greaterThan( int( gridSize.x ).sub( int( 2 ) ) ) ), () => {

        vx.assign( 0 )

      } )
      If( y.lessThan( int( 1 ) ).or( y.greaterThan( int( gridSize.y ).sub( int( 2 ) ) ) ), () => {

        vy.assign( 0 )

      } )
      If( z.lessThan( int( 1 ) ).or( z.greaterThan( int( gridSize.z ).sub( int( 2 ) ) ) ), () => {

        vz.assign( 0 )

      } )

      cellBufferFloat.element( instanceIndex ).assign( vec4( vx, vy, vz, mass ) )

    } )().compute( cellCount ).setName( 'updateGridKernel' )

    const g2pKernel = Fn( () => {

      const particlePosition = particleBuffer.element( instanceIndex ).get( 'position' ).toVar( 'particlePosition' )
      const gridPosition = particlePosition.mul( gridSizeUniform ).toVar()
      const particleVelocity = vec3( 0 ).toVar()

      const cellIndex = ivec3( gridPosition ).sub( 1 ).toConst( 'cellIndex' )
      const cellDiff = gridPosition.fract().sub( 0.5 ).toConst( 'cellDiff' )

      const w0 = float( 0.5 ).mul( float( 0.5 ).sub( cellDiff ) ).mul( float( 0.5 ).sub( cellDiff ) )
      const w1 = float( 0.75 ).sub( cellDiff.mul( cellDiff ) )
      const w2 = float( 0.5 ).mul( float( 0.5 ).add( cellDiff ) ).mul( float( 0.5 ).add( cellDiff ) )
      const weights: any = array( [ w0, w1, w2 ] ).toConst( 'weights' )

      const B = ( mat3 as any )( 0 ).toVar( 'B' )
      NamedLoop( { start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ( { gx }: any ) => {

        NamedLoop( { start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ( { gy }: any ) => {

          NamedLoop( { start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ( { gz }: any ) => {

            const weight = weights.element( gx ).x.mul( weights.element( gy ).y ).mul( weights.element( gz ).z )
            const cellX = cellIndex.add( ivec3( gx, gy, gz ) ).toConst()
            const cellDist = vec3( cellX ).add( 0.5 ).sub( gridPosition ).toConst( 'cellDist' )
            const cellPtr = cellX.x.mul( int( gridSize.y * gridSize.z ) ).add( cellX.y.mul( int( gridSize.z ) ) ).add( cellX.z ).toConst()

            const weightedVelocity = cellBufferFloat.element( cellPtr ).xyz.mul( weight ).toConst( 'weightedVelocity' )
            const term = mat3(
              weightedVelocity.mul( cellDist.x ),
              weightedVelocity.mul( cellDist.y ),
              weightedVelocity.mul( cellDist.z )
            )
            B.addAssign( term )
            particleVelocity.addAssign( weightedVelocity )

          } )

        } )

      } )

      particleBuffer.element( instanceIndex ).get( 'C' ).assign( B.mul( 4 ) )

      // gravity
      particleVelocity.addAssign( gravityUniform.mul( dtUniform ) )

      // scale from (gridSize.x, gridSize.y, gridSize.z) to (1, 1, 1)
      particleVelocity.divAssign( gridSizeUniform )

      // mouseInteraction
      const dist = cross( mouseRayDirectionUniform, particlePosition.sub( mouseRayOriginUniform ) ).length()
      const force = dist.mul( 3.00 ).oneMinus().max( 0.0 ).pow( 2 )
      particleVelocity.addAssign( mouseForceUniform.mul( force ) )

      // add velocity to position
      particlePosition.addAssign( particleVelocity.mul( dtUniform ) )

      // clamp position so outermost gridCells are not reached
      particlePosition.assign( clamp( particlePosition, vec3( 1 ).div( gridSizeUniform ), vec3( gridSize ).sub( 1 ).div( gridSizeUniform ) ) )

      // add force for particles to stay within rounded box
      const innerBox = gridSizeUniform.mul( 0.5 ).sub( 9.0 ).div( gridSizeUniform ).toVar()
      const innerRadius = float( 6.0 ).div( gridSizeUniform.x )
      const posNext = particlePosition.add( particleVelocity.mul( dtUniform ).mul( 2.0 ) ).toConst( 'posNext' )
      const posNextClamped = clampToRoundedBox( posNext, innerBox, innerRadius )
      particleVelocity.addAssign( posNextClamped.sub( posNext ) )

      // scale from (1, 1, 1) back to (gridSize.x, gridSize.y, gridSize.z) to
      particleVelocity.mulAssign( gridSizeUniform )

      particleBuffer.element( instanceIndex ).get( 'position' ).assign( particlePosition )
      particleBuffer.element( instanceIndex ).get( 'velocity' ).assign( particleVelocity )

    } )().compute( this.particleCount, [ workgroupSize, 1, 1 ] ).setName( 'g2pKernel' )

    this.kernels = [ clearGridKernel, p2g1Kernel, p2g2Kernel, updateGridKernel, g2pKernel ]
    this.particleKernels = [ p2g1Kernel, p2g2Kernel, g2pKernel ]

    // mesh

    // mergeVertices to reduce the number of vertexShaderCalls
    const geometry = BufferGeometryUtils.mergeVertices( new IcosahedronGeometry( 0.008, 1 ).deleteAttribute( 'uv' ) )

    const material = new MeshStandardNodeMaterial( {
      color: '#0066FF'
    } )

    material.positionNode = Fn( () => {

      const particlePosition = particleBuffer.element( instanceIndex ).get( 'position' )
      return attribute<'vec3'>( 'position' ).add( particlePosition )

    } )()
    this.particleMesh = new Mesh( geometry, material )
    this.particleMesh.name = 'Fluid'
    this.particleMesh.count = this.particleCount
    this.particleMesh.position.set( - 0.5, 0, - 0.5 )
    this.particleMesh.frustumCulled = false
    this.scene.add( this.particleMesh )

    void this.loadEnvironment()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadEnvironment() {
    try {
      const hdrTexture = await new UltraHDRLoader().setPath( 'https://threejs.org/examples/textures/equirectangular/' ).loadAsync( 'royal_esplanade_2k.hdr.jpg' )
      hdrTexture.mapping = EquirectangularReflectionMapping
      this.scene.background = hdrTexture
      this.scene.backgroundBlurriness = 0.5
      this.scene.environment = hdrTexture
      this.notify({kind: 'other'})
    } catch ( e ) {
      console.error( e )
    }
  }

  particleCountChanged() {
    if ( ! this.particleMesh ) return
    this.particleMesh.count = this.particleCount
    for ( const kernel of this.particleKernels ) kernel.count = this.particleCount
    this.notify({kind: 'other'})
  }

  /** Framing reads one sphere: frame a stand-in for the box the fluid fills. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 0.5, 0, - 0.5 ), new Vector3( 0.5, 1, 0.5 ) ] ) )
    this._frameTarget = standIn
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    if ( delta <= 0 ) return
    this.dtUniform.value = Math.max( Math.min( delta, MAX_DELTA ), 0.00001 )
    void renderer.compute( this.kernels )
  }
}

registerEditorConfig(ComputeParticlesFluidExample, [
  ['particleCount', ioNumberSlider({min: 4096, max: maxParticles, step: 4096})],
])

registerEditorGroups(ComputeParticlesFluidExample, {
  Main: ['particleCount'],
  Hidden: ['particleMesh', 'kernels', 'particleKernels', 'dtUniform'],
})
