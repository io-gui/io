import { Color, PerspectiveCamera } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** A forest house from a Draco-compressed glTF with AVIF textures (`EXT_texture_avif`). */
@Register
export class LoaderGltfAvifExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 1.5, 4, 9 )
    camera.lookAt( 0, 2, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0xf6eedc )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
