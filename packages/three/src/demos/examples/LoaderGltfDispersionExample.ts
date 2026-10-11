import { EquirectangularReflectionMapping, ReinhardToneMapping } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** The glTF dispersion test (`KHR_materials_dispersion`) in the pedestrian overpass HDR environment, background blurred. */
@Register
export class LoaderGltfDispersionExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, ...args})
    void this.load()
  }

  private async load() {
    try {
      const hdrTexture = await new HDRLoader().setPath( 'https://threejs.org/examples/textures/equirectangular/' ).loadAsync( 'pedestrian_overpass_1k.hdr' )
      hdrTexture.mapping = EquirectangularReflectionMapping

      this.scene.backgroundBlurriness = 0.5
      this.scene.environment = hdrTexture
      this.scene.background = hdrTexture

      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/DispersionTest.glb' )
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
