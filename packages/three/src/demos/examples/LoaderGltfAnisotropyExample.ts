import { ACESFilmicToneMapping, EquirectangularReflectionMapping, PerspectiveCamera } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** The anisotropic glTF barn lamp (`KHR_materials_anisotropy`) in the Royal Esplanade environment, background blurred. */
@Register
export class LoaderGltfAnisotropyExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.35, ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 0.01, 10 )
    camera.name = 'Camera'
    camera.position.set( - 0.35, - 0.2, 0.35 )
    camera.lookAt( 0, - 0.08, 0.11 )
    this.activeCamera = camera
    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    const hdrLoader = new UltraHDRLoader().setPath( 'https://threejs.org/examples/textures/equirectangular/' )
    const gltfLoader = new GLTFLoader().setPath( 'https://threejs.org/examples/models/gltf/' )

    try {
      const [ texture, gltf ] = await Promise.all( [
        hdrLoader.loadAsync( 'royal_esplanade_2k.hdr.jpg' ),
        gltfLoader.loadAsync( 'AnisotropyBarnLamp.glb' ),
      ] )

      // environment
      texture.mapping = EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.backgroundBlurriness = 0.5
      this.scene.environment = texture

      // model
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
