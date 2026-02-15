import type { Texture } from 'three/webgpu'
import { StateTextureMaterialBase } from './StateTextureMaterialBase.js'

export class PadsStateMaterial extends StateTextureMaterialBase {
  constructor(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture) {
    super(padsTexture, layer0Texture, layer1Texture, 0)
  }
}

