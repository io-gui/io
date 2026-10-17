import { ACESFilmicToneMapping, AnimationMixer, EquirectangularReflectionMapping, Group, Material, Mesh, Texture } from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const SAMPLE_ASSETS = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/'

type ModelInfo = { name: string; variants: Record<string, string> }

/**
 * The Khronos sample models, fetched while this module loads: the `asset` dropdown lists them, and editor configs
 * copy their menus when the Document tab first shows, so the names must be known before the class registers.
 */
const MODELS: ModelInfo[] = await fetch( `${SAMPLE_ASSETS}model-index.json` )
  .then( response => response.json() as Promise<ModelInfo[]> )
  .catch( ( e ) => {
    console.error( e )
    return [ { name: 'DamagedHelmet', variants: { 'glTF': 'DamagedHelmet.gltf' } } ]
  } )

/**
 * Any of the Khronos glTF sample models (`asset` dropdown) under an UltraHDR panorama, with all its animations
 * playing. `blurriness` is the background's. The model is framed when it arrives; the source compiles its shaders
 * first (`compileAsync`, which needs the renderer), so here the first frame with it may stall. Animations follow
 * document time: the timeline takes the longest clip's length. Static: the default model has no clips, so play an
 * animated one (Fox) with the timeline transport.
 */
@Register
export class LoaderGltfExample extends Document {

  public model?: Group
  public mixer?: AnimationMixer

  @Property({type: String, value: 'DamagedHelmet'})
  declare asset: string

  @Property({type: Number, value: 0})
  declare blurriness: number

  /** Counts loads, so a slow model does not replace a newer pick. */
  private loads = 0

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    new UltraHDRLoader()
      .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
      .load( 'royal_esplanade_2k.hdr.jpg', ( texture ) => {
        texture.mapping = EquirectangularReflectionMapping
        //texture.minFilter = LinearMipmapLinearFilter;
        //texture.generateMipmaps = true;

        this.scene.background = texture
        this.scene.environment = texture
        this.notify({kind: 'material'})
      } )

    this.assetChanged()
  }

  assetChanged() {
    const modelInfo = MODELS.find( m => m.name === this.asset )
    if ( modelInfo ) void this.loadModel( modelInfo )
  }

  blurrinessChanged() { this.scene.backgroundBlurriness = this.blurriness }

  private async loadModel( modelInfo: ModelInfo ) {
    const variants = modelInfo.variants
    const variant = variants[ 'glTF-Binary' ] || variants[ 'glTF' ]
    const url = `${SAMPLE_ASSETS}${ modelInfo.name }/${ variant.endsWith( '.glb' ) ? 'glTF-Binary' : 'glTF' }/${ variant }`

    this.disposeModel()

    const load = ++ this.loads

    try {
      const gltf = await new GLTFLoader().loadAsync( url )
      if ( load !== this.loads ) return

      this.model = gltf.scene
      this.model.name = modelInfo.name
      this.scene.add( this.model )

      // animations

      if ( gltf.animations.length > 0 ) {
        this.mixer = new AnimationMixer( this.model )

        for ( const animation of gltf.animations ) {
          this.mixer.clipAction( animation ).play()
        }

        this.timeline.duration = Math.max( ...gltf.animations.map( clip => clip.duration ) )
        this.mixer.setTime( this.timeline.currentTime )
      }

      this.notify({kind: 'structure'})
      // Skinned bounds read the bones' world matrices, which nothing has drawn yet.
      this.model.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: this.model}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  private disposeModel() {
    if ( this.model ) {
      this.model.traverse( ( child ) => {
        const mesh = child as Mesh
        if ( mesh.isMesh ) {
          mesh.geometry.dispose()

          const material = mesh.material as Material

          material.dispose()

          for ( const value of Object.values( material ) ) {
            if ( value && ( value as Texture ).isTexture ) {
              ( value as Texture ).dispose()
            }
          }
        }
      } )

      this.scene.remove( this.model )
      this.model = undefined
      this.notify({kind: 'structure'})
    }

    if ( this.mixer ) {
      this.mixer.stopAllAction()
      this.mixer = undefined
    }
  }

  override onAnimate(delta: number, time: number) {
    this.mixer?.setTime( time )
  }
}

registerEditorConfig(LoaderGltfExample, [
  ['asset', ioOptionSelect({model: new Menu({options: MODELS.map( m => m.name )})})],
  ['blurriness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(LoaderGltfExample, {
  Main: ['asset', 'blurriness'],
  Hidden: ['model', 'mixer', 'loads'],
})
