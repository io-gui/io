import {
  BackSide,
  Box3,
  BufferAttribute,
  BufferGeometry,
  ComputeNode,
  DoubleSide,
  Fog,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicNodeMaterial,
  NeutralToneMapping,
  NodeMaterial,
  PerspectiveCamera,
  Sphere,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { uniform, varying, vec4, add, sub, max, dot, sin, mat3, uint, negate, instancedArray, cameraProjectionMatrix, cameraViewMatrix, positionLocal, modelWorldMatrix, sqrt, float, Fn, If, cos, Loop, Continue, normalize, instanceIndex, length, vertexIndex } from 'three/tsl'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

const BIRDS = 8192
const SPEED_LIMIT = 9.0
const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2

/** Longest step in seconds, as the source caps its frame delta. */
const MAX_DELTA = 1

// Custom Geometry - using 3 triangles each. No normals currently.
class BirdGeometry extends BufferGeometry {

  constructor() {

    super()

    const points = 3 * 3

    const vertices = new BufferAttribute( new Float32Array( points * 3 ), 3 )

    this.setAttribute( 'position', vertices )

    let v = 0

    function vertsPush( ...values: number[] ) {

      for ( let i = 0; i < values.length; i ++ ) {

        vertices.array[ v ++ ] = values[ i ]

      }

    }

    const wingsSpan = 20

    // Body
    vertsPush(
      0, 0, - 20,
      0, - 8, 10,
      0, 0, 30
    )

    // Left Wing
    vertsPush(
      0, 0, - 15,
      - wingsSpan, 0, 5,
      0, 0, 15
    )

    // Right Wing
    vertsPush(
      0, 0, 15,
      wingsSpan, 0, 5,
      0, 0, - 15
    )

    this.scale( 0.2, 0.2, 0.2 )

  }

}

/**
 * A flock of 8192 birds (separation, alignment and cohesion, drawn toward the middle) in a gradient sky, moved by two
 * compute passes and flapping in the vertex shader. `separation`, `alignment` and `cohesion` are in the Document tab.
 * The birds are live: the compute passes step by the time played forward (`onBeforeDraw`), so scrubbing back or a
 * loop wrap does not rewind them. The pointer that scatters the birds is dropped. Plays when opened.
 */
@Register
export class ComputeBirdsExample extends Document {

  @Property({type: Number, value: 15})
  declare separation: number

  @Property({type: Number, value: 20})
  declare alignment: number

  @Property({type: Number, value: 20})
  declare cohesion: number

  public birdMesh: InstancedMesh<BirdGeometry, NodeMaterial>
  private computeVelocity: ComputeNode
  private computePosition: ComputeNode
  private effectController = {
    separation: uniform( 15.0 ).setName( 'separation' ),
    alignment: uniform( 20.0 ).setName( 'alignment' ),
    cohesion: uniform( 20.0 ).setName( 'cohesion' ),
    deltaTime: uniform( 0.0 ).setName( 'deltaTime' ),
    // The source's pointer ray. Without a pointer it runs far from the flock (the source moves the pointer off screen).
    rayOrigin: uniform( new Vector3( 0, 10000, 10000 ) ).setName( 'rayOrigin' ),
    rayDirection: uniform( new Vector3( 1, 0, 0 ) ).setName( 'rayDirection' )
  }

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 5000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 1000 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.fog = new Fog( 0xffffff, 700, 3000 )

    // Sky

    const geometry = new IcosahedronGeometry( 1, 6 )
    const material = new MeshBasicNodeMaterial( {
      // Use vertex positions to create atmosphere colors
      colorNode: varying(
        vec4(
          sub( 0.25, positionLocal.y ),
          sub( - 0.25, positionLocal.y ),
          add( 1.5, positionLocal.y ),
          1.0
        )
      ),
      side: BackSide
    } )

    const mesh = new Mesh( geometry, material )
    mesh.name = 'Sky'
    mesh.userData.selectable = false
    mesh.rotation.z = 0.75
    mesh.scale.setScalar( 1200 )
    this.scene.add( mesh )

    // Initialize position, velocity, and phase values

    const positionArray = new Float32Array( BIRDS * 3 )
    const velocityArray = new Float32Array( BIRDS * 3 )
    const phaseArray = new Float32Array( BIRDS )

    for ( let i = 0; i < BIRDS; i ++ ) {

      const posX = Math.random() * BOUNDS - BOUNDS_HALF
      const posY = Math.random() * BOUNDS - BOUNDS_HALF
      const posZ = Math.random() * BOUNDS - BOUNDS_HALF

      positionArray[ i * 3 + 0 ] = posX
      positionArray[ i * 3 + 1 ] = posY
      positionArray[ i * 3 + 2 ] = posZ

      const velX = Math.random() - 0.5
      const velY = Math.random() - 0.5
      const velZ = Math.random() - 0.5

      velocityArray[ i * 3 + 0 ] = velX * 10
      velocityArray[ i * 3 + 1 ] = velY * 10
      velocityArray[ i * 3 + 2 ] = velZ * 10

      phaseArray[ i ] = 1

    }

    // Labels applied to storage nodes and uniform nodes are reflected within the shader output,
    // and are useful for debugging purposes.

    const positionStorage = instancedArray( positionArray, 'vec3' ).setName( 'positionStorage' )
    const velocityStorage = instancedArray( velocityArray, 'vec3' ).setName( 'velocityStorage' )
    const phaseStorage = instancedArray( phaseArray, 'float' ).setName( 'phaseStorage' )

    const effectController = this.effectController

    // Create geometry

    const birdGeometry = new BirdGeometry()
    const birdMaterial = new NodeMaterial()

    // Animate bird mesh within vertex shader, then apply position offset to vertices.

    const birdVertexTSL = Fn( () => {

      const position = positionLocal.toVar()
      const newPhase = phaseStorage.element( instanceIndex ).toVar()
      const newVelocity = normalize( velocityStorage.element( instanceIndex ) ).toVar()

      If( vertexIndex.equal( 4 ).or( vertexIndex.equal( 7 ) ), () => {

        // flap wings
        position.y = sin( newPhase ).mul( 5.0 )

      } )

      const newPosition = modelWorldMatrix.mul( position )

      newVelocity.z.mulAssign( - 1.0 )
      const xz = length( newVelocity.xz )
      const xyz = float( 1.0 )
      const x = sqrt( ( newVelocity.y.mul( newVelocity.y ) ).oneMinus() )

      const cosry = newVelocity.x.div( xz ).toVar()
      const sinry = newVelocity.z.div( xz ).toVar()

      const cosrz = x.div( xyz )
      const sinrz = newVelocity.y.div( xyz ).toVar()

      // Nodes must be negated with negate(). Using '-', their values will resolve to NaN.
      const maty = mat3(
        cosry, 0, negate( sinry ),
        0, 1, 0,
        sinry, 0, cosry
      )

      const matz = mat3(
        cosrz, sinrz, 0,
        negate( sinrz ), cosrz, 0,
        0, 0, 1
      )

      const finalVert = maty.mul( matz ).mul( newPosition )
      finalVert.addAssign( positionStorage.element( instanceIndex ) )

      return cameraProjectionMatrix.mul( cameraViewMatrix ).mul( finalVert )

    } )

    birdMaterial.vertexNode = birdVertexTSL()
    birdMaterial.side = DoubleSide

    this.birdMesh = new InstancedMesh( birdGeometry, birdMaterial, BIRDS )
    this.birdMesh.name = 'Birds'
    this.birdMesh.rotation.y = Math.PI / 2
    this.birdMesh.matrixAutoUpdate = false
    this.birdMesh.frustumCulled = false
    this.birdMesh.updateMatrix()
    // Positions come from the compute pass: the flock's extent, for framing.
    this.birdMesh.boundingBox = new Box3( new Vector3( - BOUNDS_HALF, - BOUNDS_HALF, - BOUNDS_HALF ), new Vector3( BOUNDS_HALF, BOUNDS_HALF, BOUNDS_HALF ) )
    this.birdMesh.boundingSphere = this.birdMesh.boundingBox.getBoundingSphere( new Sphere() )

    // Define GPU Compute shaders.
    // Shaders are computationally identical to their GLSL counterparts outside of texture destructuring.

    this.computeVelocity = Fn( () => {

      // Define consts
      const PI = float( 3.141592653589793 )
      const PI_2 = PI.mul( 2.0 )
      const limit = float( SPEED_LIMIT ).toVar( 'limit' )

      // Destructure uniforms
      const { alignment, separation, cohesion, deltaTime, rayOrigin, rayDirection } = effectController

      const zoneRadius = separation.add( alignment ).add( cohesion ).toConst()
      const separationThresh = separation.div( zoneRadius ).toConst()
      const alignmentThresh = ( separation.add( alignment ) ).div( zoneRadius ).toConst()
      const zoneRadiusSq = zoneRadius.mul( zoneRadius ).toConst()

      // Cache current bird's position and velocity outside the loop
      const birdIndex = instanceIndex.toConst( 'birdIndex' )
      const position = positionStorage.element( birdIndex ).toVar()
      const velocity = velocityStorage.element( birdIndex ).toVar()

      // Add influence of pointer position to velocity using cached position
      const directionToRay = rayOrigin.sub( position ).toConst()
      const projectionLength = dot( directionToRay, rayDirection ).toConst()
      const closestPoint = rayOrigin.sub( rayDirection.mul( projectionLength ) ).toConst()
      const directionToClosestPoint = closestPoint.sub( position ).toConst()
      const distanceToClosestPoint = length( directionToClosestPoint ).toConst()
      const distanceToClosestPointSq = distanceToClosestPoint.mul( distanceToClosestPoint ).toConst()

      const rayRadius = float( 150.0 ).toConst()
      const rayRadiusSq = rayRadius.mul( rayRadius ).toConst()

      If( distanceToClosestPointSq.lessThan( rayRadiusSq ), () => {

        const velocityAdjust = ( distanceToClosestPointSq.div( rayRadiusSq ).sub( 1.0 ) ).mul( deltaTime ).mul( 100.0 )
        velocity.addAssign( normalize( directionToClosestPoint ).mul( velocityAdjust ) )
        limit.addAssign( 5.0 )

      } )

      // Attract flocks to center
      const dirToCenter = position.toVar()
      dirToCenter.y.mulAssign( 2.5 )
      velocity.subAssign( normalize( dirToCenter ).mul( deltaTime ).mul( 5.0 ) )

      Loop( { start: uint( 0 ), end: uint( BIRDS ), type: 'uint', condition: '<' }, ( { i } ) => {

        If( i.equal( birdIndex ), () => {

          Continue()

        } )

        // Cache bird's position and velocity

        const birdPosition = positionStorage.element( i )
        const dirToBird = birdPosition.sub( position )
        const distToBird = length( dirToBird )

        If( distToBird.lessThan( 0.0001 ), () => {

          Continue()

        } )

        const distToBirdSq = distToBird.mul( distToBird )

        // Don't apply any changes to velocity if changes if the bird is outsize the zone's radius.
        If( distToBirdSq.greaterThan( zoneRadiusSq ), () => {

          Continue()

        } )

        // Determine which threshold the bird is flying within and adjust its velocity accordingly

        const percent = distToBirdSq.div( zoneRadiusSq )

        If( percent.lessThan( separationThresh ), () => {

          // Separation - Move apart for comfort
          const velocityAdjust = ( separationThresh.div( percent ).sub( 1.0 ) ).mul( deltaTime )
          velocity.subAssign( normalize( dirToBird ).mul( velocityAdjust ) )

        } ).ElseIf( percent.lessThan( alignmentThresh ), () => {

          // Alignment - fly the same direction
          const threshDelta = alignmentThresh.sub( separationThresh )
          const adjustedPercent = ( percent.sub( separationThresh ) ).div( threshDelta )
          const birdVelocity = velocityStorage.element( i )

          const cosRange = cos( adjustedPercent.mul( PI_2 ) )
          const cosRangeAdjust = float( 0.5 ).sub( cosRange.mul( 0.5 ) ).add( 0.5 )
          const velocityAdjust = cosRangeAdjust.mul( deltaTime )
          velocity.addAssign( normalize( birdVelocity ).mul( velocityAdjust ) )

        } ).Else( () => {

          // Attraction / Cohesion - move closer
          const threshDelta = alignmentThresh.oneMinus()
          const adjustedPercent = threshDelta.equal( 0.0 ).select( 1.0, ( percent.sub( alignmentThresh ) ).div( threshDelta ) )

          const cosRange = cos( adjustedPercent.mul( PI_2 ) )
          const adj1 = cosRange.mul( - 0.5 )
          const adj2 = adj1.add( 0.5 )
          const adj3 = float( 0.5 ).sub( adj2 )

          const velocityAdjust = adj3.mul( deltaTime )
          velocity.addAssign( normalize( dirToBird ).mul( velocityAdjust ) )

        } )

      } )

      If( length( velocity ).greaterThan( limit ), () => {

        velocity.assign( normalize( velocity ).mul( limit ) )

      } )

      // Write back the final velocity to storage
      velocityStorage.element( birdIndex ).assign( velocity )

    } )().compute( BIRDS ).setName( 'Birds Velocity' )

    this.computePosition = Fn( () => {

      const { deltaTime } = effectController
      positionStorage.element( instanceIndex ).addAssign( velocityStorage.element( instanceIndex ).mul( deltaTime ).mul( 15.0 ) )

      const velocity = velocityStorage.element( instanceIndex )
      const phase = phaseStorage.element( instanceIndex )

      const modValue = phase.add( deltaTime ).add( length( velocity.xz ).mul( deltaTime ).mul( 3.0 ) ).add( max( velocity.y, 0.0 ).mul( deltaTime ).mul( 6.0 ) )
      phaseStorage.element( instanceIndex ).assign( modValue.mod( 62.83 ) )

    } )().compute( BIRDS ).setName( 'Birds Position' )

    this.scene.add( this.birdMesh )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  separationChanged() { this.effectController.separation.value = this.separation }
  alignmentChanged() { this.effectController.alignment.value = this.alignment }
  cohesionChanged() { this.effectController.cohesion.value = this.cohesion }

  /** The sky would dominate whole-scene framing: frame the flock. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this._frameTarget = this.birdMesh
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    if ( delta <= 0 ) return
    this.effectController.deltaTime.value = Math.min( delta, MAX_DELTA )
    void renderer.compute( this.computeVelocity )
    void renderer.compute( this.computePosition )
  }
}

registerEditorConfig(ComputeBirdsExample, [
  ['separation', ioNumberSlider({min: 0, max: 100, step: 1})],
  ['alignment', ioNumberSlider({min: 0, max: 100, step: 0.001})],
  ['cohesion', ioNumberSlider({min: 0, max: 100, step: 0.025})],
])

registerEditorGroups(ComputeBirdsExample, {
  Main: ['separation', 'alignment', 'cohesion'],
  Hidden: ['birdMesh', 'computeVelocity', 'computePosition', 'effectController'],
})
