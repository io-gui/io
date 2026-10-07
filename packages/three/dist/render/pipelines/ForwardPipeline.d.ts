import type { PipelineContext } from '../ViewPipeline.js';
import { RenderTargetPipeline } from './RenderTargetPipeline.js';
/** Draws the content scene with its own materials, as `renderer.render(scene, camera)` would. Default for 3D views. */
export declare class ForwardPipeline extends RenderTargetPipeline {
    protected draw(ctx: PipelineContext): void;
}
