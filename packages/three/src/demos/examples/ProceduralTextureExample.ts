import { Mesh, MeshBasicNodeMaterial, PlaneGeometry } from 'three/webgpu'
import { checker, uv, uniform, convertToTexture } from 'three/tsl'
import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * A plane whose material renders a procedural checker into a 512² texture (`convertToTexture`) and blurs that
 * texture. The UV scale (before the render to texture), blur amount (after it) and auto update are in the Document
 * tab. The source's orthographic camera is dropped.
 */
@Register
export class ProceduralTextureExample extends Document {

  public plane: Mesh
  private uvScaleUniform = uniform( 4 )
  private blurAmountUniform = uniform( .5 )
  private proceduralToTexture: ReturnType<typeof convertToTexture>

  @Property({type: Number, value: 4})
  declare uvScale: number

  @Property({type: Number, value: .5})
  declare blurAmount: number

  @Property({type: Boolean, value: true})
  declare autoUpdate: boolean

  constructor(args?: DocumentProps) {
    super(args)

    // procedural to texture

    const procedural = checker( uv().mul( this.uvScaleUniform ) )
    this.proceduralToTexture = convertToTexture( procedural, 512, 512 ) // ( node, width, height )

    const colorNode = gaussianBlur( this.proceduralToTexture, this.blurAmountUniform, 20 )

    // extra
    //proceduralToTexture.autoUpdate = false; // update just once
    //proceduralToTexture.textureNeedsUpdate = true; // manually update

    // scene

    const material = new MeshBasicNodeMaterial()
    material.colorNode = colorNode

    this.plane = new Mesh( new PlaneGeometry( 1, 1 ), material )
    this.plane.name = 'Plane'
    this.scene.add( this.plane )
  }

  uvScaleChanged() { this.uvScaleUniform.value = this.uvScale }
  blurAmountChanged() { this.blurAmountUniform.value = this.blurAmount }
  autoUpdateChanged() { this.proceduralToTexture.autoUpdate = this.autoUpdate }
}

registerEditorConfig(ProceduralTextureExample, [
  ['uvScale', ioNumberSlider({min: 1, max: 10, step: 0.01})],
  ['blurAmount', ioNumberSlider({min: 0, max: 2, step: 0.01})],
])

registerEditorGroups(ProceduralTextureExample, {
  Main: ['uvScale', 'blurAmount', 'autoUpdate'],
})
