import { Scene, WebGPURenderer } from 'three/webgpu';
import type { Document, DocumentChange } from '../editor/Document.js';
export type DirtyReason = 'content' | 'view' | 'overlay' | 'resize' | 'continuous';
export interface FrameInfo {
    frame: number;
    delta: number;
    time: number;
}
export interface ViewRenderResult {
    /** `false` keeps the view tagged `continuous` (progressive pipelines). */
    converged: boolean;
}
/**
 * What the scheduler needs from a view. Implemented by `ThreeViewport`.
 */
export interface ScheduledView {
    readonly renderer: WebGPURenderer;
    /** Scene evaluated once per frame before any view draws it. */
    readonly scene: Scene | null;
    /** The document whose changes the scheduler drains for this view. */
    readonly document: Document | null;
    isRenderable(): boolean;
    /** Higher draws first: focused 2, hovered 1, other 0. Each frame a view waits past the budget adds 1. */
    getPriority(): number;
    /** How a change affects this view: `true` or `'content'` redraws it, `'overlay'` redraws only overlays. */
    listens(change: DocumentChange): boolean | DirtyReason;
    renderView(reasons: ReadonlySet<DirtyReason>, frame: FrameInfo): ViewRenderResult | void;
    onRendererError?(error: Error): void;
}
/**
 * Anything advanced by the scheduler clock while playing, such as a playing Editor.
 */
export interface ScheduledTicker {
    /** The document whose changes the scheduler drains after the tick. */
    readonly document: Document;
    tick(frame: FrameInfo): void;
}
/**
 * Anything besides views that follows a document's changes, such as the scene graph. Each frame the scheduler hands it
 * the changes it drained from that document.
 */
export interface ChangeListener {
    /** The document whose changes it gets. The scheduler drains it even when no view shows it. */
    readonly document: Document | null;
    onDocumentChanges(changes: readonly DocumentChange[]): void;
}
export type RenderSchedulerOptions = {
    /** Start a requestAnimationFrame loop when the first view or ticker is added. Default true. */
    autoStart?: boolean;
    /** Milliseconds of draw time per frame before remaining views wait for the next frame. */
    frameBudget?: number;
    now?: () => number;
};
/**
 * The only thing that renders (ADR-0003). Each frame it collects changes into typed dirty tags (and hands them to
 * change listeners), ticks playing editors, evaluates each scene once and draws tagged views within a frame budget.
 */
export declare class RenderScheduler {
    frameBudget: number;
    private readonly _views;
    /** Frames each tagged view has waited past the budget. Added to its priority so no view starves. */
    private readonly _waits;
    private readonly _tickers;
    private readonly _listeners;
    private readonly _rendererStates;
    private readonly _timer;
    private readonly _autoStart;
    private readonly _now;
    private _frame;
    private _running;
    constructor(options?: RenderSchedulerOptions);
    register(view: ScheduledView): void;
    unregister(view: ScheduledView): void;
    isRegistered(view: ScheduledView): boolean;
    tag(view: ScheduledView, reason: DirtyReason): void;
    getTags(view: ScheduledView): ReadonlySet<DirtyReason>;
    addTicker(ticker: ScheduledTicker): void;
    removeTicker(ticker: ScheduledTicker): void;
    addListener(listener: ChangeListener): void;
    removeListener(listener: ChangeListener): void;
    getRendererState(renderer: WebGPURenderer): "pending" | "ready" | "failed" | undefined;
    /**
     * Runs one frame. Called by the rAF loop; tests call it directly with `autoStart: false`.
     */
    step(timestamp?: number): void;
    private _collect;
    private _initRenderer;
    private _setRendererReady;
    private _setRendererFailed;
    private _start;
    private _onFrame;
}
/**
 * The shared WebGPURenderer used by viewports that are not given their own (ADR-0001).
 */
export declare function getDefaultRenderer(): WebGPURenderer;
export declare const renderScheduler: RenderScheduler;
