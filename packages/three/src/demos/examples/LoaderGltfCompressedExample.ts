import { Color, PointLight, ReinhardToneMapping, WebGPURenderer } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * A coffee machine glTF with KTX2 (Basis) textures and Meshopt-compressed geometry. The file loads in
 * `onRendererInitialized`, after `detectSupport` picks the texture format. The source attaches its light to the camera;
 * here it stands at the source camera's position. Static.
 */
@Register
export class LoaderGltfCompressedExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ReinhardToneMapping, toneMappingExposure: 1, ...args})

    this.scene.background = new Color( 0xEEEEEE )

    //lights

    const light = new PointLight( 0xffffff )
    light.name = 'Point'
    light.power = 1300
    light.position.set( 2, 2, 2 )
    this.scene.add( light )
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
      this.dispatch('frame-object', {object: gltfScene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}
