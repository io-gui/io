import { DepthTexture, HalfFloatType, RenderTarget } from 'three/webgpu';
import { mrt, output } from 'three/tsl';
/**
 * Base for pipelines that draw into one half-float color target with a depth texture.
 * Subclasses implement `draw(ctx)`; the target is bound and cleared to the view's clear color first.
 */
export class RenderTargetPipeline {
    target;
    output;
    /**
     * Bound while drawing, so this view draws in its own three render context. Three keys render objects and their bind
     * groups by render context, which it derives from the target's format and the MRT, not from the target. Without
     * this, views whose targets share a format share that state, and one view samples another's viewport texture
     * (transmission). Compiled shaders and GPU resources stay shared; each view builds its own node state once.
     */
    scope = mrt({ output });
    constructor() {
        this.target = new RenderTarget(1, 1, { type: HalfFloatType, depthBuffer: true });
        this.target.depthTexture = new DepthTexture(1, 1);
        // MRT outputs bind to target textures by name.
        this.target.texture.name = 'output';
        this.output = { color: this.target.texture, depth: this.target.depthTexture };
    }
    setSize(width, height) {
        this.target.setSize(Math.max(1, width), Math.max(1, height));
    }
    render(ctx) {
        const renderer = ctx.renderer;
        renderer.setRenderTarget(this.target);
        renderer.setClearColor(ctx.view.clearColor, ctx.view.clearAlpha);
        renderer.clear();
        renderer.setMRT(this.scope);
        try {
            return this.draw(ctx);
        }
        finally {
            renderer.setMRT(null);
            renderer.setRenderTarget(null);
        }
    }
    dispose() {
        this.target.dispose();
    }
}
