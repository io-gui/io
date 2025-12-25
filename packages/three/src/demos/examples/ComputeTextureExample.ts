import { Mesh, MeshBasicNodeMaterial, PlaneGeometry, StorageTexture, WebGPURenderer, ComputeNode, NearestFilter, TextureNode } from 'three/webgpu'
import { texture, textureStore, Fn, instanceIndex, float, uvec2, vec4 } from 'three/tsl'
import { Register } from 'io-core'
import { ThreeState } from 'io-three'

@Register
export class ComputeTextureExample extends ThreeState {
  public storageTexture: StorageTexture
  public computeNode: ComputeNode
  constructor() {
    super()
    const width = 32, height = 32
		this.storageTexture = new StorageTexture(width, height)

    const computeTexture = Fn(({storageTexture}: {storageTexture: StorageTexture}) => {
      const posX = instanceIndex.mod(width)
      const posY = instanceIndex.div(width)
      const indexUV = uvec2(posX, posY)

      // https://www.shadertoy.com/view/Xst3zN

      const x = float(posX).div(2.0)
      const y = float(posY).div(2.0)

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
    material.colorNode = texture(this.storageTexture);
    (material.colorNode as TextureNode).value.minFilter = NearestFilter;
    (material.colorNode as TextureNode).value.magFilter = NearestFilter

    const plane = new Mesh(new PlaneGeometry(1, 1), material)
    this.scene.add(plane)
  }
  onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    new Promise((resolve, reject) => {
      renderer.compute(this.computeNode)!.then(resolve).catch(reject)
    }).then(() => {
      console.log('compute node computed')
    }).catch(error => {
      console.error('compute node computation failed', error)
    })
  }
}