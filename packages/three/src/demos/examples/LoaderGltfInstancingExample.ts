import { ACESFilmicToneMapping, EquirectangularReflectionMapping } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * Damaged helmets from one glTF mesh drawn with `EXT_mesh_gpu_instancing` (an `InstancedMesh`), lit by an Ultra HDR
 * environment that is also the background. The environment and model load together (the source loads the model after
 * the environment).
 */
@Register
export class LoaderGltfInstancingExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})
    void this.loadEnvironment()
    void this.loadModel()
  }

  private async loadEnvironment() {
    try {
      const texture = await new UltraHDRLoader()
        .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
        .loadAsync( 'royal_esplanade_2k.hdr.jpg' )

      texture.mapping = EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.environment = texture

      this.notify({kind: 'material'})
    } catch ( e ) {
      console.error( e )
    }
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader()
        .setPath( 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF-instancing/' )
        .loadAsync( 'DamagedHelmetGpuInstancing.gltf' )

      gltf.scene.name = 'Helmets'
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
