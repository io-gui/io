import { PerspectiveCamera, SRGBColorSpace, TextureLoader } from 'three/webgpu'
import { texture, equirectUV } from 'three/tsl'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * An equirectangular panorama as the background, through a TSL background node; there is nothing to select. Its
 * `intensity` is in the Document tab. The active camera stands where the source's auto-rotation starts.
 * Static.
 */
@Register
export class EquirectangularExample extends Document {

  @Property({type: Number, value: 1})
  declare intensity: number

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( 1, 0, 0 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Views draw on document changes only, so report the texture when it arrives.
    const equirectTexture = new TextureLoader().load( 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg', () => this.notify({kind: 'material'}) )
    equirectTexture.colorSpace = SRGBColorSpace

    this.scene.backgroundNode = texture( equirectTexture, equirectUV(), 0 )

    this.intensityChanged()
  }

  intensityChanged() { this.scene.backgroundIntensity = this.intensity }
}

registerEditorConfig(EquirectangularExample, [
  ['intensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(EquirectangularExample, {
  Main: ['intensity'],
})
