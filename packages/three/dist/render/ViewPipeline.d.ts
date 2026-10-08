import type { OrthographicCamera, PerspectiveCamera, Scene, Texture, ToneMapping, WebGPURenderer } from 'three/webgpu';
import type { DirtyReason, FrameInfo, ViewRenderResult } from './RenderScheduler.js';
import type { DocumentChange } from '../editor/ChangeBus.js';
import type { ThreeDocument } from '../editor/ThreeDocument.js';
import type { ThreeEditor } from '../editor/ThreeEditor.js';
import type { ThreeView, ViewKind } from '../view/ThreeView.js';
import type { SelectionModel } from '../selection/SelectionModel.js';
import type { Picker } from '../selection/Picker.js';
import type { ComponentPicker } from '../selection/ComponentPicker.js';
/** Everything a pipeline or overlay needs for one draw of one view. */
export interface PipelineContext {
    readonly renderer: WebGPURenderer;
    readonly editor: ThreeEditor;
    readonly document: ThreeDocument;
    /** The document's content scene. */
    readonly scene: Scene;
    readonly view: ThreeView;
    /** The view's draw camera at this size (ADR-0005). */
    readonly camera: PerspectiveCamera | OrthographicCamera;
    readonly selection: SelectionModel | null;
    /** CSS pixels. */
    readonly width: number;
    readonly height: number;
    readonly pixelRatio: number;
    readonly reasons: ReadonlySet<DirtyReason>;
    readonly frame: FrameInfo;
}
/** What a pipeline produced: linear color and, when it has one, depth for overlays to test against. */
export interface PipelineOutput {
    readonly color: Texture;
    readonly depth: Texture | null;
}
/**
 * How one view draws its content (ADR-0006): forward, post-processed, deferred, UV, ...
 * A pipeline draws into its own targets in linear color without tone mapping; the viewport then presents
 * the output to its canvas (tone mapping and color space conversion happen there) and draws overlays on top.
 * Created per view, because targets are sized per view; the renderer and its shader caches are shared.
 */
export interface ViewPipeline {
    readonly output: PipelineOutput | null;
    /** Tone mapping for this pipeline's output when the view does not override it. Default: the document's. */
    readonly toneMapping?: ToneMapping;
    /** How picking works in views drawn by this pipeline. Default: raycasting the content scene. */
    readonly picker?: Picker;
    /** How components are picked in edit mode. Default: the viewport's ID-buffer picker. */
    readonly componentPicker?: ComponentPicker;
    /** Drawing-buffer size in physical pixels. */
    setSize(width: number, height: number): void;
    /** Draws the content. Return `{converged: false}` to be drawn again next frame (progressive pipelines). */
    render(ctx: PipelineContext): ViewRenderResult | void;
    /**
     * How a document change affects this pipeline: `'content'` redraws it, `'overlay'` only redraws overlays,
     * `false` ignores it. Default: selection changes are `'overlay'`, everything else `'content'`.
     */
    listens?(change: DocumentChange): DirtyReason | false;
    dispose(): void;
}
export type ViewPipelineFactory = (renderer: WebGPURenderer) => ViewPipeline;
export interface ViewPipelineType {
    readonly id: string;
    readonly label?: string;
    /** View kinds that can use this pipeline. Default: `['3d']`. */
    readonly viewKinds?: readonly ViewKind[];
    readonly create: ViewPipelineFactory;
}
/** Registers a pipeline for `ThreeView.pipeline` to name. Replaces one with the same id. */
export declare function registerPipeline(type: ViewPipelineType): void;
export declare function getPipelineType(id: string): ViewPipelineType | undefined;
export declare function listPipelines(viewKind?: ViewKind): ViewPipelineType[];
/** The pipeline a view kind uses when `ThreeView.pipeline` is empty. */
export declare const DEFAULT_PIPELINES: Record<ViewKind, string>;
