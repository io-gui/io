import { ACESFilmicToneMapping, EquirectangularReflectionMapping, PerspectiveCamera } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * The iridescent glTF lamp (`KHR_materials_iridescence`) in the Venice sunset HDR environment. The active camera stands
 * where the source's auto-rotation starts.
 */
@Register
export class LoaderGltfIridescenceExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 0.05, 20 )
    camera.name = 'Camera'
    camera.position.set( 0.35, 0.05, 0.35 )
    camera.lookAt( 0, 0.2, 0 )
    this.activeCamera = camera
    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
