import {
  ACESFilmicToneMapping,
  AmbientLight,
  BatchedMesh,
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  MeshPhongNodeMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { mx_fractal_noise_vec3, positionWorld, Fn, color } from 'three/tsl'
import { TileShadowNode } from 'three/addons/tsl/shadows/TileShadowNode.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * Seconds in which the motion repeats: the timeline length, so looping is seamless. The sun circles at 0.1 rad/s and
 * the knot turns at 0.25, 0.5 and 1 rad/s.
 */
const PERIOD = 40 * Math.PI

/**
 * A park of instanced and batched shapes under a circling sun whose 4096² shadow map is split into a 2×2 array of
 * tiles (`TileShadowNode`), each with its own shadow camera. The source's `BasicShadowMap` is a renderer setting:
 * the shared renderer filters with PCF. The tile helper is dropped (the light helpers overlay draws the light). The
 * views frame the shapes (1500-unit ground). Plays when opened.
 */
@Register
export class ShadowmapArrayExample extends Document {

  public dirLight: DirectionalLight
  public torusKnot!: Mesh
  public content: Object3D[] = []

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.2, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 45, 60, 100 )
    camera.lookAt( 0, 5, 0 )
    this.activeCamera = camera

    this.scene.backgroundNode = color( 0xCCCCFF ) // Brighter blue sky
    this.scene.fog = new Fog( 0xCCCCFF, 700, 1000 )

    // Enhanced lighting for a brighter scene
    const ambient = new AmbientLight( 0xCCCCFF, 3 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    // Main directional light (sun)
    this.dirLight = new DirectionalLight( 0xFFFFAA, 5 )
    this.dirLight.name = 'Sun'
    this.dirLight.position.set( 0, 80, 30 )
    this.dirLight.castShadow = true
    this.dirLight.shadow.camera.near = 1
    this.dirLight.shadow.camera.far = 200
    this.dirLight.shadow.camera.right = 180
    this.dirLight.shadow.camera.left = - 180
    this.dirLight.shadow.camera.top = 180
    this.dirLight.shadow.camera.bottom = - 160
    this.dirLight.shadow.mapSize.width = 1024 * 4
    this.dirLight.shadow.mapSize.height = 1024 * 4
    this.dirLight.shadow.radius = 1

    // Set up the tile shadow mapping
    const tsm = new TileShadowNode( this.dirLight, {
      tilesX: 2,
      tilesY: 2
    } )

    this.dirLight.shadow.shadowNode = tsm

    const dirGroup = new Group()
    dirGroup.name = 'SunGroup'
    dirGroup.add( this.dirLight )
    this.scene.add( dirGroup )

    // Create the ground with enhanced texture
    const planeGeometry = new PlaneGeometry( 1500, 1500, 2, 2 )
    const planeMaterial = new MeshPhongNodeMaterial( {
      color: 0x88AA44,
      shininess: 5,
      specular: 0x222222
    } )

    planeMaterial.colorNode = Fn( () => {
      const noise = mx_fractal_noise_vec3( positionWorld.mul( 0.05 ) ).saturate()
      // Mix of greens and browns for a more natural ground
      const green = color( 0.4, 0.7, 0.3 )
      const brown = color( 0.6, 0.5, 0.3 )
      return noise.x.mix( green, brown )
    } )()

    const ground = new Mesh( planeGeometry, planeMaterial )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    // Spread various objects across the scene
    this.createScenery()

    this.pose( this.timeline.currentTime )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  /** The 1500-unit ground would dominate whole-scene framing: frame the shapes once the document is on screen. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this._frameTarget = this.content
  }

  private add( object: Object3D, name: string ) {
    object.name = name
    this.scene.add( object )
    this.content.push( object )
  }

  private createScenery() {
    // 1. Columns using instanced mesh
    const columnGeometry = new CylinderGeometry( 0.8, 1, 1, 16 )
    const columnMaterial = new MeshPhongMaterial( {
      color: 0xDDDDDD,
      shininess: 20
    } )

    const columnPositions = []
    const columnScales = []
    for ( let x = - 100; x <= 100; x += 40 ) {
      for ( let z = - 100; z <= 100; z += 40 ) {
        if ( Math.random() > 0.3 ) {
          const height = 5 + Math.random() * 10
          const posX = x + ( Math.random() * 10 - 5 )
          const posY = height / 2
          const posZ = z + ( Math.random() * 10 - 5 )

          columnPositions.push( posX, posY, posZ )
          columnScales.push( 1, height, 1 ) // Only scale Y to match height
        }
      }
    }

    const columnCount = columnPositions.length / 3
    const columnInstancedMesh = new InstancedMesh(
      columnGeometry,
      columnMaterial,
      columnCount
    )

    const matrix = new Matrix4()
    for ( let i = 0; i < columnCount; i ++ ) {
      const x = columnPositions[ i * 3 ]
      const y = columnPositions[ i * 3 + 1 ]
      const z = columnPositions[ i * 3 + 2 ]
      const scaleY = columnScales[ i * 3 + 1 ]

      matrix.makeScale( 1, scaleY, 1 )
      matrix.setPosition( x, y, z )
      columnInstancedMesh.setMatrixAt( i, matrix )
    }

    columnInstancedMesh.castShadow = true
    columnInstancedMesh.receiveShadow = true
    this.add( columnInstancedMesh, 'Columns' )

    // 2. Add a central feature - the torus knot (kept as regular mesh for animation)
    const torusKnotGeometry = new TorusKnotGeometry( 25, 8, 100, 30 )
    const torusKnotMaterial = new MeshPhongNodeMaterial( {
      color: 0xFF6347, // Tomato color
      shininess: 30,
    } )

    this.torusKnot = new Mesh( torusKnotGeometry, torusKnotMaterial )
    this.torusKnot.scale.multiplyScalar( 1 / 18 )
    this.torusKnot.position.x = 5
    this.torusKnot.position.y = 5
    this.torusKnot.castShadow = true
    this.torusKnot.receiveShadow = true
    this.add( this.torusKnot, 'TorusKnot' )

    // 3. Cubes using instanced mesh
    const cubeGeometry = new BoxGeometry( 3, 3, 3 )
    const cubeMaterials = [
      new MeshPhongMaterial( { color: 0x6699CC, shininess: 20 } ),
      new MeshPhongMaterial( { color: 0xCC6666, shininess: 20 } ),
      new MeshPhongMaterial( { color: 0xCCCC66, shininess: 20 } )
    ]

    const cubeCount = 10
    const cubeInstances = cubeMaterials.map( material => {
      return new InstancedMesh( cubeGeometry, material, cubeCount )
    } )

    for ( let i = 0; i < 30; i ++ ) {
      const materialIndex = i % 3
      const instanceIndex = Math.floor( i / 3 )

      const x = Math.random() * 300 - 150
      const y = 1.5
      const z = Math.random() * 300 - 150

      const rotY = Math.random() * Math.PI * 2
      matrix.makeRotationY( rotY )
      matrix.setPosition( x, y, z )

      cubeInstances[ materialIndex ].setMatrixAt( instanceIndex, matrix )
    }

    cubeInstances.forEach( ( instance, i ) => {
      instance.castShadow = true
      instance.receiveShadow = true
      this.add( instance, `Cubes${ i + 1 }` )
    } )

    // 4. Spheres using instanced mesh
    const sphereGeometry = new SphereGeometry( 2, 32, 32 )
    const sphereMaterial = new MeshPhongMaterial( {
      color: 0x88CCAA,
      shininess: 40
    } )

    const sphereCount = 25
    const sphereInstancedMesh = new InstancedMesh(
      sphereGeometry,
      sphereMaterial,
      sphereCount
    )

    for ( let i = 0; i < sphereCount; i ++ ) {
      const x = Math.random() * 180 - 90
      const y = 2
      const z = Math.random() * 180 - 90

      matrix.makeScale( 1, 1, 1 )
      matrix.setPosition( x, y, z )
      sphereInstancedMesh.setMatrixAt( i, matrix )
    }

    sphereInstancedMesh.castShadow = true
    sphereInstancedMesh.receiveShadow = true
    this.add( sphereInstancedMesh, 'Spheres' )

    // 5. Trees using instanced mesh for trunks and tops separately
    const trunkGeometry = new CylinderGeometry( 0.5, 0.5, 2, 8 )
    const topGeometry = new ConeGeometry( 2, 8, 8 )
    const treeMaterial = new MeshPhongMaterial( {
      vertexColors: true,
      shininess: 5
    } )

    const treeCount = 40
    const totalInstanceCount = treeCount * 2

    const trunkVertexCount = trunkGeometry.attributes.position.count
    const trunkIndexCount = trunkGeometry.index ? trunkGeometry.index.count : 0
    const topVertexCount = topGeometry.attributes.position.count
    const topIndexCount = topGeometry.index ? topGeometry.index.count : 0

    const totalVertexCount = ( trunkVertexCount + topVertexCount ) * 2 // Multiple for safety
    const totalIndexCount = ( trunkIndexCount + topIndexCount ) * 2

    const treeBatchedMesh = new BatchedMesh( totalInstanceCount, totalVertexCount, totalIndexCount, treeMaterial )
    treeBatchedMesh.castShadow = true
    treeBatchedMesh.perObjectFrustumCulled = false

    const trunkGeometryId = treeBatchedMesh.addGeometry( trunkGeometry )
    const topGeometryId = treeBatchedMesh.addGeometry( topGeometry )

    const trunkColor = new Color( 0x8B4513 )
    const topColor = new Color( 0x336633 )

    for ( let i = 0; i < treeCount; i ++ ) {
      const x = Math.random() * 300 - 150
      const z = Math.random() * 300 - 150

      const trunkId = treeBatchedMesh.addInstance( trunkGeometryId )
      matrix.makeScale( 1, 1, 1 )
      matrix.setPosition( x, 1, z )
      treeBatchedMesh.setMatrixAt( trunkId, matrix )
      treeBatchedMesh.setColorAt( trunkId, trunkColor )

      const topId = treeBatchedMesh.addInstance( topGeometryId )
      matrix.makeScale( 1, 1, 1 )
      matrix.setPosition( x, 6, z )
      treeBatchedMesh.setMatrixAt( topId, matrix )
      treeBatchedMesh.setColorAt( topId, topColor )
    }

    this.add( treeBatchedMesh, 'Trees' )

    // 6. Torus shapes using instanced mesh
    const torusGeometry = new TorusGeometry( 3, 1, 16, 50 )
    const torusMaterial = new MeshPhongMaterial( {
      color: 0xFF99CC,
      shininess: 30
    } )

    const torusCount = 15
    const torusInstancedMesh = new InstancedMesh(
      torusGeometry,
      torusMaterial,
      torusCount
    )

    for ( let i = 0; i < torusCount; i ++ ) {
      const x = Math.random() * 320 - 160
      const y = 2
      const z = Math.random() * 320 - 160

      const rotZ = Math.random() * Math.PI * 2

      // Apply rotation (PI/2 on X-axis and random on Z-axis)
      matrix.makeRotationX( Math.PI / 2 )
      const rotMatrix = new Matrix4().makeRotationZ( rotZ )
      matrix.multiply( rotMatrix )
      matrix.setPosition( x, y, z )

      torusInstancedMesh.setMatrixAt( i, matrix )
    }

    torusInstancedMesh.castShadow = true
    torusInstancedMesh.receiveShadow = true
    this.add( torusInstancedMesh, 'Tori' )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    // Rotate the central torus knot
    this.torusKnot.rotation.x = 0.25 * time
    this.torusKnot.rotation.y = 0.5 * time
    this.torusKnot.rotation.z = 1 * time

    this.dirLight.position.x = Math.sin( time * 0.1 ) * 30
    this.dirLight.position.z = Math.cos( time * 0.1 ) * 30
  }
}

registerEditorGroups(ShadowmapArrayExample, {
  Hidden: ['dirLight', 'torusKnot', 'content'],
})
