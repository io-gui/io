import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import type { Object3D } from 'three/webgpu';
import type { ThreeDocument } from '../editor/ThreeDocument.js';
/** Selection levels (ADR-0007). Only `object` is implemented; component domains arrive with geometry adapters. */
export type SelectionDomain = 'object' | 'point' | 'edge' | 'primitive' | 'corner' | (string & {});
export type SelectionModelProps = ReactiveObjectProps & {
    document: ThreeDocument;
};
/**
 * Session selection of one document (ADR-0007): object uuids plus the active object. Not document data,
 * so it never syncs to other users. Changes go through `edit()`; one commit bumps `version` once and sends
 * one `'selection'` change, so views and inspectors update once per gesture, not per object.
 */
export declare class SelectionModel extends ReactiveObject {
    /** Current select mode. */
    domain: SelectionDomain;
    /** Bumped once per committed change. Bind UI to this, not to the set. */
    version: number;
    /** uuid of the active object, or `''`. */
    active: string;
    uvSync: boolean;
    readonly document: ThreeDocument;
    private readonly _objects;
    constructor(args: SelectionModelProps);
    get size(): number;
    has(uuid: string): boolean;
    /** Selected uuids in selection order. */
    ids(): string[];
    /** Selected objects that are still in the document. */
    getObjects(): Object3D[];
    getActiveObject(): Object3D | undefined;
    edit(): SelectionEdit;
    /** Replaces the selection; the last id becomes active unless `active` is given. */
    set(uuids: Iterable<string>, active?: string): void;
    clear(): void;
    /** @internal Applies a committed edit. */
    _apply(objects: Set<string>, active: string): boolean;
    dispose(): void;
    /** Objects removed from the document leave the selection. */
    private _onCommit;
}
/**
 * A pending selection change. Nothing is visible until `commit()`.
 */
export declare class SelectionEdit {
    private readonly _model;
    private readonly _objects;
    private _active;
    constructor(model: SelectionModel, objects: Set<string>, active: string);
    add(uuids: string | Iterable<string>): this;
    remove(uuids: string | Iterable<string>): this;
    toggle(uuids: string | Iterable<string>): this;
    set(uuids: Iterable<string>, active?: string): this;
    clear(): this;
    setActive(uuid: string): this;
    /** Applies the edit. Returns false when nothing changed (no version bump, no notification). */
    commit(): boolean;
}
