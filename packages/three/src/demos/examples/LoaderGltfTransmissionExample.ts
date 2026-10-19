import { ACESFilmicToneMapping, AnimationMixer, EquirectangularReflectionMapping, PerspectiveCamera } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/**
 * The animated iridescent dish with olives (`KHR_materials_transmission`, volume, iridescence) in the Royal Esplanade
 * environment. The active camera stands where the source's auto-rotation
 * starts. Plays when opened.
 */
@Register
export class LoaderGltfTransmissionExample extends Document {

  public mixer?: AnimationMixer

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( 0, 0.4, 0.7 )
    camera.lookAt( 0, 0.1, 0 )
    this.activeCamera = camera
    void this.load()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async load() {
    try {
      const texture = await new UltraHDRLoader().setPath( 'https://threejs.org/examples/textures/equirectangular/' ).loadAsync( 'royal_esplanade_2k.hdr.jpg' )
      texture.mapping = EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.backgroundBlurriness = 0.35
      this.scene.environment = texture

      // model

      const gltf = await new GLTFLoader()
        .setPath( 'https://threejs.org/examples/models/gltf/' )
        .setDRACOLoader( new DRACOLoader().setDecoderPath( DRACO_GLTF_CONFIG ) )
        .loadAsync( 'IridescentDishWithOlives.glb' )

      this.timeline.duration = gltf.animations[ 0 ].duration
      this.mixer = new AnimationMixer( gltf.scene )
      this.mixer.clipAction( gltf.animations[ 0 ] ).play()
      this.mixer.setTime( this.timeline.currentTime )
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this._frameTarget = gltf.scene
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}
