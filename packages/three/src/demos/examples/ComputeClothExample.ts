import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ComputeNode,
  DoubleSide,
  EquirectangularReflectionMapping,
  IcosahedronGeometry,
  InstancedBufferGeometry,
  Line,
  LineBasicNodeMaterial,
  Mesh,
  MeshPhysicalNodeMaterial,
  MeshStandardNodeMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  SpriteNodeMaterial,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, If, Return, instancedArray, instanceIndex, uniform, select, attribute, Loop, float, transformNormalToView, cross, triNoise3D, EPSILON } from 'three/tsl'
import type { Node } from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

const clothWidth = 1
const clothHeight = 1
const clothNumSegmentsX = 30
const clothNumSegmentsY = 30
const sphereRadius = 0.15

/** Simulation steps per second, independent of the frame rate (the source's `stepsPerSecond`). */
const STEPS_PER_SECOND = 360

/** Longest time stepped per draw, as the source caps its frame delta. */
const MAX_DELTA = 1 / 60

/** Seconds of one loop of the sphere's path: 21 and 8 periods of its two sines (2.1 and 0.8 rad/s). */
const PERIOD = 20 * Math.PI

type VerletVertex = {
  id: number
  position: Vector3
  isFixed: boolean
  springIds: number[]
}

type VerletSpring = {
  id: number
  vertex0: VerletVertex
  vertex1: VerletVertex
}

/**
 * A sheen cloth hanging from a few pinned points, blown by noise wind and pushed by a moving sphere: a verlet system of
 * vertices and springs stepped by two compute passes, 360 steps per second, and drawn as a mesh whose vertices sit
 * between four verlet vertices. `stiffness`, `wireframe` (the verlet vertices and springs), `sphere`, `wind` and the
 * cloth material are in the Document tab. The cloth is live: it steps by the time played forward (`onBeforeDraw`), so
 * scrubbing back or a loop wrap does not rewind it. The sphere's path follows document time; the substeps of a draw
 * move the collision sphere toward it. Plays when opened.
 */
@Register
export class ComputeClothExample extends Document {

  @Property({type: Number, value: 0.2})
  declare stiffness: number

  @Property({type: Boolean, value: false})
  declare wireframe: boolean

  @Property({type: Boolean, value: true})
  declare sphere: boolean

  @Property({type: Number, value: 1})
  declare wind: number

  @Property({type: Color, init: [ 0x204080 ]})
  declare color: Color

  @Property({type: Number, value: 1})
  declare roughness: number

  @Property({type: Number, value: 1})
  declare sheen: number

  @Property({type: Number, value: 0.5})
  declare sheenRoughness: number

  @Property({type: Color, init: null})
  declare sheenColor: Color

  public clothMesh!: Mesh<BufferGeometry, MeshPhysicalNodeMaterial>
  public sphereMesh!: Mesh<IcosahedronGeometry, MeshStandardNodeMaterial>
  public vertexWireframeObject!: Mesh<PlaneGeometry, SpriteNodeMaterial>
  public springWireframeObject!: Line<InstancedBufferGeometry, LineBasicNodeMaterial>
  private verletVertices: VerletVertex[] = []
  private verletSprings: VerletSpring[] = []
  private verletVertexColumns: VerletVertex[][] = []
  private dampeningUniform = uniform( 0.99 )
  private spherePositionUniform = uniform( new Vector3( 0, 0, 0 ) )
  private sphereUniform = uniform( 1.0 )
  private windUniform = uniform( 1.0 )
  private stiffnessUniform = uniform( 0.2 )
  private computeSpringForces!: ComputeNode
  private computeVertexForces!: ComputeNode
  /** Time played forward that is not a whole step yet, per renderer. */
  private stepTime = new WeakMap<WebGPURenderer, number>()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, toneMappingExposure: 1, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 0.01, 10 )
    camera.name = 'Camera'
    camera.position.set( - 1.6, - 0.1, - 1.6 )
    camera.lookAt( 0, - 0.1, 0 )
    this.activeCamera = camera

    this.setupCloth()
    this.pose( this.timeline.currentTime )
    this.spherePositionUniform.value.copy( this.sphereMesh.position )
    this.updateMaterial()

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

  private setupVerletGeometry() {

    // this function sets up the geometry of the verlet system, a grid of vertices connected by springs

    const { verletVertices, verletSprings, verletVertexColumns } = this

    const addVerletVertex = ( x: number, y: number, z: number, isFixed: boolean ) => {

      const id = verletVertices.length
      const vertex: VerletVertex = {
        id,
        position: new Vector3( x, y, z ),
        isFixed,
        springIds: [],
      }
      verletVertices.push( vertex )
      return vertex

    }

    const addVerletSpring = ( vertex0: VerletVertex, vertex1: VerletVertex ) => {

      const id = verletSprings.length
      const spring = {
        id,
        vertex0,
        vertex1
      }
      vertex0.springIds.push( id )
      vertex1.springIds.push( id )
      verletSprings.push( spring )
      return spring

    }

    // create the cloth's verlet vertices
    for ( let x = 0; x <= clothNumSegmentsX; x ++ ) {

      const column: VerletVertex[] = []
      for ( let y = 0; y <= clothNumSegmentsY; y ++ ) {

        const posX = x * ( clothWidth / clothNumSegmentsX ) - clothWidth * 0.5
        const posZ = y * ( clothHeight / clothNumSegmentsY )
        const isFixed = ( y === 0 ) && ( ( x % 5 ) === 0 ) // make some of the top vertices' positions fixed
        const vertex = addVerletVertex( posX, clothHeight * 0.5, posZ, isFixed )
        column.push( vertex )

      }

      verletVertexColumns.push( column )

    }

    // create the cloth's verlet springs
    for ( let x = 0; x <= clothNumSegmentsX; x ++ ) {

      for ( let y = 0; y <= clothNumSegmentsY; y ++ ) {

        const vertex0 = verletVertexColumns[ x ][ y ]
        if ( x > 0 ) addVerletSpring( vertex0, verletVertexColumns[ x - 1 ][ y ] )
        if ( y > 0 ) addVerletSpring( vertex0, verletVertexColumns[ x ][ y - 1 ] )
        if ( x > 0 && y > 0 ) addVerletSpring( vertex0, verletVertexColumns[ x - 1 ][ y - 1 ] )
        if ( x > 0 && y < clothNumSegmentsY ) addVerletSpring( vertex0, verletVertexColumns[ x - 1 ][ y + 1 ] )

      }

    }

  }

  private setupCloth() {

    this.setupVerletGeometry()

    const { verletVertices, verletSprings, verletVertexColumns } = this
    const { dampeningUniform, spherePositionUniform, sphereUniform, windUniform, stiffnessUniform } = this

    // setup the buffers holding the vertex data for the compute shaders

    const vertexCount = verletVertices.length

    const springListArray: number[] = []
    // this springListArray will hold a list of spring ids, ordered by the id of the vertex affected by that spring.
    // this is so the compute shader that accumulates the spring forces for each vertex can efficiently iterate over all springs affecting that vertex

    const vertexPositionArray = new Float32Array( vertexCount * 3 )
    const vertexParamsArray = new Uint32Array( vertexCount * 3 )
    // the params Array holds three values for each verlet vertex:
    // x: isFixed, y: springCount, z: springPointer
    // isFixed is 1 if the verlet is marked as immovable, 0 if not
    // springCount is the number of springs connected to that vertex
    // springPointer is the index of the first spring in the springListArray that is connected to that vertex

    for ( let i = 0; i < vertexCount; i ++ ) {

      const vertex = verletVertices[ i ]
      vertexPositionArray[ i * 3 ] = vertex.position.x
      vertexPositionArray[ i * 3 + 1 ] = vertex.position.y
      vertexPositionArray[ i * 3 + 2 ] = vertex.position.z
      vertexParamsArray[ i * 3 ] = vertex.isFixed ? 1 : 0
      if ( ! vertex.isFixed ) {

        vertexParamsArray[ i * 3 + 1 ] = vertex.springIds.length
        vertexParamsArray[ i * 3 + 2 ] = springListArray.length
        springListArray.push( ...vertex.springIds )

      }

    }

    const vertexPositionBuffer = instancedArray( vertexPositionArray, 'vec3' )
    const vertexForceBuffer = instancedArray( vertexCount, 'vec3' )
    const vertexParamsBuffer = instancedArray( vertexParamsArray, 'uvec3' )

    const springListBuffer = instancedArray( new Uint32Array( springListArray ), 'uint' )

    // setup the buffers holding the spring data for the compute shaders

    const springCount = verletSprings.length

    const springVertexIdArray = new Uint32Array( springCount * 2 )
    const springRestLengthArray = new Float32Array( springCount )

    for ( let i = 0; i < springCount; i ++ ) {

      const spring = verletSprings[ i ]
      springVertexIdArray[ i * 2 ] = spring.vertex0.id
      springVertexIdArray[ i * 2 + 1 ] = spring.vertex1.id
      springRestLengthArray[ i ] = spring.vertex0.position.distanceTo( spring.vertex1.position )

    }

    const springVertexIdBuffer = instancedArray( springVertexIdArray, 'uvec2' )
    const springRestLengthBuffer = instancedArray( springRestLengthArray, 'float' )
    const springForceBuffer = instancedArray( springCount * 3, 'vec3' )

    // This sets up the compute shaders for the verlet simulation
    // There are two shaders that are executed for each simulation step

    // 1. computeSpringForces:
    // This shader computes a force for each spring, depending on the distance between the two vertices connected by that spring and the targeted rest length
    this.computeSpringForces = Fn( () => {

      const vertexIds = springVertexIdBuffer.element( instanceIndex )
      const restLength = springRestLengthBuffer.element( instanceIndex )

      const vertex0Position = vertexPositionBuffer.element( vertexIds.x )
      const vertex1Position = vertexPositionBuffer.element( vertexIds.y )

      const delta = vertex1Position.sub( vertex0Position ).toVar()
      const dist = delta.length().max( EPSILON ).toVar()
      const force = dist.sub( restLength ).mul( stiffnessUniform ).mul( delta ).mul( 0.5 ).div( dist )
      springForceBuffer.element( instanceIndex ).assign( force )

    } )().compute( springCount ).setName( 'Spring Forces' )

    // 2. computeVertexForces:
    // This shader accumulates the force for each vertex.
    // First it iterates over all springs connected to this vertex and accumulates their forces.
    // Then it adds a gravital force, wind force, and the collision with the sphere.
    // In the end it adds the force to the vertex' position.
    this.computeVertexForces = Fn( () => {

      const params = vertexParamsBuffer.element( instanceIndex ).toVar()
      const isFixed = params.x
      const springCount = params.y
      const springPointer = params.z

      If( isFixed, () => {

        // don't need to calculate vertex forces if the vertex is set as immovable
        Return()

      } )

      const position = vertexPositionBuffer.element( instanceIndex ).toVar( 'vertexPosition' )
      const force = vertexForceBuffer.element( instanceIndex ).toVar( 'vertexForce' )

      force.mulAssign( dampeningUniform )

      const ptrStart = springPointer.toVar( 'ptrStart' )
      const ptrEnd = ptrStart.add( springCount ).toVar( 'ptrEnd' )

      Loop( { start: ptrStart, end: ptrEnd, type: 'uint', condition: '<' }, ( { i } ) => {

        const springId = springListBuffer.element( i ).toVar( 'springId' )
        const springForce = springForceBuffer.element( springId )
        const springVertexIds = springVertexIdBuffer.element( springId )
        const factor = select( springVertexIds.x.equal( instanceIndex ), 1.0, - 1.0 )
        force.addAssign( springForce.mul( factor ) )

      } )

      // gravity
      force.y.subAssign( 0.00005 )

      // wind
      const noise = triNoise3D( position, 1, this.timeline.timeNode ).sub( 0.2 ).mul( 0.0001 )
      const windForce = noise.mul( windUniform )
      force.z.subAssign( windForce )

      // collision with sphere
      const deltaSphere = position.add( force ).sub( spherePositionUniform )
      const dist = deltaSphere.length()
      const sphereForce = float( sphereRadius ).sub( dist ).max( 0 ).mul( deltaSphere ).div( dist ).mul( sphereUniform )
      force.addAssign( sphereForce )

      vertexForceBuffer.element( instanceIndex ).assign( force )
      vertexPositionBuffer.element( instanceIndex ).addAssign( force )

    } )().compute( vertexCount ).setName( 'Vertex Forces' )

    // adds helpers to visualize the verlet system

    // verlet vertex visualizer
    const vertexWireframeMaterial = new SpriteNodeMaterial()
    vertexWireframeMaterial.positionNode = vertexPositionBuffer.element( instanceIndex )
    this.vertexWireframeObject = new Mesh( new PlaneGeometry( 0.01, 0.01 ), vertexWireframeMaterial )
    this.vertexWireframeObject.name = 'Vertices'
    this.vertexWireframeObject.frustumCulled = false
    this.vertexWireframeObject.count = verletVertices.length
    this.scene.add( this.vertexWireframeObject )

    // verlet spring visualizer
    const springWireframePositionBuffer = new BufferAttribute( new Float32Array( 6 ), 3, false )
    const springWireframeIndexBuffer = new BufferAttribute( new Uint32Array( [ 0, 1 ] ), 1, false )
    const springWireframeMaterial = new LineBasicNodeMaterial()
    springWireframeMaterial.positionNode = Fn( () => {

      const vertexIds = springVertexIdBuffer.element( instanceIndex )
      const vertexId = select( attribute<'uint'>( 'vertexIndex' ).equal( 0 ), vertexIds.x, vertexIds.y )
      return vertexPositionBuffer.element( vertexId )

    } )()

    const springWireframeGeometry = new InstancedBufferGeometry()
    springWireframeGeometry.setAttribute( 'position', springWireframePositionBuffer )
    springWireframeGeometry.setAttribute( 'vertexIndex', springWireframeIndexBuffer )
    springWireframeGeometry.instanceCount = verletSprings.length

    this.springWireframeObject = new Line( springWireframeGeometry, springWireframeMaterial )
    this.springWireframeObject.name = 'Springs'
    this.springWireframeObject.frustumCulled = false
    this.springWireframeObject.count = verletSprings.length
    this.scene.add( this.springWireframeObject )

    // sphere

    this.sphereMesh = new Mesh( new IcosahedronGeometry( sphereRadius * 0.95, 4 ), new MeshStandardNodeMaterial() )
    this.sphereMesh.name = 'Sphere'
    this.scene.add( this.sphereMesh )

    // This generates a three Geometry and Mesh to render the cloth based on the verlet systems position data.
    // Therefore it creates a plane mesh, in which each vertex will be centered in the center of 4 verlet vertices.

    const clothVertexCount = clothNumSegmentsX * clothNumSegmentsY
    const geometry = new BufferGeometry()

    // verletVertexIdArray will hold the 4 verlet vertex ids that contribute to each geometry vertex's position
    const verletVertexIdArray = new Uint32Array( clothVertexCount * 4 )
    const indices: number[] = []

    const getIndex = ( x: number, y: number ) => {

      return y * clothNumSegmentsX + x

    }

    for ( let x = 0; x < clothNumSegmentsX; x ++ ) {

      for ( let y = 0; y < clothNumSegmentsX; y ++ ) {

        const index = getIndex( x, y )
        verletVertexIdArray[ index * 4 ] = verletVertexColumns[ x ][ y ].id
        verletVertexIdArray[ index * 4 + 1 ] = verletVertexColumns[ x + 1 ][ y ].id
        verletVertexIdArray[ index * 4 + 2 ] = verletVertexColumns[ x ][ y + 1 ].id
        verletVertexIdArray[ index * 4 + 3 ] = verletVertexColumns[ x + 1 ][ y + 1 ].id

        if ( x > 0 && y > 0 ) {

          indices.push( getIndex( x, y ), getIndex( x - 1, y ), getIndex( x - 1, y - 1 ) )
          indices.push( getIndex( x, y ), getIndex( x - 1, y - 1 ), getIndex( x, y - 1 ) )

        }

      }

    }

    const verletVertexIdBuffer = new BufferAttribute( verletVertexIdArray, 4, false )
    const positionBuffer = new BufferAttribute( new Float32Array( clothVertexCount * 3 ), 3, false )
    geometry.setAttribute( 'position', positionBuffer )
    geometry.setAttribute( 'vertexIds', verletVertexIdBuffer )
    geometry.setIndex( indices )

    const clothMaterial = new MeshPhysicalNodeMaterial( {
      side: DoubleSide,
      transparent: true,
      opacity: 0.85,
      sheen: 1.0,
      sheenRoughness: 0.5,
    } )

    clothMaterial.positionNode = Fn( () => {

      // gather the position of the 4 verlet vertices and calculate the center position and normal from that
      const vertexIds = attribute<'uvec4'>( 'vertexIds' )
      const v0 = vertexPositionBuffer.element( vertexIds.x ).toVar()
      const v1 = vertexPositionBuffer.element( vertexIds.y ).toVar()
      const v2 = vertexPositionBuffer.element( vertexIds.z ).toVar()
      const v3 = vertexPositionBuffer.element( vertexIds.w ).toVar()

      const top = v0.add( v1 )
      const right = v1.add( v3 )
      const bottom = v2.add( v3 )
      const left = v0.add( v2 )

      const tangent = right.sub( left ).normalize()
      const bitangent = bottom.sub( top ).normalize()

      const normal = cross( tangent, bitangent )

      // send the normalView from the vertex shader to the fragment shader
      clothMaterial.normalNode = transformNormalToView( normal ).toVarying() as Node<'vec3'>

      return v0.add( v1 ).add( v2 ).add( v3 ).mul( 0.25 )

    } )()

    this.clothMesh = new Mesh( geometry, clothMaterial )
    this.clothMesh.name = 'Cloth'
    this.clothMesh.frustumCulled = false
    this.scene.add( this.clothMesh )

  }

  stiffnessChanged() { this.stiffnessUniform.value = this.stiffness }
  windChanged() { this.windUniform.value = this.wind }

  wireframeChanged() { this.updateVisibility() }
  sphereChanged() { this.updateVisibility() }

  private updateVisibility() {
    if ( ! this.clothMesh ) return
    this.sphereMesh.visible = this.sphere
    this.sphereUniform.value = this.sphere ? 1 : 0
    this.clothMesh.visible = ! this.wireframe
    this.vertexWireframeObject.visible = this.wireframe
    this.springWireframeObject.visible = this.wireframe
    this.notify({kind: 'other'})
  }

  colorMutated() { this.updateMaterial() }
  roughnessChanged() { this.updateMaterial() }
  sheenChanged() { this.updateMaterial() }
  sheenRoughnessChanged() { this.updateMaterial() }
  sheenColorMutated() { this.updateMaterial() }

  private updateMaterial() {
    const material = this.clothMesh?.material
    if ( ! material ) return
    material.color.copy( this.color )
    material.roughness = this.roughness
    material.sheen = this.sheen
    material.sheenRoughness = this.sheenRoughness
    material.sheenColor.copy( this.sheenColor )
    this.notify({kind: 'material'})
  }

  /** Framing reads the cloth's unplaced vertices: frame a stand-in for where it hangs. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.updateVisibility()
    const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 0.6, - 0.6, - 0.2 ), new Vector3( 0.6, 0.6, 1.1 ) ] ) )
    this._frameTarget = standIn
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** The sphere's path, from document time (the source's from simulated time). */
  private pose(time: number) {
    this.sphereMesh.position.set( Math.sin( time * 2.1 ) * 0.1, 0, Math.sin( time * 0.8 ) )
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    const timePerStep = 1 / STEPS_PER_SECOND
    let stepTime = ( this.stepTime.get( renderer ) ?? 0 ) + Math.min( delta, MAX_DELTA )
    const steps = Math.floor( stepTime / timePerStep )
    stepTime -= steps * timePerStep
    this.stepTime.set( renderer, stepTime )
    if ( steps === 0 ) return

    // Move the collision sphere toward the shown sphere over the steps.
    const from = this.spherePositionUniform.value.clone()
    for ( let i = 1; i <= steps; i ++ ) {
      this.spherePositionUniform.value.lerpVectors( from, this.sphereMesh.position, i / steps )
      void renderer.compute( this.computeSpringForces )
      void renderer.compute( this.computeVertexForces )
    }
  }
}

registerEditorConfig(ComputeClothExample, [
  ['stiffness', ioNumberSlider({min: 0.1, max: 0.5, step: 0.01})],
  ['wind', ioNumberSlider({min: 0, max: 5, step: 0.1})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['sheen', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['sheenRoughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(ComputeClothExample, {
  Main: ['stiffness', 'wireframe', 'sphere', 'wind', 'color', 'roughness', 'sheen', 'sheenRoughness', 'sheenColor'],
  Hidden: [
    'clothMesh', 'sphereMesh', 'vertexWireframeObject', 'springWireframeObject', 'verletVertices', 'verletSprings',
    'verletVertexColumns', 'dampeningUniform', 'spherePositionUniform', 'sphereUniform', 'windUniform', 'stiffnessUniform',
    'computeSpringForces', 'computeVertexForces', 'stepTime',
  ],
})
