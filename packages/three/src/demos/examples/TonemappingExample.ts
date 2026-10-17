import { DirectionalLight, EquirectangularReflectionMapping, NeutralToneMapping } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A Venetian mask under a low sun and a sunset HDR panorama, for comparing tone mappings: the source's tone mapping
 * type and exposure controls are the document's own `toneMapping` and `toneMappingExposure` (Rendering group); the
 * background's `blurriness` and `intensity` are in the Document tab. Static.
 */
@Register
export class TonemappingExample extends Document {

  @Property({type: Number, value: 0.3})
  declare blurriness: number

  @Property({type: Number, value: 1.0})
  declare intensity: number

  constructor(args?: DocumentProps) {
    super({toneMapping: NeutralToneMapping, toneMappingExposure: 1.0, ...args})

    const light = new DirectionalLight( 0xfff3ee, 3 ) // simulate sun
    light.name = 'Sun'
    light.position.set( 1, 0.05, 0.7 )
    this.scene.add( light )

    void this.load()

    this.blurrinessChanged()
    this.intensityChanged()
  }

  private async load() {
    try {
      const hdrLoader = new HDRLoader()
        .setPath( 'https://threejs.org/examples/textures/equirectangular/' )

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath( DRACO_GLTF_CONFIG )

      const gltfLoader = new GLTFLoader()
      gltfLoader.setDRACOLoader( dracoLoader )
      gltfLoader.setPath( 'https://threejs.org/examples/models/gltf/' )

      const [ texture, gltf ] = await Promise.all( [
        hdrLoader.loadAsync( 'venice_sunset_1k.hdr' ),
        gltfLoader.loadAsync( 'venice_mask.glb' ),
      ] )

      // environment

      texture.mapping = EquirectangularReflectionMapping

      this.scene.background = texture
      this.scene.environment = texture

      // model

      gltf.scene.name = 'VeniceMask'
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: gltf.scene}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  blurrinessChanged() { this.scene.backgroundBlurriness = this.blurriness }
  intensityChanged() { this.scene.backgroundIntensity = this.intensity }
}

registerEditorConfig(TonemappingExample, [
  ['blurriness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['intensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(TonemappingExample, {
  Main: ['blurriness', 'intensity'],
})
