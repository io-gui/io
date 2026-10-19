import {
  AnimationMixer,
  Bone,
  BufferGeometry,
  ComputeNode,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardNodeMaterial,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  ShadowMaterial,
  Skeleton,
  SkinnedMesh,
  StorageBufferAttribute,
  Vector3,
  WebGPURenderer
} from 'three/webgpu'
import { Fn, add, attributeArray, color, instanceIndex, screenUV, storage, transformNormal, transformNormalToView, uint, uniform, vec4, vertexIndex, mat3 } from 'three/tsl'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

function createBoneMatricesNode( boneMatrices: StorageBufferAttribute ) {
  return storage( boneMatrices, 'mat4', boneMatrices.count ).toReadOnly()
}

type SkeletonState = {
  skeleton: Skeleton
  boneCount: number
  boneMatrices: StorageBufferAttribute
  boneMatricesNode: ReturnType<typeof createBoneMatricesNode>
}

type Variation = {
  width: number
  height: number
  depth: number
  belly: number
  headScale: number
  bellyWidth: number
  chestWidth: number
  armLength: number
  legLength: number
  size: number
  x: number
  y: number
}

type ProportionBones = {
  head: Bone
  belly: Bone
  chest: Bone
  arms: Bone[]
  legs: Bone[]
  baseScales: Vector3[]
}

const instanceCount = 30

const bodyTypes = [
  { width: 0.92, height: 1.09, depth: 0.92, belly: 0, headScale: 0.96, bellyWidth: 0.98, chestWidth: 0.98, armLength: 1.03, legLength: 1.04 },
  { width: 1.0, height: 1.05, depth: 0.99, belly: 0, headScale: 0.98, bellyWidth: 1.0, chestWidth: 1.03, armLength: 1.02, legLength: 1.02 },
  { width: 1.0, height: 1.0, depth: 1.0, belly: 0, headScale: 1.0, bellyWidth: 1.0, chestWidth: 1.0, armLength: 1.0, legLength: 1.0 },
  { width: 1.08, height: 0.9, depth: 1.1, belly: 0.75, headScale: 1.06, bellyWidth: 1.12, chestWidth: 1.0, armLength: 0.9, legLength: 0.9 },
  { width: 1.2, height: 0.8, depth: 1.22, belly: 1.6, headScale: 1.12, bellyWidth: 1.24, chestWidth: 1.04, armLength: 0.72, legLength: 0.7 }
]

function createSourceVertexAttribute( geometry: BufferGeometry ) {

  const position = geometry.getAttribute( 'position' )
  const normal = geometry.getAttribute( 'normal' )
  const bellyPosition = position.clone()
  const data = new Float32Array( position.count * 12 )

  for ( let i = 0; i < position.count; i ++ ) {

    const amount = Math.max( 0, 1 - Math.abs( position.getY( i ) - 0.94 ) / 0.3 ) * 0.8

    bellyPosition.setXYZ(
      i,
      position.getX( i ) * amount,
      0,
      position.getZ( i ) * amount
    )

    const offset = i * 12

    data[ offset + 0 ] = position.getX( i )
    data[ offset + 1 ] = position.getY( i )
    data[ offset + 2 ] = position.getZ( i )
    data[ offset + 4 ] = normal.getX( i )
    data[ offset + 5 ] = normal.getY( i )
    data[ offset + 6 ] = normal.getZ( i )
    data[ offset + 8 ] = bellyPosition.getX( i )
    data[ offset + 9 ] = bellyPosition.getY( i )
    data[ offset + 10 ] = bellyPosition.getZ( i )

  }

  return new StorageBufferAttribute( data, 4 )

}

/**
 * Thirty copies of the animated Michelle model in two rings, each with its own body proportions, belly, size and
 * phase of the walk. Each copy's skeleton is posed on the CPU at its own time and its bone matrices go to a storage
 * buffer; a compute pass skins all copies' vertices before the views draw (`onBeforeDraw`), and one mesh draws them as
 * instances. The poses follow document time, so scrubbing shows them exactly. The light is a `DirectionalLight` as at
 * three.js HEAD (r186 used `SunLight`). Duration = the clip. Plays when opened.
 */
@Register
export class SkinningInstancingIndividualExample extends Document {

  public model?: Group
  private mixer?: AnimationMixer
  private referenceMesh?: SkinnedMesh
  private proportionBones?: ProportionBones
  private footBones: Bone[] = []
  private groundFoot = 0
  private dummy = new Object3D()
  private instanceMatrices = new StorageBufferAttribute( instanceCount, 16 )
  private instanceMatricesNode = storage( this.instanceMatrices, 'mat4', instanceCount ).toReadOnly()
  private bellyWeights = new StorageBufferAttribute( instanceCount, 1 )
  private bellyWeightsNode = storage( this.bellyWeights, 'float', instanceCount ).toReadOnly()
  private computeSkinning: ComputeNode[] = []
  private skeletonStates = new Map<Skeleton, SkeletonState>()
  private timeOffsets: number[] = []
  private variations: Variation[] = []
  private leftFoot = new Vector3()
  private rightFoot = new Vector3()

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, toneMappingExposure: 0.96, timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.01, 60 )
    camera.name = 'Camera'
    camera.position.set( 4.6, 3.3, 6.2 )
    camera.lookAt( 0, 0.75, 0 )
    this.activeCamera = camera

    this.scene.backgroundNode = screenUV.y.mix( color( 0x8f989c ), color( 0xe7eaeb ) )

    const hemiLight = new HemisphereLight( 0xffffff, 0x939b9e, 1.2 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    const directionalLight = new DirectionalLight( 0xfffbf4, 2.8 )
    directionalLight.name = 'Key'
    directionalLight.position.set( - 4, 10, 8 )
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set( 2048, 2048 )
    directionalLight.shadow.camera.left = - 5
    directionalLight.shadow.camera.right = 5
    directionalLight.shadow.camera.top = 5
    directionalLight.shadow.camera.bottom = - 5
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 30
    directionalLight.shadow.camera.updateProjectionMatrix()
    this.scene.add( directionalLight )

    const rimLight = new DirectionalLight( 0xe8f4ff, 0.85 )
    rimLight.name = 'Rim'
    rimLight.position.set( 7, 5, - 5 )
    this.scene.add( rimLight )

    const ground = new Mesh(
      new PlaneGeometry( 400, 400 ),
      new ShadowMaterial( { color: 0x5d6568, opacity: 0.3 } )
    )
    ground.name = 'Ground'
    ground.userData.selectable = false
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    this.scene.add( ground )

    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Michelle.glb' )

      const object = gltf.scene
      const clip = gltf.animations[ 0 ]
      const duration = clip.duration
      const skinnedMeshes: SkinnedMesh[] = []

      const mixer = new AnimationMixer( object )
      mixer.clipAction( clip ).play()

      object.traverse( ( child ) => {

        if ( ( child as SkinnedMesh ).isSkinnedMesh === true ) skinnedMeshes.push( child as SkinnedMesh )

      } )

      const referenceMesh = skinnedMeshes[ 0 ]
      const skeleton = referenceMesh.skeleton
      const getBone = ( name: string ) => skeleton.bones.find( ( bone ) => bone.name.endsWith( name ) )!
      const proportionTargets = [
        getBone( 'Head' ), getBone( 'Spine' ), getBone( 'Spine2' ),
        getBone( 'LeftArm' ), getBone( 'RightArm' ),
        getBone( 'LeftForeArm' ), getBone( 'RightForeArm' ),
        getBone( 'LeftUpLeg' ), getBone( 'RightUpLeg' ),
        getBone( 'LeftLeg' ), getBone( 'RightLeg' )
      ]

      this.proportionBones = {
        head: proportionTargets[ 0 ],
        belly: proportionTargets[ 1 ],
        chest: proportionTargets[ 2 ],
        arms: proportionTargets.slice( 3, 7 ),
        legs: proportionTargets.slice( 7 ),
        baseScales: proportionTargets.map( ( bone ) => bone.scale.clone() )
      }
      this.footBones = [ getBone( 'LeftFoot' ), getBone( 'RightFoot' ) ]
      this.referenceMesh = referenceMesh

      for ( let i = 0; i < instanceCount; i ++ ) {

        const bodyType = bodyTypes[ i % bodyTypes.length ]
        const isChild = i % 2 === 0
        const size = isChild ? ( i % 4 === 0 ? 0.68 : 0.78 ) : 1
        const innerRing = i < 10
        const ringIndex = innerRing ? i : i - 10
        const ringCount = innerRing ? 10 : 20
        const angle = ringIndex / ringCount * Math.PI * 2
        const radius = innerRing ? 175 : 340

        this.timeOffsets.push( duration * i / instanceCount )
        this.variations.push( {
          ...bodyType,
          size,
          x: Math.sin( angle ) * radius,
          y: Math.cos( angle ) * radius
        } )
        this.bellyWeights.array[ i ] = bodyType.belly

      }

      this.bellyWeights.needsUpdate = true
      object.updateMatrixWorld( true )
      skeleton.update()
      this.model = object
      this.groundFoot = this.getFootCoordinate()

      for ( const child of skinnedMeshes ) this.createComputedMesh( child, instanceCount )

      object.name = 'Michelle'
      this.scene.add( object )
      this.mixer = mixer
      this.timeline.duration = duration
      this.pose( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      // The one mesh draws thirty copies from one geometry: frame a stand-in for the rings (3.4 m).
      const standIn = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 3.6, 0, - 3.6 ), new Vector3( 3.6, 1.8, 3.6 ) ] ) )
      this._frameTarget = standIn
    } catch ( e ) {
      console.error( e )
    }
  }

  private getSkeletonState( skeleton: Skeleton ): SkeletonState {

    let state = this.skeletonStates.get( skeleton )

    if ( state === undefined ) {

      const boneCount = skeleton.bones.length
      const boneMatrices = new StorageBufferAttribute( instanceCount * boneCount, 16 )

      state = {
        skeleton,
        boneCount,
        boneMatrices,
        boneMatricesNode: createBoneMatricesNode( boneMatrices )
      }

      this.skeletonStates.set( skeleton, state )

    }

    return state

  }

  private createComputedMesh( source: SkinnedMesh, instanceCount: number ) {

    const geometry = source.geometry.clone()
    const material = ( source.material as MeshStandardNodeMaterial ).clone()
    const vertexCount = geometry.getAttribute( 'position' ).count
    const skeletonState = this.getSkeletonState( source.skeleton )
    const { instanceMatricesNode, bellyWeightsNode } = this

    const sourceVertices = storage( createSourceVertexAttribute( geometry ), 'vec4', vertexCount * 3 ).toReadOnly()
    const skinIndices = storage( new StorageBufferAttribute( new Uint32Array( geometry.getAttribute( 'skinIndex' ).array ), 4 ), 'uvec4', vertexCount ).toReadOnly()
    const skinWeights = storage( new StorageBufferAttribute( geometry.getAttribute( 'skinWeight' ).array as Float32Array, 4 ), 'vec4', vertexCount ).toReadOnly()
    const bindMatrix = uniform( source.bindMatrix, 'mat4' )
    const bindMatrixInverse = uniform( source.bindMatrixInverse, 'mat4' )
    const vertices = attributeArray( instanceCount * vertexCount * 2, 'vec4' )

    const computeSkinning = Fn( () => {

      const sourceVertex = instanceIndex.mod( uint( vertexCount ) )
      const meshInstance = instanceIndex.div( uint( vertexCount ) )
      const sourceOffset = sourceVertex.mul( uint( 3 ) )
      const targetOffset = instanceIndex.mul( uint( 2 ) )
      const boneOffset = meshInstance.mul( uint( skeletonState.boneCount ) )
      const skinIndex = skinIndices.element( sourceVertex )
      const skinWeight = skinWeights.element( sourceVertex )
      const morphPosition = sourceVertices.element( sourceOffset ).xyz.add( sourceVertices.element( sourceOffset.add( uint( 2 ) ) ).xyz.mul( bellyWeightsNode.element( meshInstance ) ) )
      const skinVertex = bindMatrix.mul( morphPosition )
      const boneMatX = skeletonState.boneMatricesNode.element( boneOffset.add( skinIndex.x ) )
      const boneMatY = skeletonState.boneMatricesNode.element( boneOffset.add( skinIndex.y ) )
      const boneMatZ = skeletonState.boneMatricesNode.element( boneOffset.add( skinIndex.z ) )
      const boneMatW = skeletonState.boneMatricesNode.element( boneOffset.add( skinIndex.w ) )
      const skinMatrix = add(
        skinWeight.x.mul( boneMatX ),
        skinWeight.y.mul( boneMatY ),
        skinWeight.z.mul( boneMatZ ),
        skinWeight.w.mul( boneMatW )
      )
      const skinPosition = bindMatrixInverse.mul( add(
        boneMatX.mul( skinWeight.x ).mul( skinVertex ),
        boneMatY.mul( skinWeight.y ).mul( skinVertex ),
        boneMatZ.mul( skinWeight.z ).mul( skinVertex ),
        boneMatW.mul( skinWeight.w ).mul( skinVertex )
      ) ).xyz

      const skinMatrix3 = mat3( bindMatrixInverse.mul( skinMatrix ).mul( bindMatrix ) )
      const skinNormal = skinMatrix3.mul( sourceVertices.element( sourceOffset.add( uint( 1 ) ) ).xyz )
      const instanceMatrix = instanceMatricesNode.element( meshInstance )

      vertices.element( targetOffset ).assign( vec4( instanceMatrix.mul( skinPosition ).xyz, 1 ) )
      vertices.element( targetOffset.add( uint( 1 ) ) ).assign( vec4( transformNormal( skinNormal, instanceMatrix ), 0 ) )

    } )().compute( instanceCount * vertexCount ).setName( 'Compute Instanced Skinning' )

    this.computeSkinning.push( computeSkinning )

    const meshVertex = instanceIndex.mul( uint( vertexCount ) ).add( vertexIndex ).mul( uint( 2 ) )

    material.positionNode = vertices.element( meshVertex ).xyz
    material.normalNode = transformNormalToView( vertices.element( meshVertex.add( uint( 1 ) ) ).xyz ).toVarying()

    const mesh = new Mesh( geometry, material )
    mesh.name = source.name + ' Instances'
    mesh.count = instanceCount
    mesh.castShadow = true
    mesh.frustumCulled = false

    source.parent!.add( mesh )
    source.visible = false

  }

  private applyProportions( variation: Variation ) {

    const { head, belly, chest, arms, legs, baseScales } = this.proportionBones!
    const bones = [ head, belly, chest, ...arms, ...legs ]

    for ( let i = 0; i < bones.length; i ++ ) bones[ i ].scale.copy( baseScales[ i ] )

    head.scale.multiplyScalar( variation.headScale )
    belly.scale.x *= variation.bellyWidth
    belly.scale.z *= variation.bellyWidth
    chest.scale.x *= variation.chestWidth
    chest.scale.z *= variation.chestWidth

    for ( const bone of arms ) bone.scale.y *= variation.armLength
    for ( const bone of legs ) bone.scale.y *= variation.legLength

  }

  private getFootCoordinate() {

    const { leftFoot, rightFoot, footBones, referenceMesh } = this

    footBones[ 0 ].getWorldPosition( leftFoot )
    footBones[ 1 ].getWorldPosition( rightFoot )
    referenceMesh!.worldToLocal( leftFoot )
    referenceMesh!.worldToLocal( rightFoot )

    return Math.max( leftFoot.z, rightFoot.z )

  }

  private updateInstanceMatrix( index: number, variation: Variation ) {

    const foot = this.getFootCoordinate()
    const dummy = this.dummy

    dummy.position.set( variation.x, variation.y, this.groundFoot - foot * variation.height * variation.size )
    dummy.scale.set( variation.width, variation.depth, variation.height ).multiplyScalar( variation.size )
    dummy.updateMatrix()
    dummy.matrix.toArray( this.instanceMatrices.array, index * 16 )

  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.scene.environment = new PMREMGenerator( renderer ).fromScene( new RoomEnvironment(), 0.04 ).texture
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** Poses each copy's skeleton at its own time and writes its bone and instance matrices. */
  private pose(time: number) {
    const { mixer, model } = this
    if ( ! mixer || ! model ) return

    for ( let i = 0; i < this.timeOffsets.length; i ++ ) {

      mixer.setTime( time + this.timeOffsets[ i ] )
      this.applyProportions( this.variations[ i ] )
      model.updateMatrixWorld( true )

      for ( const state of this.skeletonStates.values() ) {

        state.skeleton.update()
        ;( state.boneMatrices.array as Float32Array ).set( state.skeleton.boneMatrices!, i * state.boneCount * 16 )

      }

      this.updateInstanceMatrix( i, this.variations[ i ] )

    }

    for ( const state of this.skeletonStates.values() ) state.boneMatrices.needsUpdate = true
    this.instanceMatrices.needsUpdate = true
  }

  /** Skins every copy from the bone matrices `pose` wrote. */
  override onBeforeDraw(renderer: WebGPURenderer) {
    for ( const computeSkinning of this.computeSkinning ) void renderer.compute( computeSkinning )
  }
}

registerEditorGroups(SkinningInstancingIndividualExample, {
  Hidden: [
    'model', 'mixer', 'referenceMesh', 'proportionBones', 'footBones', 'groundFoot', 'dummy', 'instanceMatrices',
    'instanceMatricesNode', 'bellyWeights', 'bellyWeightsNode', 'computeSkinning', 'skeletonStates', 'timeOffsets',
    'variations', 'leftFoot', 'rightFoot',
  ],
})
