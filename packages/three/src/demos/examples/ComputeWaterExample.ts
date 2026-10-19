import {
  ACESFilmicToneMapping,
  ComputeNode,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  TorusGeometry,
  Vector2,
  WebGPURenderer
} from 'three/webgpu'
import { instanceIndex, struct, If, uint, int, floor, float, length, clamp, vec2, cos, vec3, vertexIndex, Fn, uniform, instancedArray, min, max, positionLocal, transformNormalToView, select, globalId } from 'three/tsl'
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

// Dimensions of simulation grid.
const WIDTH = 128

// Water size in system units.
const BOUNDS = 6
const BOUNDS_HALF = BOUNDS * 0.5
const limit = BOUNDS_HALF - 0.2

const waterMaxHeight = 0.1

const NUM_DUCKS = 100

/** The source counts frames to pace the simulation: 60 per second. */
const FRAME_RATE = 60

/** Longest time played per draw: scrubbing forward fast-forwards at most this far. */
const MAX_DELTA = 1 / 15

const simplex = new SimplexNoise()

function noise( x: number, y: number ) {

  let multR = waterMaxHeight
  let mult = 0.025
  let r = 0
  for ( let i = 0; i < 15; i ++ ) {

    r += multR * simplex.noise( x * mult, y * mult )
    multR *= 0.53 + 0.025 * i
    mult *= 1.25

  }

  return r

}

/** A renderer's simulation clock: time not yet a whole source frame, frames since the last step, the buffer read. */
type SimulationState = { time: number; frame: number; pingPong: number }

// @types/three 0.186 types neither struct buffers nor the grid helpers' index arithmetic: those nodes go through `any`.
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Rubber ducks floating on a pool whose water heights are a wave simulation on a 128² grid: two ping-pong compute
 * passes update the heights, a third moves the ducks with the water's slope. `viscosity`, `speed` (steps every
 * `7 - speed` source frames), `ducks` and `wireframe` are in the Document tab. The water and ducks are live: they step
 * by the time played forward (`onBeforeDraw`), so scrubbing back or a loop wrap does not rewind them. The pointer
 * ripples (and their `mouseSize` / `mouseDeep` controls) are dropped: the waves are the initial noise settling.
 * Plays when opened.
 */
@Register
export class ComputeWaterExample extends Document {

  @Property({type: Number, value: 0.96})
  declare viscosity: number

  @Property({type: Number, value: 5})
  declare speed: number

  @Property({type: Boolean, value: true})
  declare ducks: boolean

  @Property({type: Boolean, value: false})
  declare wireframe: boolean

  public waterMesh: Mesh<PlaneGeometry, MeshStandardNodeMaterial>
  public poolBorder: Mesh<TorusGeometry, MeshStandardMaterial>
  public duckMesh?: InstancedMesh
  private effectController = {
    // The source's pointer: without one its speed stays zero and it makes no ripples.
    mousePos: uniform( new Vector2() ).setName( 'mousePos' ),
    mouseSpeed: uniform( new Vector2() ).setName( 'mouseSpeed' ),
    mouseDeep: uniform( .5 ).setName( 'mouseDeep' ),
    mouseSize: uniform( 0.12 ).setName( 'mouseSize' ),
    viscosity: uniform( 0.96 ).setName( 'viscosity' ),
  }
  private readFromA = uniform( 1 )
  private computeHeightAtoB: ComputeNode
  private computeHeightBtoA: ComputeNode
  private computeDucks: ComputeNode
  private duckInstanceDataStorage: any
  private states = new WeakMap<WebGPURenderer, SimulationState>()

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.5, timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 75, 400 / 250, 1, 3000 )
    camera.name = 'Camera'
    camera.position.set( 0, 2, 4 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const sun = new DirectionalLight( 0xFFFFFF, 4.0 )
    sun.name = 'Sun'
    sun.position.set( - 1, 2.6, 1.4 )
    this.scene.add( sun )

    //

    // Initialize height storage buffers
    const heightArray = new Float32Array( WIDTH * WIDTH )
    const prevHeightArray = new Float32Array( WIDTH * WIDTH )

    let p = 0
    for ( let j = 0; j < WIDTH; j ++ ) {

      for ( let i = 0; i < WIDTH; i ++ ) {

        const x = i * 128 / WIDTH
        const y = j * 128 / WIDTH

        const height = noise( x, y )

        heightArray[ p ] = height
        prevHeightArray[ p ] = height

        p ++

      }

    }

    // Ping-pong height storage buffers
    const heightStorageA = instancedArray( heightArray ).setName( 'HeightA' )
    const heightStorageB = instancedArray( new Float32Array( heightArray ) ).setName( 'HeightB' )
    const prevHeightStorage = instancedArray( prevHeightArray ).setName( 'PrevHeight' )

    const effectController = this.effectController
    const readFromA = this.readFromA

    // Get Indices of Neighbor Values of an Index in the Simulation Grid
    const getNeighborIndicesTSL = ( index: any ) => {

      const width = uint( WIDTH )

      // Get 2-D compute coordinate from one-dimensional instanceIndex. The calculation will
      // still work even if you dispatch your compute shader 2-dimensionally, since within a compute
      // context, instanceIndex is a 1-dimensional value derived from the workgroup dimensions.

      // Cast to int to prevent unintended index overflow upon subtraction.
      const x: any = int( index.mod( WIDTH ) )
      const y: any = int( index.div( WIDTH ) )

      // The original shader accesses height via texture uvs. However, unlike with textures, we can't
      // access areas that are out of bounds. Accordingly, we emulate the Clamp to Edge Wrapping
      // behavior of accessing a DataTexture with out of bounds uvs.

      const leftX = ( max as any )( 0, x.sub( 1 ) )
      const rightX = ( min as any )( x.add( 1 ), width.sub( 1 ) )

      const bottomY = ( max as any )( 0, y.sub( 1 ) )
      const topY = ( min as any )( y.add( 1 ), width.sub( 1 ) )

      const westIndex = y.mul( width ).add( leftX )
      const eastIndex = y.mul( width ).add( rightX )

      const southIndex = bottomY.mul( width ).add( x )
      const northIndex = topY.mul( width ).add( x )

      return { northIndex, southIndex, eastIndex, westIndex }

    }

    // Get simulation index neighbor values
    const getNeighborValuesTSL = ( index: any, store: any ) => {

      const { northIndex, southIndex, eastIndex, westIndex } = getNeighborIndicesTSL( index )

      const north = store.element( northIndex )
      const south = store.element( southIndex )
      const east = store.element( eastIndex )
      const west = store.element( westIndex )

      return { north, south, east, west }

    }

    // Create compute shader for height simulation with explicit read/write buffers
    const createComputeHeight = ( readBuffer: any, writeBuffer: any ) => Fn( () => {

      const { viscosity, mousePos, mouseSize, mouseDeep, mouseSpeed } = effectController

      const height = readBuffer.element( instanceIndex ).toVar()
      const prevHeight = prevHeightStorage.element( instanceIndex ).toVar()

      const { north, south, east, west } = getNeighborValuesTSL( instanceIndex, readBuffer )

      const neighborHeight = north.add( south ).add( east ).add( west )
      neighborHeight.mulAssign( 0.5 )
      neighborHeight.subAssign( prevHeight )

      const newHeight = neighborHeight.mul( viscosity )

      // Get x and y position of the coordinate in the water plane

      const x = float( globalId.x ).mul( 1 / WIDTH )
      const y = float( globalId.y ).mul( 1 / WIDTH )

      // Mouse influence
      const centerVec = vec2( 0.5 )

      // Get length of position in range [ -BOUNDS / 2, BOUNDS / 2 ], offset by mousePos, then scale.
      const mousePhase = clamp( length( ( vec2( x, y ).sub( centerVec ) ).mul( BOUNDS ).sub( mousePos ) ).mul( Math.PI ).div( mouseSize ), 0.0, Math.PI )

      // "Indent" water down by scaled distance from center of mouse impact
      newHeight.addAssign( cos( mousePhase ).add( 1.0 ).mul( mouseDeep ).mul( mouseSpeed.length() ) )

      prevHeightStorage.element( instanceIndex ).assign( height )
      writeBuffer.element( instanceIndex ).assign( newHeight )

    } )().computeKernel( [ 16, 16 ] )

    // Create both ping-pong compute shaders
    this.computeHeightAtoB = createComputeHeight( heightStorageA, heightStorageB ).setName( 'Update Height A→B' )
    this.computeHeightBtoA = createComputeHeight( heightStorageB, heightStorageA ).setName( 'Update Height B→A' )

    // Water Geometry corresponds with buffered compute grid.
    const waterGeometry = new PlaneGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1 )

    const waterMaterial = new MeshStandardNodeMaterial( {
      color: 0x9bd2ec,
      metalness: 0.9,
      roughness: 0,
      transparent: true,
      opacity: 0.8,
      side: DoubleSide
    } )

    // Helper to get height from the current read buffer
    const getCurrentHeight = ( index: any ) => {

      return ( select as any )( readFromA, heightStorageA.element( index ), heightStorageB.element( index ) )

    }

    // Helper to get normals from the current read buffer
    const getCurrentNormals = ( index: any ) => {

      const { northIndex, southIndex, eastIndex, westIndex } = getNeighborIndicesTSL( index )

      const north = getCurrentHeight( northIndex )
      const south = getCurrentHeight( southIndex )
      const east = getCurrentHeight( eastIndex )
      const west = getCurrentHeight( westIndex )

      const normalX = ( west.sub( east ) ).mul( WIDTH / BOUNDS )
      const normalY = ( south.sub( north ) ).mul( WIDTH / BOUNDS )

      return { normalX, normalY }

    }

    waterMaterial.normalNode = Fn( () => {

      // To correct the lighting as our mesh undulates, we have to reassign the normals in the normal shader.
      const { normalX, normalY } = getCurrentNormals( vertexIndex )

      return transformNormalToView( vec3( normalX, normalY.negate(), 1.0 ) ).toVertexStage()

    } )()

    waterMaterial.positionNode = Fn( () => {

      return vec3( positionLocal.x, positionLocal.y, getCurrentHeight( vertexIndex ) )

    } )()

    this.waterMesh = new Mesh( waterGeometry, waterMaterial )
    this.waterMesh.name = 'Water'
    this.waterMesh.rotation.x = - Math.PI * 0.5
    this.waterMesh.matrixAutoUpdate = false
    this.waterMesh.updateMatrix()

    this.scene.add( this.waterMesh )

    // Pool border
    const borderGeom = new TorusGeometry( 4.2, 0.1, 12, 4 )
    borderGeom.rotateX( Math.PI * 0.5 )
    borderGeom.rotateY( Math.PI * 0.25 )
    this.poolBorder = new Mesh( borderGeom, new MeshStandardMaterial( { color: 0x908877, roughness: 0.2 } ) )
    this.poolBorder.name = 'Pool Border'
    this.scene.add( this.poolBorder )

    // Initialize sphere mesh instance position and velocity.
    // position<vec3> + velocity<vec2> + unused<vec3> = 8 floats per sphere.
    // for structs arrays must be enclosed in multiple of 4

    const duckStride = 8
    const duckInstanceDataArray = new Float32Array( NUM_DUCKS * duckStride )

    // Only hold velocity in x and z directions.
    // The sphere is wedded to the surface of the water, and will only move vertically with the water.

    for ( let i = 0; i < NUM_DUCKS; i ++ ) {

      duckInstanceDataArray[ i * duckStride + 0 ] = ( Math.random() - 0.5 ) * BOUNDS * 0.7
      duckInstanceDataArray[ i * duckStride + 1 ] = 0
      duckInstanceDataArray[ i * duckStride + 2 ] = ( Math.random() - 0.5 ) * BOUNDS * 0.7

    }

    const DuckStruct = struct( {
      position: 'vec3',
      velocity: 'vec2'
    } )

    // Duck instance data storage

    const duckInstanceDataStorage: any = instancedArray( duckInstanceDataArray, DuckStruct as any ).setName( 'DuckInstanceData' )
    this.duckInstanceDataStorage = duckInstanceDataStorage

    this.computeDucks = Fn( () => {

      const yOffset = float( - 0.04 )
      const verticalResponseFactor = float( 0.98 )
      const waterPushFactor = float( 0.015 )
      const linearDamping = float( 0.92 )
      const bounceDamping = float( - 0.4 )

      // Get 2-D compute coordinate from one-dimensional instanceIndex.
      const instancePosition = duckInstanceDataStorage.element( instanceIndex ).get( 'position' ).toVar()
      const velocity = duckInstanceDataStorage.element( instanceIndex ).get( 'velocity' ).toVar()

      const gridCoordX = instancePosition.x.div( BOUNDS ).add( 0.5 ).mul( WIDTH )
      const gridCoordZ = instancePosition.z.div( BOUNDS ).add( 0.5 ).mul( WIDTH )

      // Cast to int to prevent unintended index overflow upon subtraction.
      const xCoord = uint( clamp( floor( gridCoordX ), 0, WIDTH - 1 ) )
      const zCoord = uint( clamp( floor( gridCoordZ ), 0, WIDTH - 1 ) )
      const heightInstanceIndex = zCoord.mul( WIDTH ).add( xCoord )

      // Get height of water at the duck's position (use current read buffer)
      const waterHeight = getCurrentHeight( heightInstanceIndex )
      const { normalX, normalY } = getCurrentNormals( heightInstanceIndex )

      // Calculate the target Y position based on the water height and the duck's vertical offset
      const targetY = waterHeight.add( yOffset )

      const deltaY = targetY.sub( instancePosition.y )
      instancePosition.y.addAssign( deltaY.mul( verticalResponseFactor ) ) // Gradually update position

      // Get the normal of the water surface at the duck's position
      const pushX = normalX.mul( waterPushFactor )
      const pushZ = normalY.mul( waterPushFactor )

      // Apply the water push to the duck's velocity
      velocity.x.mulAssign( linearDamping )
      velocity.y.mulAssign( linearDamping )

      velocity.x.addAssign( pushX )
      velocity.y.addAssign( pushZ )

      // update position based on velocity
      instancePosition.x.addAssign( velocity.x )
      instancePosition.z.addAssign( velocity.y )

      // Clamp position to the pool bounds

      If( instancePosition.x.lessThan( - limit ), () => {

        instancePosition.x = - limit
        velocity.x.mulAssign( bounceDamping )

      } ).ElseIf( instancePosition.x.greaterThan( limit ), () => {

        instancePosition.x = limit
        velocity.x.mulAssign( bounceDamping )

      } )

      If( instancePosition.z.lessThan( - limit ), () => {

        instancePosition.z = - limit
        velocity.y.mulAssign( bounceDamping ) // Invert and damp vz (velocity.y)

      } ).ElseIf( instancePosition.z.greaterThan( limit ), () => {

        instancePosition.z = limit
        velocity.y.mulAssign( bounceDamping )

      } )

      // assignment of new values to the instance data storage

      duckInstanceDataStorage.element( instanceIndex ).get( 'position' ).assign( instancePosition )
      duckInstanceDataStorage.element( instanceIndex ).get( 'velocity' ).assign( velocity )

    } )().compute( NUM_DUCKS ).setName( 'Update Ducks' )

    void this.load()
  }

  private async load() {
    try {
      const hdrLoader = new HDRLoader().setPath( 'https://threejs.org/examples/textures/equirectangular/' )
      const glbloader = new GLTFLoader().setPath( 'https://threejs.org/examples/models/gltf/' )
      glbloader.setDRACOLoader( new DRACOLoader().setDecoderPath( DRACO_GLTF_CONFIG ) )

      const [ env, model ] = await Promise.all( [ hdrLoader.loadAsync( 'blouberg_sunrise_2_1k.hdr' ), glbloader.loadAsync( 'duck.glb' ) ] )
      env.mapping = EquirectangularReflectionMapping
      this.scene.environment = env
      this.scene.background = env
      this.scene.backgroundBlurriness = 0.3
      this.scene.environmentIntensity = 1.25

      const duckInstanceDataStorage = this.duckInstanceDataStorage
      const duckModel = model.scene.children[ 0 ] as Mesh<Mesh['geometry'], MeshStandardNodeMaterial>
      duckModel.material.positionNode = Fn( () => {

        const instancePosition = duckInstanceDataStorage.element( instanceIndex ).get( 'position' )

        const newPosition = positionLocal.add( instancePosition )

        return newPosition

      } )()

      const duckMesh = new InstancedMesh( duckModel.geometry, duckModel.material, NUM_DUCKS )
      duckMesh.name = 'Ducks'
      // Positions come from the compute pass; the instances' bounds are one duck at the origin.
      duckMesh.frustumCulled = false
      this.duckMesh = duckMesh
      this.scene.add( duckMesh )

      this.ducksChanged()
      this.wireframeChanged()
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  viscosityChanged() { this.effectController.viscosity.value = this.viscosity }

  ducksChanged() {
    if ( ! this.duckMesh ) return
    this.duckMesh.visible = this.ducks
    this.notify({kind: 'other'})
  }

  wireframeChanged() {
    if ( ! this.waterMesh ) return
    const materials = [ this.waterMesh.material, this.poolBorder.material ]
    if ( this.duckMesh ) materials.push( this.duckMesh.material as MeshStandardMaterial )
    for ( const material of materials ) {
      material.wireframe = this.wireframe
      material.needsUpdate = true
    }
    this.notify({kind: 'material'})
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    let state = this.states.get( renderer )
    if ( ! state ) this.states.set( renderer, state = { time: 0, frame: 0, pingPong: 0 } )

    state.time += Math.min( delta, MAX_DELTA )
    const frames = Math.floor( state.time * FRAME_RATE )
    state.time -= frames / FRAME_RATE

    for ( let i = 0; i < frames; i ++ ) {

      state.frame ++

      if ( state.frame < 7 - this.speed ) continue

      // Ping-pong: alternate which buffer we read from and write to
      if ( state.pingPong === 0 ) {

        void renderer.compute( this.computeHeightAtoB, [ 8, 8, 1 ] )
        this.readFromA.value = 0 // Material now reads from B (just written)

      } else {

        void renderer.compute( this.computeHeightBtoA, [ 8, 8, 1 ] )
        this.readFromA.value = 1 // Material now reads from A (just written)

      }

      state.pingPong = 1 - state.pingPong

      if ( this.ducks && this.duckMesh ) {

        void renderer.compute( this.computeDucks )

      }

      state.frame = 0

    }
  }
}

registerEditorConfig(ComputeWaterExample, [
  ['viscosity', ioNumberSlider({min: 0.9, max: 0.96, step: 0.001})],
  ['speed', ioNumberSlider({min: 1, max: 6, step: 1})],
])

registerEditorGroups(ComputeWaterExample, {
  Main: ['viscosity', 'speed', 'ducks', 'wireframe'],
  Hidden: [
    'waterMesh', 'poolBorder', 'duckMesh', 'effectController', 'readFromA', 'computeHeightAtoB', 'computeHeightBtoA',
    'computeDucks', 'duckInstanceDataStorage', 'states',
  ],
})
