import { DepthTexture, HalfFloatType, RenderTarget } from 'three/webgpu'
import type { PipelineContext, PipelineOutput, ViewPipeline } from '../ViewPipeline.js'
import type { ViewRenderResult } from '../RenderScheduler.js'

/**
 * Base for pipelines that draw into one half-float color target with a depth texture.
 * Subclasses implement `draw(ctx)`; the target is bound and cleared to the view's clear color first.
 */
export abstract class RenderTargetPipeline implements ViewPipeline {

  readonly target: RenderTarget
  output: PipelineOutput

  constructor() {
    this.target = new RenderTarget(1, 1, {type: HalfFloatType, depthBuffer: true})
    this.target.depthTexture = new DepthTexture(1, 1)
    this.output = {color: this.target.texture, depth: this.target.depthTexture}
  }

  setSize(width: number, height: number) {
    this.target.setSize(Math.max(1, width), Math.max(1, height))
  }

  render(ctx: PipelineContext): ViewRenderResult | void {
    const renderer = ctx.renderer
    renderer.setRenderTarget(this.target)
    renderer.setClearColor(ctx.view.clearColor, ctx.view.clearAlpha)
    renderer.clear()
    try {
      return this.draw(ctx)
    } finally {
      renderer.setRenderTarget(null)
    }
  }

  protected abstract draw(ctx: PipelineContext): ViewRenderResult | void

  dispose() {
    this.target.dispose()
  }
}
