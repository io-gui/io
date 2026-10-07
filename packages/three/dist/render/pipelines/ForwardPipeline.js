import { RenderTargetPipeline } from './RenderTargetPipeline.js';
/** Draws the content scene with its own materials, as `renderer.render(scene, camera)` would. Default for 3D views. */
export class ForwardPipeline extends RenderTargetPipeline {
    draw(ctx) {
        ctx.renderer.render(ctx.scene, ctx.camera);
    }
}
