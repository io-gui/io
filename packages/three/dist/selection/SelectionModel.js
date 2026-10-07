var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
/**
 * Session selection of one document (ADR-0007): object uuids plus the active object. Not document data,
 * so it never syncs to other users. Changes go through `edit()`; one commit bumps `version` once and sends
 * one `'selection'` change, so views and inspectors update once per gesture, not per object.
 */
let SelectionModel = class SelectionModel extends ReactiveObject {
    _objects = new Set();
    constructor(args) {
        super(args);
        this.document.addCommitListener(this._onCommit);
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
        return this.active ? this.document.getObject(this.active) : undefined;
    }
    edit() {
        return new SelectionEdit(this, this._objects, this.active);
    }
    /** Replaces the selection; the last id becomes active unless `active` is given. */
    set(uuids, active) {
        this.edit().set(uuids, active).commit();
    }
    clear() {
        this.edit().clear().commit();
    }
    /** @internal Applies a committed edit. */
    _apply(objects, active) {
        const same = objects.size === this._objects.size && [...objects].every(uuid => this._objects.has(uuid));
        if (same && active === this.active)
            return false;
        const changed = new Set([...this._objects, ...objects].filter(uuid => this._objects.has(uuid) !== objects.has(uuid)));
        this._objects.clear();
        for (const uuid of objects)
            this._objects.add(uuid);
        this.setProperties({ active, version: this.version + 1 });
        this.document.notify({ kind: 'selection', ids: changed.size ? [...changed] : [active] });
        return true;
    }
    dispose() {
        this.document.removeCommitListener(this._onCommit);
        super.dispose();
    }
    /** Objects removed from the document leave the selection. */
    _onCommit = (transaction) => {
        const removed = transaction.patches.filter(patch => patch.op === 'remove').map(patch => patch.op === 'remove' ? patch.object : null);
        const ids = [];
        for (const object of removed)
            object?.traverse(child => { if (this._objects.has(child.uuid))
                ids.push(child.uuid); });
        if (ids.length)
            this.edit().remove(ids).commit();
    };
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
    constructor(model, objects, active) {
        this._model = model;
        this._objects = new Set(objects);
        this._active = active;
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
        return this._model._apply(this._objects, this._active);
    }
}
