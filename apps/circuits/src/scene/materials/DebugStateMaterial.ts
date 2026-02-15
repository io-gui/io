import { MeshBasicNodeMaterial, type Texture } from 'three/webgpu'
import { texture, uniform, vec4 } from 'three/tsl'

export type DebugStateTextureIndex = 0 | 1 | 2

export class DebugStateMaterial extends MeshBasicNodeMaterial {
  private _padsTexture: Texture
  private _layer0Texture: Texture
  private _layer1Texture: Texture

  public readonly textureIndex = uniform(0)

  constructor(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture) {
    super({
      transparent: true,
      toneMapped: false,
    })

    this._padsTexture = padsTexture
    this._layer0Texture = layer0Texture
    this._layer1Texture = layer1Texture
    this._rebuildColorNode()
  }

  setTextures(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture) {
    const changed = this._padsTexture !== padsTexture
      || this._layer0Texture !== layer0Texture
      || this._layer1Texture !== layer1Texture
    if (!changed) return

    this._padsTexture = padsTexture
    this._layer0Texture = layer0Texture
    this._layer1Texture = layer1Texture
    this._rebuildColorNode()
  }

  setTextureIndex(index: DebugStateTextureIndex) {
    this.textureIndex.value = index
  }

  private _rebuildColorNode() {
    const padsNode = texture(this._padsTexture)
    const layer0Node = texture(this._layer0Texture)
    const layer1Node = texture(this._layer1Texture)
    const selector = this.textureIndex.clamp(0, 2)

    const padsWeight = selector.sub(0).abs().oneMinus().clamp()
    const layer0Weight = selector.sub(1).abs().oneMinus().clamp()
    const layer1Weight = selector.sub(2).abs().oneMinus().clamp()

    const stateColor = padsNode.mul(padsWeight)
      .add(layer0Node.mul(layer0Weight))
      .add(layer1Node.mul(layer1Weight))

    this.outputNode = vec4(stateColor.rgb, 1)
    this.needsUpdate = true

  }
}
