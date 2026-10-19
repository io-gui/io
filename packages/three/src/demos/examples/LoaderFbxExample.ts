import {
  AnimationClip,
  AnimationMixer,
  BufferGeometry,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SkinnedMesh
} from 'three/webgpu'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const ASSETS = [
  'Samba Dancing',
  'morph_test',
  'monkey',
  'monkey_embedded_texture',
  'vCube',
  'archer/ArcherRi01',
  'warrior/Warrior',
  'stanford-bunny',
  'mixamo',
  'RotationTest',
  'exampleWindow',
  'Head_69',
  'morph-translation',
  'ball_anims_asc_2018',
]

const SCALES = new Map( [
  [ 'warrior/Warrior', 100 ],
  [ 'archer/ArcherRi01', 100 ],
  [ 'stanford-bunny', 0.001 ],
  [ 'Head_69', 100 ],
  [ 'ball_anims_asc_2018', 50 ],
] )

/**
 * FBX test files on a floor, picked with `asset` (Document tab). An animated file plays its first clip; `clips` has a
 * button per clip and `morphs` a slider per morph target. The timeline takes the playing clip's length. Plays when
 * opened.
 */
@Register
export class LoaderFbxExample extends Document {

  public model?: Group
  public mixer?: AnimationMixer

  @Property({type: String, value: 'Samba Dancing'})
  declare asset: string

  /** A button per animation clip of the model: plays that clip alone. */
  @Property({type: Object, init: null})
  declare clips: Record<string, () => void>

  /** The model's morph target influences, by target name. */
  @Property({type: Object, init: null})
  declare morphs: Record<string, number>

  private loader: FBXLoader
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 1, 2000 )
    camera.name = 'Camera'
    camera.position.set( 100, 200, 300 )
    camera.lookAt( 0, 100, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xa0a0a0 )
    this.scene.fog = new Fog( 0xa0a0a0, 200, 1000 )

    const hemiLight = new HemisphereLight( 0xffffff, 0x444444, 5 )
    hemiLight.name = 'Hemisphere'
    hemiLight.position.set( 0, 200, 0 )
    this.scene.add( hemiLight )

    // r186 used a SunLight; later sources went back to this DirectionalLight.
    const dirLight = new DirectionalLight( 0xffffff, 5 )
    dirLight.name = 'Key'
    dirLight.position.set( 0, 200, 100 )
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 180
    dirLight.shadow.camera.bottom = - 100
    dirLight.shadow.camera.left = - 120
    dirLight.shadow.camera.right = 120
    this.scene.add( dirLight )

    // ground

    const ground = new Mesh( new PlaneGeometry( 2000, 2000 ), new MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    // Embedded and referenced textures arrive after the model: report them when they do.
    this.loader = new FBXLoader( new LoadingManager( () => this.notify({kind: 'material'}) ) )

    this.assetChanged()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  assetChanged() {
    if ( ! this.loader ) return
    void this.loadAsset( this.asset )
  }

  /** A slider moved: a mesh's influences changed in place. */
  morphsMutated() {
    this.notify({kind: 'geometry'})
  }

  private async loadAsset(asset: string) {
    const load = ++ this.loads
    this.loader.trimAnimationClips = ( asset === 'ball_anims_asc_2018' )

    try {
      const object = await this.loader.loadAsync( 'https://threejs.org/examples/models/fbx/' + asset + '.fbx' )
      if ( load !== this.loads ) return

      this.disposeModel()

      this.model = object
      this.model.name = asset
      this.model.scale.setScalar( SCALES.get( asset ) || 1 )

      const clips = object.animations
      this.mixer = clips.length ? new AnimationMixer( object ) : undefined
      this.clips = Object.fromEntries( clips.map( clip => [ clip.name, () => this.playClip( clip ) ] ) )
      if ( clips.length ) this.playClip( clips[ 0 ] )

      const morphs: Record<string, number> = {}

      object.traverse( ( child ) => {
        const mesh = child as Mesh
        if ( ! mesh.isMesh ) return
        mesh.castShadow = true
        mesh.receiveShadow = true
        if ( ! mesh.morphTargetDictionary || ! mesh.morphTargetInfluences ) return
        const influences = mesh.morphTargetInfluences
        for ( const [ key, index ] of Object.entries( mesh.morphTargetDictionary ) ) {
          const name = key in morphs ? `${mesh.name || mesh.uuid}.${key}` : key
          Object.defineProperty( morphs, name, {
            get: () => influences[ index ],
            set: ( value: number ) => { influences[ index ] = value },
            enumerable: true,
          } )
        }
      } )

      this.morphs = morphs
      this.scene.add( object )

      this.notify({kind: 'structure'})
      // Skinned bounds read the bones' world matrices, which nothing has drawn yet.
      object.updateMatrixWorld( true )
      this._frameTarget = object
    } catch ( e ) {
      console.error( e )
    }
  }

  private playClip(clip: AnimationClip) {
    if ( ! this.mixer ) return
    this.mixer.stopAllAction()
    this.mixer.clipAction( clip ).play()
    this.timeline.duration = clip.duration
    this.mixer.setTime( this.timeline.currentTime )
    this.notify({kind: 'transform'})
  }

  private disposeModel() {
    if ( ! this.model ) return
    this.model.traverse( ( child ) => {
      const skinned = child as SkinnedMesh
      if ( skinned.isSkinnedMesh ) skinned.skeleton.dispose()
      const mesh = child as Mesh<BufferGeometry, MeshPhongMaterial | MeshPhongMaterial[]>
      if ( mesh.material ) {
        const materials = Array.isArray( mesh.material ) ? mesh.material : [ mesh.material ]
        materials.forEach( material => {
          if ( material.map ) material.map.dispose()
          material.dispose()
        } )
      }
      if ( mesh.geometry ) mesh.geometry.dispose()
    } )
    this.scene.remove( this.model )
    this.model = undefined
    this.mixer = undefined
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}

registerEditorConfig(LoaderFbxExample, [
  ['asset', ioOptionSelect({model: new Menu({options: ASSETS})})],
  ['morphs', ioObject({expanded: true, labelWidth: '120px', config: [[Number, ioNumberSlider({min: 0, max: 1, step: 0.01})]]})],
  ['clips', ioObject({expanded: true})],
])

registerEditorGroups(LoaderFbxExample, {
  Main: ['asset', 'clips', 'morphs'],
  Hidden: ['model', 'mixer', 'loader', 'loads'],
})
