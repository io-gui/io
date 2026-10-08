import type { Object3D } from 'three/webgpu';
import type { ThreeDocument } from './ThreeDocument.js';
import { Patch } from './Patch.js';
export type TransactionState = 'open' | 'committed' | 'rolledBack';
/**
 * One atomic group of patches: the unit of undo, change notification and sync (ADR-0008).
 * Edits apply immediately (views redraw while a drag is in progress); the old value of every edit is
 * recorded so the transaction can be rolled back or inverted. Repeated writes to one path coalesce into one
 * patch that keeps the first old value and the last new value.
 */
export declare class Transaction {
    readonly document: ThreeDocument;
    readonly label: string;
    readonly patches: Patch[];
    state: TransactionState;
    private readonly _valuePatches;
    constructor(document: ThreeDocument, label?: string);
    /**
     * Assigns `value` to a property path of a document object (by object or uuid). Read-only properties
     * (`position`, `rotation`, `quaternion`, `scale`) throw: write them with `copy`, or set their components.
     */
    set(target: Object3D | string, path: string, value: unknown): void;
    /** Copies `value` into the object a property path holds (`Vector3`, `Euler`, `Color`, ...), keeping its identity. */
    copy(target: Object3D | string, path: string, value: unknown): void;
    /** Adds `object` under `parent` (object or uuid), at `index` or last. */
    insert(parent: Object3D | string, object: Object3D, index?: number): void;
    /** Removes a document object (by object or uuid) from its parent. */
    remove(target: Object3D | string): void;
    commit(): void;
    /** Undoes every edit of this open transaction and closes it. */
    rollback(): void;
    private _write;
    private _assertOpen;
}
