import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import type { Object3D } from 'three/webgpu';
import type { ThreeDocument } from '../editor/ThreeDocument.js';
import { ComponentSet } from './ComponentSet.js';
/**
 * Selection levels (ADR-0007): `object`, then the attribute domains of geometry adapters. `corner` is the
 * UV view's own selection (UVs are stored per triangle corner).
 */
export type SelectionDomain = 'object' | 'point' | 'edge' | 'primitive' | 'corner' | (string & {});
/** Component sets of one object, by domain. */
export type ComponentSets = ReadonlyMap<SelectionDomain, ComponentSet>;
export type SelectionModelProps = ReactiveObjectProps & {
    document: ThreeDocument;
};
/**
 * Session selection of one document (ADR-0007): object uuids, the active object, and component bitsets per
 * object per domain. Not document data, so it never syncs to other users. Changes go through `edit()`; one
 * commit bumps `version` once and sends one `'selection'` change, so views and inspectors update once per
 * gesture, not per object. Component sets stay when their object is deselected (like Blender's mesh select
 * flags) and are meaningful only for the topology they were made for (`ComponentSet.size`).
 */
export declare class SelectionModel extends ReactiveObject {
    /** Current select mode: `'object'`, or the component domain picked in edit mode. */
    domain: SelectionDomain;
    /** Bumped once per committed change. Bind UI to this, not to the set. */
    version: number;
    /** uuid of the active object, or `''`. */
    active: string;
    uvSync: boolean;
    readonly document: ThreeDocument;
    /** The component domain edit mode returns to (`domain` is `'object'` outside edit mode). */
    componentDomain: SelectionDomain;
    private readonly _objects;
    private readonly _components;
    /** Selected ids no longer in the document, dropped from the selection after the current task. */
    private readonly _missing;
    constructor(args: SelectionModelProps);
    get size(): number;
    has(uuid: string): boolean;
    /** Selected uuids in selection order. */
    ids(): string[];
    /** Selected objects that are still in the document. */
    getObjects(): Object3D[];
    /** Selected objects without a selected ancestor: what transforms move, so children are not moved twice. */
    getRootObjects(): Object3D[];
    getActiveObject(): Object3D | undefined;
    /** Selected components of one object in one domain. Do not modify; use `edit().components()`. */
    getComponents(uuid: string, domain?: SelectionDomain): ComponentSet | undefined;
    /** uuids of objects with selected components (in `domain`, or in any domain). */
    componentIds(domain?: SelectionDomain): string[];
    edit(): SelectionEdit;
    /** Replaces the selection; the last id becomes active unless `active` is given. */
    set(uuids: Iterable<string>, active?: string): void;
    clear(): void;
    /** @internal Applies a committed edit. `components` holds only the sets the edit touched (empty = none). */
    _apply(objects: Set<string>, active: string, domain: SelectionDomain, components: Map<string, Map<SelectionDomain, ComponentSet>>): boolean;
    dispose(): void;
    /**
     * Drops a selected id whose object was removed outside a transaction. Deferred, so a lookup made while
     * drawing or iterating the selection does not change it underneath.
     */
    private _dropLater;
    /** Objects removed from the document leave the selection, with their components. */
    private _onCommit;
}
/**
 * A pending selection change. Nothing is visible until `commit()`.
 */
export declare class SelectionEdit {
    private readonly _model;
    private readonly _objects;
    private _active;
    private _domain;
    private readonly _source;
    /** Sets this edit has copied or replaced. */
    private readonly _components;
    constructor(model: SelectionModel, objects: Set<string>, active: string, domain: SelectionDomain, components: ReadonlyMap<string, ReadonlyMap<SelectionDomain, ComponentSet>>);
    get domain(): SelectionDomain;
    setDomain(domain: SelectionDomain): this;
    /**
     * A writable copy of one object's set in `domain`, made for a domain of `size` elements. An existing set
     * of another size (made for an older topology) is replaced by an empty one.
     */
    components(uuid: string, domain: SelectionDomain, size: number): ComponentSet;
    /** The set as this edit currently sees it (copied or not). */
    peekComponents(uuid: string, domain: SelectionDomain): ComponentSet | undefined;
    /** Clears component sets of `domain` (or of every domain) on every object, or on `uuids` only. */
    clearComponents(domain?: SelectionDomain, uuids?: Iterable<string>): this;
    add(uuids: string | Iterable<string>): this;
    remove(uuids: string | Iterable<string>): this;
    toggle(uuids: string | Iterable<string>): this;
    set(uuids: Iterable<string>, active?: string): this;
    clear(): this;
    setActive(uuid: string): this;
    /** Applies the edit. Returns false when nothing changed (no version bump, no notification). */
    commit(): boolean;
}
