import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { Object3D, Scene, ToneMapping } from 'three/webgpu';
import { ChangeBus, DocumentChange } from './ChangeBus.js';
import { Patch } from './Patch.js';
import { Transaction } from './Transaction.js';
export type ThreeDocumentProps = ReactiveObjectProps & {
    scene?: Scene;
    toneMapping?: ToneMapping;
    toneMappingExposure?: number;
};
/**
 * The content of a ThreeEditor (ADR-0002): the scene of authored objects plus scene render settings.
 * Edits go through transactions of invertible patches (ADR-0008); every applied patch is reported on
 * the change bus, so views redraw without extra calls. Each committed transaction is dispatched as a
 * `commit` event with the transaction as `detail` (future undo stack and sync).
 */
export declare class ThreeDocument extends ReactiveObject {
    scene: Scene;
    toneMapping: ToneMapping;
    toneMappingExposure: number;
    /** Stable id of this document, used to key per-document session state (selection, view navigation). */
    readonly uuid: string;
    /** A Field: `mutated()` reports settings changes from inside the base constructor. */
    readonly changeBus: ChangeBus;
    private readonly _index;
    /** Ids not found since the last index rebuild; cleared when the current task ends. */
    private readonly _misses;
    private _active;
    private readonly _history;
    constructor(args?: ThreeDocumentProps);
    /** Committed transactions, oldest first, up to the last 100. Not an undo stack (plan Phase 8). */
    get history(): readonly Transaction[];
    get activeTransaction(): Transaction | null;
    notify(change: Omit<DocumentChange, 'source'>): void;
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
    mutated(): void;
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
