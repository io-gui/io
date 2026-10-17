import { DepthTexture, HalfFloatType, RenderTarget } from 'three/webgpu'
import type { PipelineContext, PipelineOutput, ViewPipeline } from '../ViewPipeline.js'
import type { ViewRenderResult } from '../RenderScheduler.js'
import { BloomStage } from './BloomStage.js'

/**
 * Base for pipelines that draw into one half-float color target with a depth texture.
 * Subclasses implement `draw(ctx)`; the target is bound and cleared to the view's clear color first.
 * When the view draws bloom (`view.bloom`, else `document.bloom.enabled`), a `BloomStage` adds it to the target's
 * color and its target becomes the output color.
 */
export abstract class RenderTargetPipeline implements ViewPipeline {

  readonly target: RenderTarget
  output: PipelineOutput

  private _bloom: BloomStage | null = null

  constructor() {
    this.target = new RenderTarget(1, 1, {type: HalfFloatType, depthBuffer: true})
    this.target.depthTexture = new DepthTexture(1, 1)
    this.output = {color: this.target.texture, depth: this.target.depthTexture}
  }

  setSize(width: number, height: number) {
    this.target.setSize(Math.max(1, width), Math.max(1, height))
    this._bloom?.setSize(this.target.width, this.target.height)
  }

  /** Multisamples the target (three re-creates its textures on the next draw). */
  setSamples(samples: number) {
    this.target.samples = samples
  }

  render(ctx: PipelineContext): ViewRenderResult | void {
    const renderer = ctx.renderer
    renderer.setRenderTarget(this.target)
    renderer.setClearColor(ctx.view.clearColor, ctx.view.clearAlpha)
    renderer.clear()
    let result: ViewRenderResult | void
    try {
      result = this.draw(ctx)
    } finally {
      renderer.setRenderTarget(null)
    }
    this._drawBloom(ctx)
    return result
  }

  protected abstract draw(ctx: PipelineContext): ViewRenderResult | void

  private _drawBloom(ctx: PipelineContext) {
    const settings = ctx.document.bloom
    const enabled = ctx.view.bloom ?? settings.enabled
    if (enabled) {
      if (!this._bloom) {
        this._bloom = new BloomStage(ctx.renderer, this.target.texture)
        this._bloom.setSize(this.target.width, this.target.height)
      }
      this._bloom.render(ctx.renderer, settings)
    }
    const color = enabled ? this._bloom!.target.texture : this.target.texture
    if (this.output.color !== color) this.output = {...this.output, color}
  }

  dispose() {
    this._bloom?.dispose()
    this.target.dispose()
  }
}
