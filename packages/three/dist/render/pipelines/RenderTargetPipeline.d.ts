import { RenderTarget } from 'three/webgpu';
import type { PipelineContext, PipelineOutput, ViewPipeline } from '../ViewPipeline.js';
import type { ViewRenderResult } from '../RenderScheduler.js';
/**
 * Base for pipelines that draw into one half-float color target with a depth texture.
 * Subclasses implement `draw(ctx)`; the target is bound and cleared to the view's clear color first.
 */
export declare abstract class RenderTargetPipeline implements ViewPipeline {
    readonly target: RenderTarget;
    output: PipelineOutput;
    constructor();
    setSize(width: number, height: number): void;
    render(ctx: PipelineContext): ViewRenderResult | void;
    protected abstract draw(ctx: PipelineContext): ViewRenderResult | void;
    dispose(): void;
}
