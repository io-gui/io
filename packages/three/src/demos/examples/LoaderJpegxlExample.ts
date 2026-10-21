import {
  ACESFilmicToneMapping,
  Color,
  Loader,
  Mesh,
  MeshStandardNodeMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Texture
} from 'three/webgpu'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
// @ts-expect-error JXLLoader is r187, not in @types/three 0.186
import { JXLLoader as JXLLoaderClass } from 'three/addons/loaders/JXLLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

const JXLLoader = JXLLoaderClass as new () => Loader<Texture>

/** The JPEG XL file came with r187 and is not on threejs.org before that release. */
const JXL_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hdr-native/venice_sunset_512.jxl'

/**
 * The Venice Sunset HDR side by side as Radiance HDR (left, the source) and as a 32-bit float linear JPEG XL (right),
 * which `JXLLoader` decodes natively into a 16-bit float texture; each lights a plane as its emissive map. A browser
 * without JPEG XL decoding or float16 Canvas2D shows a dark plane instead and warns in the console. The source's
 * tone mapping and exposure controls are the document's (Rendering). The source's HTML labels are dropped: the
 * planes are named. The orthographic active camera has the source's frustum at the screenshot's aspect. Static.
 */
@Register
export class LoaderJpegxlExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    // The source fits the frustum to the window: at least 7 units wide and 3.6 high.
    const aspect = 400 / 250
    const width = Math.max( 7, aspect * 3.6 )
    const camera = new OrthographicCamera( - width / 2, width / 2, width / aspect / 2, - width / aspect / 2, 0.1, 10 )
    camera.name = 'Camera'
    camera.position.z = 2
    this.activeCamera = camera

    this.scene.background = new Color( 0x17191e )

    const geometry = new PlaneGeometry( 2.8, 1.4 )

    void this.addImage( geometry, new HDRLoader(), 'Radiance HDR (source)', 'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', - 1.55 )
    void this.addImage( geometry, new JXLLoader(), 'JPEG XL', JXL_URL, 1.55 )
  }

  private async addImage( geometry: PlaneGeometry, loader: Loader<Texture>, name: string, url: string, x: number ) {
    const material = new MeshStandardNodeMaterial( { color: 0x000000, emissive: 0xffffff } )
    const mesh = new Mesh( geometry, material )
    mesh.name = name + ' HDR'
    mesh.position.x = x
    this.scene.add( mesh )

    try {
      material.emissiveMap = await loader.loadAsync( url )
    } catch ( error ) {
      material.emissive.set( 0x252830 )
      material.toneMapped = false
      console.warn( name + ' HDR not supported:', error )
    }

    material.needsUpdate = true
    this.notify({kind: 'material'})
  }
}
