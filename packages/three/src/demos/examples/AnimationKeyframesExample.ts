import {
  AnimationMixer,
  Color,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  WebGPURenderer
} from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Register } from '@io-gui/core'
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three'

/**
 * The animated Littlest Tokyo model, lit by a PMREM room environment, with a scene camera riding the train.
 * Plays when opened.
 */
@Register
export class AnimationKeyframesExample extends ThreeDocument {

  public mixer: AnimationMixer = new AnimationMixer(new Object3D())

  constructor(args?: ThreeDocumentProps) {
    super({autoplay: true, ...args})
    this.scene.background = new Color( 0xbfe3dd )
    void this.loadModel()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    const pmremGenerator = new PMREMGenerator( renderer )
    this.scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture
  }

  private async loadModel() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/' )

    const loader = new GLTFLoader()
    loader.setDRACOLoader( dracoLoader )

    try {
      const gltf = await loader.loadAsync( 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb' )
      const model = gltf.scene
      model.position.set( 1, 1, 0 )
      model.scale.set( 0.01, 0.01, 0.01 )
      this.scene.add( model )

      this.mixer = new AnimationMixer( model )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()

      const train = gltf.scene.getObjectByName('Object675')!
      const perspectiveCamera = new PerspectiveCamera( 125, 1, 0.1, 1000 )
      perspectiveCamera.name = 'TrainCamera'
      perspectiveCamera.position.set(140, 0, 30)
      perspectiveCamera.rotation.set(Math.PI / 2, -Math.PI / 2, 0)
      train.add(perspectiveCamera)

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer.update( delta )
  }
}
