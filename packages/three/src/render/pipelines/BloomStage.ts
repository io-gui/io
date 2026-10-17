import { HalfFloatType, RenderPipeline, RenderTarget, Texture, WebGPURenderer } from 'three/webgpu'
import { screenUV, texture } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import type { Bloom } from '../../editor/Bloom.js'

/**
 * Adds bloom to a pipeline's color (ADR-0006): draws the color plus three's `BloomNode` glow into a target of its own.
 * It runs after the pipeline's own passes (TRAA included), in linear color before the viewport tone-maps.
 */
export class BloomStage {

  readonly target = new RenderTarget(1, 1, {type: HalfFloatType, depthBuffer: false})

  private readonly _pipeline: RenderPipeline
  private readonly _bloom: ReturnType<typeof bloom>

  constructor(renderer: WebGPURenderer, input: Texture) {
    const color = texture(input, screenUV)
    this._bloom = bloom(color)
    this._pipeline = new RenderPipeline(renderer)
    this._pipeline.outputColorTransform = false
    this._pipeline.outputNode = color.add(this._bloom)
  }

  setSize(width: number, height: number) {
    this.target.setSize(width, height)
  }

  render(renderer: WebGPURenderer, settings: Bloom) {
    this._bloom.strength.value = settings.strength
    this._bloom.radius.value = settings.radius
    this._bloom.threshold.value = settings.threshold
    renderer.setRenderTarget(this.target)
    try {
      this._pipeline.render()
    } finally {
      renderer.setRenderTarget(null)
    }
  }

  dispose() {
    this._pipeline.dispose()
    this._bloom.dispose()
    this.target.dispose()
  }
}
