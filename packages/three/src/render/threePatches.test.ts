import { describe, it, expect } from 'vitest'
import { RenderTarget, ViewportTextureNode } from 'three/webgpu'
import { threePatches } from '@io-gui/three'

describe('threePatches', () => {
  it('each patch fixes a defect this three version still has', () => {
    for (const patch of threePatches) {
      expect(patch.hasDefect(), `three no longer has the "${patch.id}" defect: delete the patch`).toBe(true)
    }
  })
  it('gives each render target its own viewport texture size', () => {
    const node = new ViewportTextureNode()
    const first = node.getTextureForReference(new RenderTarget())
    const second = node.getTextureForReference(new RenderTarget())
    first.image.width = 442
    second.image.width = 443
    expect(first.image.width).toBe(442)
    expect(second.image.width).toBe(443)
  })
  it('keeps the copy for a render target', () => {
    const node = new ViewportTextureNode()
    const target = new RenderTarget()
    expect(node.getTextureForReference(target)).toBe(node.getTextureForReference(target))
  })
})
