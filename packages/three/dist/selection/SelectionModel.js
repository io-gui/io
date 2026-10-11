var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { Object3D } from 'three/webgpu';
import { ComponentSet } from './ComponentSet.js';
/**
 * Session selection of one document (ADR-0007): object uuids, the active object, and component bitsets per
 * object per domain. Not document data, so it never syncs to other users. Changes go through `edit()`; one
 * commit bumps `version` once and sends one `'selection'` change, so views and inspectors update once per
 * gesture, not per object. Component sets stay when their object is deselected (like Blender's mesh select
 * flags) and are meaningful only for the topology they were made for (`ComponentSet.size`).
 */
let SelectionModel = class SelectionModel extends ReactiveObject {
    /** The component domain edit mode returns to (`domain` is `'object'` outside edit mode). */
    componentDomain = 'point';
    _objects = new Set();
    _components = new Map();
    /** Selected ids no longer in the document, dropped from the selection after the current task. */
    _missing = new Set();
    constructor(args) {
        super(args);
        this.document.addEventListener('commit', this._onCommit);
    }
    get size() {
        return this._objects.size;
    }
    has(uuid) {
        return this._objects.has(uuid);
    }
    /** Selected uuids in selection order. */
    ids() {
        return [...this._objects];
    }
    /** Selected objects that are still in the document. */
    getObjects() {
        const objects = [];
        for (const uuid of this._objects) {
            const object = this.document.getObject(uuid);
            if (object)
                objects.push(object);
            else
                this._dropLater(uuid);
        }
        return objects;
    }
    /** Selected objects without a selected ancestor: what transforms move, so children are not moved twice. */
    getRootObjects() {
        return this.getObjects().filter(object => {
            for (let node = object.parent; node; node = node.parent)
                if (this._objects.has(node.uuid))
                    return false;
            return true;
        });
    }
    getActiveObject() {
        if (!this.active)
            return undefined;
        const object = this.document.getObject(this.active);
        if (!object)
            this._dropLater(this.active);
        return object;
    }
    /** Selected components of one object in one domain. Do not modify; use `edit().components()`. */
    getComponents(uuid, domain = this.domain) {
        return this._components.get(uuid)?.get(domain);
    }
    /** uuids of objects with selected components (in `domain`, or in any domain). */
    componentIds(domain) {
        const ids = [];
        for (const [uuid, sets] of this._components)
            if (!domain || sets.has(domain))
                ids.push(uuid);
        return ids;
    }
    edit() {
        return new SelectionEdit(this, this._objects, this.active, this.domain, this._components);
    }
    /** Replaces the selection; the last id becomes active unless `active` is given. */
    set(uuids, active) {
        this.edit().set(uuids, active).commit();
    }
    clear() {
        this.edit().clear().commit();
    }
    /** @internal Applies a committed edit. `components` holds only the sets the edit touched (empty = none). */
    _apply(objects, active, domain, components) {
        const changed = new Set([...this._objects, ...objects].filter(uuid => this._objects.has(uuid) !== objects.has(uuid)));
        for (const [uuid, sets] of components) {
            for (const [setDomain, set] of sets) {
                const current = this.getComponents(uuid, setDomain);
                if (current ? current.equals(set) : set.isEmpty())
                    continue;
                changed.add(uuid);
                let own = this._components.get(uuid);
                if (set.isEmpty()) {
                    own?.delete(setDomain);
                    if (own && !own.size)
                        this._components.delete(uuid);
                }
                else {
                    if (!own)
                        this._components.set(uuid, own = new Map());
                    own.set(setDomain, set);
                }
            }
        }
        if (!changed.size && active === this.active && domain === this.domain)
            return false;
        this._objects.clear();
        for (const uuid of objects)
            this._objects.add(uuid);
        this.setProperties({
            active, domain, version: this.version + 1,
            activeObject: this.document.getObject(active),
        });
        this.document.notify({ kind: 'selection', ids: changed.size ? [...changed] : [active] });
        return true;
    }
    dispose() {
        // A disposed document has dropped its listeners already.
        if (!this.document._disposed)
            this.document.removeEventListener('commit', this._onCommit);
        super.dispose();
    }
    /**
     * Drops a selected id whose object was removed outside a transaction. Deferred, so a lookup made while
     * drawing or iterating the selection does not change it underneath.
     */
    _dropLater(uuid) {
        if (this._missing.has(uuid))
            return;
        this._missing.add(uuid);
        if (this._missing.size > 1)
            return;
        queueMicrotask(() => {
            this._forget([...this._missing].filter(id => this._objects.has(id) && !this.document.getObject(id)));
            this._missing.clear();
        });
    }
    /** Objects removed from the document leave the selection, with their components. */
    _onCommit = (event) => {
        const ids = [];
        for (const patch of event.detail.patches) {
            if (patch.op === 'remove')
                patch.object.traverse(child => { if (this._objects.has(child.uuid) || this._components.has(child.uuid))
                    ids.push(child.uuid); });
        }
        this._forget(ids);
    };
    _forget(ids) {
        if (ids.length)
            this.edit().remove(ids).clearComponents(undefined, ids).commit();
    }
};
__decorate([
    Property({ type: String, value: 'object' })
], SelectionModel.prototype, "domain", void 0);
__decorate([
    Property({ type: Number, value: 0 })
], SelectionModel.prototype, "version", void 0);
__decorate([
    Property({ type: String, value: '' })
], SelectionModel.prototype, "active", void 0);
__decorate([
    Property({ type: Object3D, value: undefined })
], SelectionModel.prototype, "activeObject", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], SelectionModel.prototype, "uvSync", void 0);
SelectionModel = __decorate([
    Register
], SelectionModel);
export { SelectionModel };
/**
 * A pending selection change. Nothing is visible until `commit()`.
 */
export class SelectionEdit {
    _model;
    _objects;
    _active;
    _domain;
    _source;
    /** Sets this edit has copied or replaced. */
    _components = new Map();
    constructor(model, objects, active, domain, components) {
        this._model = model;
        this._objects = new Set(objects);
        this._active = active;
        this._domain = domain;
        this._source = components;
    }
    get domain() {
        return this._domain;
    }
    setDomain(domain) {
        this._domain = domain;
        return this;
    }
    /**
     * A writable copy of one object's set in `domain`, made for a domain of `size` elements. An existing set
     * of another size (made for an older topology) is replaced by an empty one.
     */
    components(uuid, domain, size) {
        let sets = this._components.get(uuid);
        let set = sets?.get(domain);
        if (set && set.size === size)
            return set;
        const source = this._source.get(uuid)?.get(domain);
        set = source && source.size === size ? source.clone() : new ComponentSet(size);
        if (!sets)
            this._components.set(uuid, sets = new Map());
        sets.set(domain, set);
        return set;
    }
    /** The set as this edit currently sees it (copied or not). */
    peekComponents(uuid, domain) {
        return this._components.get(uuid)?.get(domain) ?? this._source.get(uuid)?.get(domain);
    }
    /** Clears component sets of `domain` (or of every domain) on every object, or on `uuids` only. */
    clearComponents(domain, uuids) {
        const ids = uuids ? [...uuids] : [...new Set([...this._source.keys(), ...this._components.keys()])];
        for (const uuid of ids) {
            const domains = new Set([...(this._source.get(uuid)?.keys() ?? []), ...(this._components.get(uuid)?.keys() ?? [])]);
            for (const setDomain of domains) {
                if (domain && setDomain !== domain)
                    continue;
                const current = this.peekComponents(uuid, setDomain);
                if (current)
                    this.components(uuid, setDomain, current.size).clear();
            }
        }
        return this;
    }
    add(uuids) {
        for (const uuid of typeof uuids === 'string' ? [uuids] : uuids)
            this._objects.add(uuid);
        return this;
    }
    remove(uuids) {
        for (const uuid of typeof uuids === 'string' ? [uuids] : uuids) {
            this._objects.delete(uuid);
            if (this._active === uuid)
                this._active = '';
        }
        return this;
    }
    toggle(uuids) {
        for (const uuid of typeof uuids === 'string' ? [uuids] : uuids) {
            if (this._objects.has(uuid))
                this.remove(uuid);
            else
                this._objects.add(uuid);
        }
        return this;
    }
    set(uuids, active) {
        this._objects.clear();
        let last = '';
        for (const uuid of uuids) {
            this._objects.add(uuid);
            last = uuid;
        }
        this._active = active ?? last;
        return this;
    }
    clear() {
        this._objects.clear();
        this._active = '';
        return this;
    }
    setActive(uuid) {
        if (uuid)
            this._objects.add(uuid);
        this._active = uuid;
        return this;
    }
    /** Applies the edit. Returns false when nothing changed (no version bump, no notification). */
    commit() {
        if (this._active && !this._objects.has(this._active))
            this._active = '';
        return this._model._apply(this._objects, this._active, this._domain, this._components);
    }
}
