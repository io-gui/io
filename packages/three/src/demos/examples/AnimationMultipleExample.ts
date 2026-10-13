import {
  AnimationClip,
  AnimationMixer,
  Color,
  DetachedBindMode,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  SkinnedMesh
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds of playback: ten cycles of the run clip (0.7 s), so the run loops seamlessly; idle and walk jump at the wrap. */
const DURATION = 7

/**
 * Three soldiers from one glTF. By default each is a `SkeletonUtils` clone with its own skeleton and mixer (idle,
 * run, walk); `sharedSkeleton` (Document tab) binds three copies of the mesh to one skeleton that runs. Plays when
 * opened.
 */
@Register
export class AnimationMultipleExample extends Document {

  public soldiers: Group
  public mixers: AnimationMixer[] = []
  private model?: Object3D
  private animations: AnimationClip[] = []

  @Property({type: Boolean, value: false})
  declare sharedSkeleton: boolean

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    this.scene.background = new Color( 0xa0a0a0 )
    this.scene.fog = new Fog( 0xa0a0a0, 10, 50 )

    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 )
    hemiLight.name = 'Hemisphere'
    hemiLight.position.set( 0, 20, 0 )
    this.scene.add( hemiLight )

    // r186 used a SunLight; later sources went back to this DirectionalLight.
    const dirLight = new DirectionalLight( 0xffffff, 3 )
    dirLight.name = 'Key'
    dirLight.position.set( - 3, 10, - 10 )
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 4
    dirLight.shadow.camera.bottom = - 4
    dirLight.shadow.camera.left = - 4
    dirLight.shadow.camera.right = 4
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 40
    this.scene.add( dirLight )

    // ground

    const ground = new Mesh( new PlaneGeometry( 200, 200 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    this.soldiers = new Group()
    this.soldiers.name = 'Soldiers'
    this.scene.add( this.soldiers )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Soldier.glb' )

      this.model = gltf.scene
      this.animations = gltf.animations

      this.model.traverse( ( object ) => {
        if ( ( object as Mesh ).isMesh ) object.castShadow = true
      } )

      this.setupScene()
      // Skinned bounds read the bones' world matrices, which nothing has drawn yet.
      this.soldiers.updateMatrixWorld( true )
      // The soldiers, not the scene: the ground spans 200 units.
      this.dispatch('frame-object', {object: this.soldiers}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  sharedSkeletonChanged() {
    this.setupScene()
  }

  private setupScene() {
    if ( ! this.model ) return

    this.clearScene()

    if ( this.sharedSkeleton ) {
      this.setupSharedSkeletonScene( this.model )
    } else {
      this.setupDefaultScene( this.model )
    }

    for ( const mixer of this.mixers ) mixer.setTime( this.timeline.currentTime )

    this.notify({kind: 'structure'})
  }

  private clearScene() {
    for ( const mixer of this.mixers ) {
      mixer.stopAllAction()
    }

    this.mixers = []

    this.soldiers.traverse( ( child ) => {
      if ( ( child as SkinnedMesh ).isSkinnedMesh ) ( child as SkinnedMesh ).skeleton.dispose()
    } )

    this.soldiers.clear()
  }

  private setupDefaultScene(model: Object3D) {
    // three cloned models with independent skeletons.
    // each model can have its own animation state

    const model1 = SkeletonUtils.clone( model )
    const model2 = SkeletonUtils.clone( model )
    const model3 = SkeletonUtils.clone( model )

    model1.name = 'Idle'
    model2.name = 'Run'
    model3.name = 'Walk'

    model1.position.x = - 2
    model2.position.x = 0
    model3.position.x = 2

    const mixer1 = new AnimationMixer( model1 )
    const mixer2 = new AnimationMixer( model2 )
    const mixer3 = new AnimationMixer( model3 )

    mixer1.clipAction( this.animations[ 0 ] ).play() // idle
    mixer2.clipAction( this.animations[ 1 ] ).play() // run
    mixer3.clipAction( this.animations[ 3 ] ).play() // walk

    this.soldiers.add( model1, model2, model3 )
    this.mixers.push( mixer1, mixer2, mixer3 )
  }

  private setupSharedSkeletonScene(model: Object3D) {
    // three cloned models with a single shared skeleton.
    // all models share the same animation state

    const sharedModel = SkeletonUtils.clone( model )
    const shareSkinnedMesh = sharedModel.getObjectByName( 'vanguard_Mesh' ) as SkinnedMesh
    const sharedSkeleton = shareSkinnedMesh.skeleton
    const sharedParentBone = sharedModel.getObjectByName( 'mixamorigHips' )!

    // The source puts the bones at the scene root and the glTF asset's transform (scale 0.01, -90° about x) on each
    // mesh. Here the bones keep that transform, so the skeleton overlay draws them at the soldiers' size.
    const skeleton = new Group()
    skeleton.name = 'Skeleton'
    skeleton.scale.setScalar( 0.01 )
    skeleton.rotation.x = - Math.PI * 0.5
    skeleton.add( sharedParentBone ) // the bones need to be in the scene for the animation to work

    const model1 = shareSkinnedMesh.clone()
    const model2 = shareSkinnedMesh.clone()
    const model3 = shareSkinnedMesh.clone()

    model1.name = 'Soldier 1'
    model2.name = 'Soldier 2'
    model3.name = 'Soldier 3'

    model1.bindMode = DetachedBindMode
    model2.bindMode = DetachedBindMode
    model3.bindMode = DetachedBindMode

    const identity = new Matrix4()

    model1.bind( sharedSkeleton, identity )
    model2.bind( sharedSkeleton, identity )
    model3.bind( sharedSkeleton, identity )

    model1.position.x = - 2
    model2.position.x = 0
    model3.position.x = 2

    //

    const mixer = new AnimationMixer( sharedParentBone )
    mixer.clipAction( this.animations[ 1 ] ).play()

    this.soldiers.add( skeleton, model1, model2, model3 )
    this.mixers.push( mixer )
  }

  override onAnimate(delta: number) {
    for ( const mixer of this.mixers ) mixer.update( delta )
  }
}

registerEditorGroups(AnimationMultipleExample, {
  Main: ['sharedSkeleton'],
  Hidden: ['mixers', 'soldiers'],
})
