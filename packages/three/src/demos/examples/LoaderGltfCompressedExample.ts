import { Color, PerspectiveCamera, PointLight, ReinhardToneMapping, WebGPURenderer } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/**
 * A coffee machine glTF with KTX2 (Basis) textures and Meshopt-compressed geometry. The file loads in
 * `onRendererInitialized`, after `detectSupport` picks the texture format. The light rides on the source's
 * camera, the active camera. Static.
 */
@Register
export class LoaderGltfCompressedExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: 1, ...args})

    this.scene.background = new Color( 0xEEEEEE )

    //lights

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 20 )
    camera.name = 'Camera'
    camera.position.set( 2, 2, 2 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    const light = new PointLight( 0xffffff )
    light.name = 'Point'
    light.power = 1300
    camera.add( light )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void this.loadModel( renderer )
  }

  private async loadModel( renderer: WebGPURenderer ) {
    try {
      const ktx2Loader = new KTX2Loader().detectSupport( renderer )

      const loader = new GLTFLoader()
      loader.setKTX2Loader( ktx2Loader )
      loader.setMeshoptDecoder( MeshoptDecoder )

      const gltf = await loader.loadAsync( 'https://threejs.org/examples/models/gltf/coffeemat.glb' )
      ktx2Loader.dispose()
      const gltfScene = gltf.scene
      gltfScene.name = 'Coffeemat'
      gltfScene.position.y = - .8
      gltfScene.scale.setScalar( .01 )
      this.scene.add( gltfScene )

      this.notify({kind: 'structure'})
      this._frameTarget = gltfScene
    } catch ( e ) {
      console.error( e )
    }
  }
}
