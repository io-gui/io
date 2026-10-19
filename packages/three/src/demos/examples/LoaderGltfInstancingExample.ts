import { ACESFilmicToneMapping, EquirectangularReflectionMapping, PerspectiveCamera } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * Damaged helmets from one glTF mesh drawn with `EXT_mesh_gpu_instancing` (an `InstancedMesh`), lit by an Ultra HDR
 * environment that is also the background. The environment and model load together (the source loads the model after
 * the environment).
 */
@Register
export class LoaderGltfInstancingExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( - 0.9, 0.41, - 0.89 )
    camera.lookAt( 0, 0.25, 0 )
    this.activeCamera = camera
    void this.loadEnvironment()
    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
