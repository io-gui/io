import { Color } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A forest house from a Draco-compressed glTF with AVIF textures (`EXT_texture_avif`). */
@Register
export class LoaderGltfAvifExample extends Document {

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0xf6eedc )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader()
        .setDRACOLoader( new DRACOLoader().setDecoderPath( DRACO_GLTF_CONFIG ) )
        .setPath( 'https://threejs.org/examples/models/gltf/AVIFTest/' )
        .loadAsync( 'forest_house.glb' )

      gltf.scene.name = 'ForestHouse'
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
