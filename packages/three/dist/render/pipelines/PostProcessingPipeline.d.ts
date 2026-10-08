import { Camera, Node, PassNode, PostProcessing, WebGPURenderer } from 'three/webgpu';
import type { PipelineContext } from '../ViewPipeline.js';
import type { ViewRenderResult } from '../RenderScheduler.js';
import { RenderTargetPipeline } from './RenderTargetPipeline.js';
/**
 * Builds the post-processing graph from the scene pass. Called again when the view's camera object changes
 * (projection switch, looking through a scene camera), because nodes such as TRAA hold the camera.
 */
export type PostProcessingBuilder = (scenePass: PassNode, camera: Camera) => Node;
export type PostProcessingPipelineOptions = {
    /**
     * Frames to keep drawing after the last change, for effects that accumulate (TRAA, progressive
     * path tracing). 0 (default) draws once per change.
     */
    convergeFrames?: number;
};
/**
 * A pipeline around three's `PostProcessing` and a `pass(scene, camera)` (ADR-0006). Its output stays linear;
 * the viewport tone-maps when presenting. The scene pass depth is exposed so overlays depth-test against it.
 *
 * ```ts
 * registerPipeline({id: 'bloom', create: renderer =>
 *   new PostProcessingPipeline(renderer, scenePass => scenePass.add(bloom(scenePass)))})
 * ```
 */
export declare class PostProcessingPipeline extends RenderTargetPipeline {
    readonly postProcessing: PostProcessing;
    readonly scenePass: PassNode;
    convergeFrames: number;
    private readonly _build;
    private _camera;
    private _framesSinceChange;
    constructor(renderer: WebGPURenderer, build: PostProcessingBuilder, options?: PostProcessingPipelineOptions);
    protected draw(ctx: PipelineContext): ViewRenderResult;
    dispose(): void;
}
