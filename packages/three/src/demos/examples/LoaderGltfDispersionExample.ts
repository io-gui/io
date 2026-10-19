import { EquirectangularReflectionMapping, PerspectiveCamera, ReinhardToneMapping } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** The glTF dispersion test (`KHR_materials_dispersion`) in the pedestrian overpass HDR environment, background blurred. */
@Register
export class LoaderGltfDispersionExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.01, 5 )
    camera.name = 'Camera'
    camera.position.set( 0.1, 0.05, 0.15 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera
    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
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
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }
}
