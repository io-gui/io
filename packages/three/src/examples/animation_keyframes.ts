import {
  AnimationMixer,
  Color,
  PMREMGenerator,
  WebGPURenderer
} from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Register } from '@io-gui/core'
import { ThreeApplet } from '@io-gui/three'

@Register
export class AnimationKeyframesExample extends ThreeApplet {

  public mixer: AnimationMixer | null = null

  constructor() {
    super()
    this.scene.background = new Color( 0xbfe3dd )
  }

  async onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)

    const pmremGenerator = new PMREMGenerator( renderer )
    this.scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

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

      this.dispatchMutation()
      this.dispatch('scene-ready', {scene: this.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  onAnimate(delta: number) {
    if ( this.mixer ) {
      this.mixer.update( delta )
    }
  }
}

