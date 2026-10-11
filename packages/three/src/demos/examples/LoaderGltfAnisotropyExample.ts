import { ACESFilmicToneMapping, EquirectangularReflectionMapping } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The anisotropic glTF barn lamp (`KHR_materials_anisotropy`) in the Royal Esplanade environment, background blurred. */
@Register
export class LoaderGltfAnisotropyExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.35, ...args})
    void this.load()
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
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
