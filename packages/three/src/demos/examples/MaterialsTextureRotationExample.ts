import { BoxGeometry, Mesh, MeshBasicMaterial, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader, WebGPURenderer } from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** A box with a UV grid texture whose offset, repeat, rotation and rotation center are in the Document tab. */
@Register
export class MaterialsTextureRotationExample extends Document {

  public mesh: Mesh<BoxGeometry, MeshBasicMaterial>
  private texture: Texture

  @Property({type: Number, value: 0})
  declare offsetX: number

  @Property({type: Number, value: 0})
  declare offsetY: number

  @Property({type: Number, value: 0.25})
  declare repeatX: number

  @Property({type: Number, value: 0.25})
  declare repeatY: number

  /** Radians about the center; positive is counterclockwise. */
  @Property({type: Number, value: Math.PI / 4})
  declare rotation: number

  @Property({type: Number, value: 0.5})
  declare centerX: number

  @Property({type: Number, value: 0.5})
  declare centerY: number

  constructor(args?: DocumentProps) {
    super(args)

    const geometry = new BoxGeometry( 10, 10, 10 )

    // Views draw on document changes only, so report the texture when it arrives.
    this.texture = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', () => this.notify({kind: 'material'}) )
    this.texture.wrapS = this.texture.wrapT = RepeatWrapping
    this.texture.colorSpace = SRGBColorSpace

    //texture.matrixAutoUpdate = false; // default is true; set to false to update texture.matrix manually

    const material = new MeshBasicMaterial( { map: this.texture } )

    this.mesh = new Mesh( geometry, material )
    this.mesh.name = 'Box'
    this.scene.add( this.mesh )

    this.updateUvTransform()
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.texture.anisotropy = renderer.getMaxAnisotropy()
  }

  offsetXChanged() { this.updateUvTransform() }
  offsetYChanged() { this.updateUvTransform() }
  repeatXChanged() { this.updateUvTransform() }
  repeatYChanged() { this.updateUvTransform() }
  rotationChanged() { this.updateUvTransform() }
  centerXChanged() { this.updateUvTransform() }
  centerYChanged() { this.updateUvTransform() }

  private updateUvTransform() {
    const texture = this.texture
    if ( ! texture ) return

    if ( texture.matrixAutoUpdate === true ) {
      texture.offset.set( this.offsetX, this.offsetY )
      texture.repeat.set( this.repeatX, this.repeatY )
      texture.center.set( this.centerX, this.centerY )
      texture.rotation = this.rotation // rotation is around center
    } else {
      // setting the matrix uv transform directly
      texture.matrix.setUvTransform( this.offsetX, this.offsetY, this.repeatX, this.repeatY, this.rotation, this.centerX, this.centerY )
    }
  }
}

registerEditorConfig(MaterialsTextureRotationExample, [
  ['offsetX', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['offsetY', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['repeatX', ioNumberSlider({min: 0.25, max: 2, step: 0.01})],
  ['repeatY', ioNumberSlider({min: 0.25, max: 2, step: 0.01})],
  ['rotation', ioNumberSlider({min: - 2, max: 2, step: 0.01})],
  ['centerX', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['centerY', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsTextureRotationExample, {
  Main: ['offsetX', 'offsetY', 'repeatX', 'repeatY', 'rotation', 'centerX', 'centerY'],
  Hidden: ['mesh', 'texture'],
})
