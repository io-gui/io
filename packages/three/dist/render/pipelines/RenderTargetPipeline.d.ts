import { MRTNode, RenderTarget } from 'three/webgpu';
import type { PipelineContext, PipelineOutput, ViewPipeline } from '../ViewPipeline.js';
import type { ViewRenderResult } from '../RenderScheduler.js';
/**
 * Base for pipelines that draw into one half-float color target with a depth texture.
 * Subclasses implement `draw(ctx)`; the target is bound and cleared to the view's clear color first.
 */
export declare abstract class RenderTargetPipeline implements ViewPipeline {
    readonly target: RenderTarget;
    output: PipelineOutput;
    /**
     * Bound while drawing, so this view draws in its own three render context. Three keys render objects and their bind
     * groups by render context, which it derives from the target's format and the MRT, not from the target. Without
     * this, views whose targets share a format share that state, and one view samples another's viewport texture
     * (transmission). Compiled shaders and GPU resources stay shared; each view builds its own node state once.
     */
    readonly scope: MRTNode;
    constructor();
    setSize(width: number, height: number): void;
    render(ctx: PipelineContext): ViewRenderResult | void;
    protected abstract draw(ctx: PipelineContext): ViewRenderResult | void;
    dispose(): void;
}
