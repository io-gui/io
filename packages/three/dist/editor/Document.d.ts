import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { Object3D, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu';
import { Patch } from './Patch.js';
import { Transaction } from './Transaction.js';
import { Timeline } from './Timeline.js';
export type DocumentProps = ReactiveObjectProps & {
    scene?: Scene;
    toneMapping?: ToneMapping;
    toneMappingExposure?: number;
    timeline?: Timeline;
};
export type ChangeKind = 'transform' | 'geometry' | 'material' | 'structure' | 'selection' | 'settings' | 'time' | 'other';
/**
 * A typed record of something that changed in a document.
 * Views decide whether a change concerns them (`listens(change)`) and get tagged for redraw.
 */
export interface DocumentChange {
    kind: ChangeKind;
    /** The document the change belongs to. */
    source: Document;
    /** Stable ids (`Object3D.uuid`) of the objects that changed, when known. */
    ids?: readonly string[];
}
/**
 * The content of an Editor (ADR-0002): the scene of authored objects plus scene render settings.
 * Edits go through transactions of invertible patches (ADR-0008); every applied patch is queued as a
 * change, so views redraw without extra calls. Each committed transaction is dispatched as a
 * `commit` event with the transaction as `detail` (future undo stack and sync).
 */
export declare class Document extends ReactiveObject {
    scene: Scene;
    toneMapping: ToneMapping;
    toneMappingExposure: number;
    /**
     * The document's own clock. Every change of its `currentTime` runs `onAnimate`, whether it comes from playback,
     * scrubbing, stepping or a plain assignment.
     */
    timeline: Timeline;
    /** Stable id of this document, used to key per-document session state (selection, view navigation). */
    readonly uuid: string;
    /** Past this many undrained changes (nothing draws the document), the queue collapses to one `other` change. */
    static readonly CHANGE_LIMIT = 10000;
    /** Changes not yet drained by the RenderScheduler. A Field: `mutated()` reports settings from inside the base constructor. */
    private _changes;
    private readonly _index;
    /** Ids not found since the last index rebuild; cleared when the current task ends. */
    private readonly _misses;
    private _active;
    private readonly _history;
    /** Renderers `onRendererInitialized` has run for. */
    private readonly _renderers;
    /** The timeline time `onAnimate` last ran for. A Field: `timelineChanged` can run inside the base constructor. */
    private _animatedTime;
    constructor(args?: DocumentProps);
    timelineChanged(): void;
    timelineMutated(): void;
    /** Committed transactions, oldest first, up to the last 100. Not an undo stack (plan Phase 8). */
    get history(): readonly Transaction[];
    get activeTransaction(): Transaction | null;
    /** Queues a change; the RenderScheduler drains it next frame. Cheap, and dispatches nothing. */
    notify(change: Omit<DocumentChange, 'source'>): void;
    get hasPendingChanges(): boolean;
    /** Returns and empties the queued changes. Called by the RenderScheduler once per frame. */
    drainChanges(): DocumentChange[];
    /** Drops undrained changes (the document is no longer shown). */
    clearChanges(): void;
    /**
     * Finds a scene object by uuid. Objects added outside transactions are found too: a miss rebuilds the
     * index, but an id that already missed in the current task does not walk the scene again.
     */
    getObject(uuid: string): Object3D | undefined;
    /** Opens a long-running transaction (an interactive drag). Commit or roll it back when done. */
    begin(label?: string): Transaction;
    /**
     * Runs `edit` in a transaction and commits it, or rolls it back if `edit` throws.
     * Inside an open transaction, `edit` joins it instead.
     */
    transact<T>(edit: (transaction: Transaction) => T, label?: string): T;
    /** Applies the inverse of a committed transaction. The future undo stack builds on this. */
    revert(transaction: Transaction): void;
    /** Re-applies a committed transaction's patches (redo). */
    reapply(transaction: Transaction): void;
    /**
     * Called once per renderer, when it is ready and about to draw this document for the first time
     * (a document opened later still gets it). Do GPU setup here: compute passes, PMREM environments.
     */
    onRendererInitialized(renderer: WebGPURenderer): void;
    /**
     * Called on every change of `timeline.currentTime`: each frame while the editor plays, and whenever the timeline is
     * scrubbed, stepped or set. `delta` is the change in seconds, negative when time goes back (scrubbing back, a loop
     * wrap); `time` is the new current time. Time-driven content derives its state from `time`; content that can only
     * integrate (mixers) advances by `delta`. Live content, whose state builds up from interaction, advances only on
     * positive `delta` (ADR-0009). Views redraw after it; scene writes here bypass transactions.
     */
    onAnimate(delta: number, time: number): void;
    mutated(): void;
    /** Runs `onAnimate` with the timeline time elapsed since it last ran, and reports a `time` change. */
    private _animate;
    /** @internal Called by viewports before each draw; runs `onRendererInitialized` once per renderer. */
    _prepareRenderer(renderer: WebGPURenderer): void;
    /** @internal Applies a patch and reports it. */
    _applyPatch(patch: Patch): void;
    /** @internal */
    _applyInverse(patches: readonly Patch[]): void;
    /** @internal */
    _onPatchApplied(patch: Patch): void;
    /** @internal */
    _endTransaction(transaction: Transaction): void;
    private _rebuildIndex;
}
