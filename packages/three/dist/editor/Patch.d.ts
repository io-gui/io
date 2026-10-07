import type { Object3D } from 'three/webgpu';
import type { ChangeKind } from './ChangeBus.js';
/**
 * The smallest invertible document edit, addressed by stable id (ADR-0008).
 * `set` paths are dot-separated property paths on the object: `'position'`, `'visible'`, `'material.color'`.
 */
export type Patch = {
    op: 'set';
    id: string;
    path: string;
    value: unknown;
    oldValue: unknown;
} | {
    op: 'insert';
    parentId: string;
    index: number;
    object: Object3D;
} | {
    op: 'remove';
    parentId: string;
    index: number;
    object: Object3D;
};
export declare function changeKindForPatch(patch: Patch): ChangeKind;
export declare function invertPatch(patch: Patch): Patch;
/** Snapshot of a value: math objects are cloned, arrays sliced, everything else kept as is. */
export declare function cloneValue(value: unknown): unknown;
export declare function resolvePath(root: object, path: string): {
    owner: Record<string, unknown>;
    key: string;
};
/**
 * Writes a value in place. Math objects (`Vector3`, `Euler`, `Color`, ...) are copied into the existing
 * instance, because Three.js relies on their identity (`object.position` is read-only).
 */
export declare function writeValue(owner: Record<string, unknown>, key: string, value: unknown): void;
export declare function insertChild(parent: Object3D, object: Object3D, index: number): void;
