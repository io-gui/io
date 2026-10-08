import type { Object3D } from 'three/webgpu';
import type { ChangeKind } from './ChangeBus.js';
/**
 * An edit of one property path of a document object (dot-separated: `'visible'`, `'position.x'`, `'material.color'`).
 * `set` assigns the property, and its values are the assigned references. `copy` copies into the object the property
 * holds (`Vector3`, `Euler`, `Color`, ...), keeping its identity, and its values are snapshots (clones).
 */
export type ValuePatch = {
    id: string;
    path: string;
    value: unknown;
    oldValue: unknown;
} & ({
    op: 'set';
} | {
    op: 'copy';
});
/** The smallest invertible document edit, addressed by stable id (ADR-0008). */
export type Patch = ValuePatch | {
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
/** The value a patch of `op` records: `copy` snapshots it, since the object it is copied into changes later. */
export declare function patchValue(op: ValuePatch['op'], value: unknown): unknown;
export declare function resolvePath(root: object, path: string): {
    owner: Record<string, unknown>;
    key: string;
};
/**
 * Applies a value patch: `set` assigns, `copy` copies into the held object. Assigning a read-only property
 * (`Object3D.position`, `rotation`, `quaternion`, `scale`) throws; those are written with `copy`.
 */
export declare function writeValue(op: ValuePatch['op'], owner: Record<string, unknown>, key: string, value: unknown): void;
export declare function insertChild(parent: Object3D, object: Object3D, index: number): void;
