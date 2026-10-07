import { Scene, WebGPURenderer } from 'three/webgpu';
import type { DocumentChange } from '../editor/ChangeBus.js';
import type { ThreeView } from '../view/ThreeView.js';
import type { DirtyReason, ViewRenderResult } from './RenderScheduler.js';
import { PipelineContext, ViewPipeline } from './ViewPipeline.js';
import { Overlay } from './Overlay.js';
import './builtins.js';
/**
 * Draws one view (ADR-0006): runs the view's pipeline when content, navigation or size changed, then presents
 * the pipeline output to the canvas together with the overlays in a single pass of a small overlay scene.
 * When only overlays changed (selection, gizmo hover) the cached pipeline output is presented again.
 * Tone mapping and exposure are applied here, from the view, the pipeline or the document, in that order.
 */
export declare class ViewCompositor {
    /** Overlay scene: the presented pipeline output first, then each overlay's root. */
    readonly scene: Scene<import("three").Object3DEventMap>;
    private readonly _renderer;
    private _pipeline;
    private _pipelineId;
    private readonly _overlays;
    private _width;
    private _height;
    private _hasOutput;
    private readonly _present;
    private readonly _presentMaterial;
    private _colorNode;
    private _depthNode;
    constructor(renderer: WebGPURenderer);
    get pipeline(): ViewPipeline | null;
    get overlays(): readonly Overlay[];
    /** Creates the view's pipeline, or replaces it when `view.pipeline` or `view.kind` changed. */
    syncPipeline(view: ThreeView): void;
    /** Creates and disposes registered overlays to match the view's kind and `overlays` flags. */
    syncOverlays(view: ThreeView): void;
    /** Adds an overlay that is not in the registry (the viewport's gizmo layer). */
    addOverlay(overlay: Overlay, order?: number): void;
    removeOverlay(overlay: Overlay): void;
    /** How a document change affects this view. */
    listens(change: DocumentChange): DirtyReason | false;
    /** Draws into the renderer's current canvas target. */
    render(ctx: PipelineContext): ViewRenderResult | void;
    dispose(): void;
    private _addEntry;
    /** Points the present quad at the pipeline output; rebuilds the material only when depth appears or goes. */
    private _setPresented;
}
