import { Mesh, MeshBasicNodeMaterial, PlaneGeometry, StorageTexture, ComputeNode, WebGPURenderer } from 'three/webgpu'
import { texture, textureStore, Fn, instanceIndex, float, uvec2, vec4 } from 'three/tsl'
import { Register } from '@io-gui/core'
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three'

@Register
export class ComputeTextureExample extends ThreeDocument {
  public storageTexture: StorageTexture
  public computeNode: ComputeNode
  constructor(args?: ThreeDocumentProps) {
    super(args)
    const width = 512, height = 512
    this.storageTexture = new StorageTexture(width, height)

    const computeTexture = Fn(({storageTexture}: {storageTexture: StorageTexture}) => {
      const posX = instanceIndex.mod(width)
      const posY = instanceIndex.div(width)
      const indexUV = uvec2(posX, posY)

      // https://www.shadertoy.com/view/Xst3zN

      const x = float(posX).div(50.0)
      const y = float(posY).div(50.0)

      const v1 = x.sin()
      const v2 = y.sin()
      const v3 = x.add(y).sin()
      const v4 = x.mul(x).add(y.mul(y)).sqrt().add(5.0).sin()
      const v = v1.add(v2, v3, v4)

      const r = v.sin()
      const g = v.add(Math.PI).sin()
      const b = v.add(Math.PI).sub(0.5).sin()
      textureStore(storageTexture, indexUV, vec4(r, g, b, 1)).toWriteOnly()
    })
    this.computeNode = computeTexture({storageTexture: this.storageTexture}).compute(width * height)

    const material = new MeshBasicNodeMaterial({color: 0x00ff00})
    material.colorNode = texture(this.storageTexture)

    const plane = new Mesh(new PlaneGeometry(1, 1), material)
    this.scene.add(plane)
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void renderer.compute(this.computeNode)
  }
}
