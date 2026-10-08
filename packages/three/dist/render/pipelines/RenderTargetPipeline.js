import { DepthTexture, HalfFloatType, RenderTarget } from 'three/webgpu';
/**
 * Base for pipelines that draw into one half-float color target with a depth texture.
 * Subclasses implement `draw(ctx)`; the target is bound and cleared to the view's clear color first.
 */
export class RenderTargetPipeline {
    target;
    output;
    constructor() {
        this.target = new RenderTarget(1, 1, { type: HalfFloatType, depthBuffer: true });
        this.target.depthTexture = new DepthTexture(1, 1);
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
        try {
            return this.draw(ctx);
        }
        finally {
            renderer.setRenderTarget(null);
        }
    }
    dispose() {
        this.target.dispose();
    }
}
