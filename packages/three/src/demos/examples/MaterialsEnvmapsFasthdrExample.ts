import {
  ACESFilmicToneMapping,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  SphereGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/**
 * The prefiltered cubemaps the source loads from `textures/pmrem/` came with r187's cube-based PMREM (#34585) and are
 * not on threejs.org before that release.
 */
const PMREM_PATH = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/pmrem/'

const IMAGES = [
  {id: 'ballroom', value: 'ballroom'},
  {id: 'brown photostudio', value: 'brown_photostudio_02'},
  {id: 'cape hill', value: 'cape_hill'},
  {id: 'cannon', value: 'cannon'},
  {id: 'metro noord', value: 'metro_noord'},
  {id: 'the sky is on fire', value: 'the_sky_is_on_fire'},
  {id: 'studio small 09', value: 'studio_small_09'},
  {id: 'wide street 01', value: 'wide_street_01'},
]

/**
 * Five spheres (glass with `transmission`, rough and polished dielectrics and metals, a green plastic) lit by FastHDR
 * prefiltered cubemaps (KTX2, UASTC HDR), which need no PMREM pass: `texture.isPMREMTexture` makes a loaded cubemap the
 * environment and background directly. `image` picks the environment, `fov` sets the active camera's,
 * `blurriness` the background's; exposure is in Rendering. The cubemaps load in `onRendererInitialized`
 * (`KTX2Loader.detectSupport`). The source at r186 loaded CubeUV atlases instead.
 */
@Register
export class MaterialsEnvmapsFasthdrExample extends Document {

  @Property({type: String, value: 'ballroom'})
  declare image: string

  @Property({type: Number, value: 40})
  declare fov: number

  @Property({type: Number, value: 0})
  declare blurriness: number

  private camera: PerspectiveCamera
  private renderer: WebGPURenderer | null = null
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    this.camera = new PerspectiveCamera( this.fov, 400 / 250, .1, 50 )
    this.camera.name = 'Camera'
    this.camera.position.set( 7, 0, 0 )
    this.camera.lookAt( 0, 0, 0 )
    this.activeCamera = this.camera

    //

    const sphereGeometry = new SphereGeometry( 0.45, 64, 32 )

    const sphere01 = new Mesh( sphereGeometry, new MeshPhysicalMaterial( {
      transmission: 1.0,
      thickness: 2.0,
      metalness: 0.0,
      roughness: 0.0,
    } ) )
    sphere01.name = 'Glass'
    sphere01.position.z += 2
    this.scene.add( sphere01 )

    const sphere02 = new Mesh( sphereGeometry, new MeshStandardMaterial( {
      metalness: 0.0,
      roughness: 1.0,
    } ) )
    sphere02.name = 'Rough'
    sphere02.position.z += 1
    this.scene.add( sphere02 )

    const sphere03 = new Mesh( sphereGeometry, new MeshStandardMaterial( {
      metalness: 1.0,
      roughness: 0.0,
    } ) )
    sphere03.name = 'Chrome'
    this.scene.add( sphere03 )

    const sphere04 = new Mesh( sphereGeometry, new MeshStandardMaterial( {
      metalness: 1.0,
      roughness: 0.5,
      color: 0x888888
    } ) )
    sphere04.name = 'Brushed Metal'
    sphere04.position.z -= 1
    this.scene.add( sphere04 )

    const sphere05 = new Mesh( sphereGeometry, new MeshStandardMaterial( {
      metalness: 0.0,
      roughness: 0.0,
      color: 0x6ab440
    } ) )
    sphere05.name = 'Plastic'
    sphere05.position.z -= 2
    this.scene.add( sphere05 )
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    if ( this.renderer ) return
    this.renderer = renderer
    void this.loadTexture( this.image )
  }

  imageChanged() {
    if ( this.renderer ) void this.loadTexture( this.image )
  }

  fovChanged() {
    if ( ! this.camera ) return
    this.camera.fov = this.fov
    this.camera.updateProjectionMatrix()
  }

  blurrinessChanged() {
    this.scene.backgroundBlurriness = this.blurriness
  }

  private async loadTexture( name: string ) {
    const load = ++ this.loads

    const loader = new KTX2Loader()
      .setPath( PMREM_PATH )
      .detectSupport( this.renderer! )

    try {
      const texture = await loader.loadAsync( `${ name }_2k.pmrem.ktx2` )

      if ( load !== this.loads ) {
        texture.dispose()
        return
      }

      // `Texture.isPMREMTexture` is r187; not in @types/three 0.186.
      const pmremTexture = texture as unknown as { isPMREMTexture: boolean }
      pmremTexture.isPMREMTexture = true

      if ( this.scene.environment ) this.scene.environment.dispose()

      this.scene.environment = texture
      this.scene.background = texture

      this.notify({kind: 'other'})
    } catch ( e ) {
      console.error( e )
    } finally {
      loader.dispose()
    }
  }
}

registerEditorConfig(MaterialsEnvmapsFasthdrExample, [
  ['image', ioOptionSelect({model: new Menu({options: IMAGES})})],
  ['fov', ioNumberSlider({min: 10, max: 100, step: 1})],
  ['blurriness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsEnvmapsFasthdrExample, {
  Main: ['image', 'fov', 'blurriness'],
  Hidden: ['camera', 'renderer', 'loads'],
})
