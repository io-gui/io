import { ACESFilmicToneMapping, EquirectangularReflectionMapping } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The iridescent glTF lamp (`KHR_materials_iridescence`) in the Venice sunset HDR environment. The source's camera auto-rotation is dropped. */
@Register
export class LoaderGltfIridescenceExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})
    void this.load()
  }

  private async load() {
    const hdrLoader = new HDRLoader().setPath( 'https://threejs.org/examples/textures/equirectangular/' )
    const gltfLoader = new GLTFLoader().setPath( 'https://threejs.org/examples/models/gltf/' )

    try {
      const [ texture, gltf ] = await Promise.all( [
        hdrLoader.loadAsync( 'venice_sunset_1k.hdr' ),
        gltfLoader.loadAsync( 'IridescenceLamp.glb' ),
      ] )

      // environment
      texture.mapping = EquirectangularReflectionMapping
      this.scene.background = texture
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
