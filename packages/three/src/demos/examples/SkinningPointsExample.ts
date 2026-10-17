import {
  AmbientLight,
  AnimationMixer,
  Box3,
  ComputeNode,
  Color,
  InstancedMesh,
  PerspectiveCamera,
  Node,
  PlaneGeometry,
  PointsNodeMaterial,
  SkinnedMesh,
  Sphere,
  WebGPURenderer
} from 'three/webgpu'
import { color, mix, computeSkinning, objectWorldMatrix, instancedArray, instanceIndex, Fn, shapeCircle } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/**
 * The skinned, animated Michelle model drawn as points: a compute pass in the points' `positionNode` skins every vertex
 * into a storage buffer once per frame, and the points are colored and sized by how far they moved since the previous
 * frame. The skinned mesh is hidden. The points are an `InstancedMesh` of quads with the model's bounds, so framing
 * and culling see them (the source draws a `Sprite` with `count`). The model lies on the ground: the source camera,
 * looking down, is kept as `Camera`. The compute passes are built once outside the views' draws (`buildComputes`).
 * Duration = the clip. Plays when opened.
 */
@Register
export class SkinningPointsExample extends Document {

  public mixer?: AnimationMixer
  private renderer?: WebGPURenderer
  /** The points' compute passes, until they are built. */
  private pendingComputes: ComputeNode[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    this.scene.background = new Color( 0x111111 )

    const ambient = new AmbientLight( 0xffffff, 10 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    // The model lies on the ground; the source looks down at it.
    const camera = new PerspectiveCamera( 50, 1, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 300, - 85 )
    camera.lookAt( 0, 0, - 85 )
    this.scene.add( camera )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Michelle.glb' )
      const object = gltf.scene

      this.timeline.duration = gltf.animations[ 0 ].duration
      this.mixer = new AnimationMixer( object )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()
      this.mixer.setTime( this.timeline.currentTime )

      object.scale.set( 100, 100, 100 )
      object.rotation.x = - Math.PI / 2
      object.updateMatrixWorld( true )

      const pointClouds: InstancedMesh[] = []

      object.traverse( ( node ) => {
        if ( ! ( node as SkinnedMesh ).isMesh ) return
        const child = node as SkinnedMesh

        child.visible = false

        const countOfPoints = child.geometry.getAttribute( 'position' ).count

        const pointPositionArray = instancedArray( countOfPoints, 'vec3' ).setPBO( true )
        const pointSpeedArray = instancedArray( countOfPoints, 'vec3' ).setPBO( true )

        const pointSpeedAttribute = pointSpeedArray.toAttribute()
        // @types/three 0.186 types `computeSkinning` as returning nothing.
        const skinningPosition = computeSkinning( child ) as unknown as Node<'vec3'>

        const materialPoints = new PointsNodeMaterial()
        materialPoints.colorNode = mix( color( 0x0066ff ), color( 0xff9000 ), pointSpeedAttribute.mul( .6 ) )
        materialPoints.opacityNode = shapeCircle()
        materialPoints.sizeNode = pointSpeedAttribute.length().exp().min( 5 ).mul( 5 ).add( 1 )
        materialPoints.sizeAttenuation = false
        materialPoints.alphaTest = 0.5

        const updateSkinningPoints = Fn( () => {
          const pointPosition = pointPositionArray.element( instanceIndex )
          const pointSpeed = pointSpeedArray.element( instanceIndex )

          const skinningWorldPosition = objectWorldMatrix( child ).mul( skinningPosition ).xyz

          const skinningSpeed = skinningWorldPosition.sub( pointPosition )

          pointSpeed.assign( skinningSpeed )
          pointPosition.assign( skinningWorldPosition )
        }, 'void' )

        const positionCompute = Fn( () => {
          updateSkinningPoints()

          return pointPositionArray.toAttribute()
        } )().compute( countOfPoints ).onInit( ( { renderer } ) => {
          // initialize point positions and speeds
          void renderer.compute( updateSkinningPoints().compute( countOfPoints ) )
        } )

        materialPoints.positionNode = positionCompute
        this.pendingComputes.push( positionCompute )

        const pointCloud = new InstancedMesh( new PlaneGeometry( 1, 1 ), materialPoints, countOfPoints )
        pointCloud.name = 'Points'
        // The points are in world space: the model's bounds, with room for the dance.
        pointCloud.boundingBox = new Box3().setFromObject( child ).expandByScalar( 50 )
        pointCloud.boundingSphere = pointCloud.boundingBox.getBoundingSphere( new Sphere() )
        this.scene.add( pointCloud )
        pointClouds.push( pointCloud )
      } )

      object.name = 'Michelle'
      this.scene.add( object )
      this.buildComputes()

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: pointClouds}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.renderer = renderer
    this.buildComputes()
  }

  /**
   * Runs the compute passes once outside any view's draw, which builds and caches their pipelines. Built inside a TRAA
   * view's pass, the skinning reads the pass's velocity output and refers to `positionPrevious`, which compute shaders
   * do not have.
   */
  private buildComputes() {
    if ( ! this.renderer ) return
    for ( const node of this.pendingComputes ) void this.renderer.compute( node )
    this.pendingComputes.length = 0
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}

registerEditorGroups(SkinningPointsExample, {
  Hidden: ['mixer', 'renderer', 'pendingComputes'],
})
