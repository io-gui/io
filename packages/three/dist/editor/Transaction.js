import { cloneValue, resolvePath, writeValue } from './Patch.js';
/**
 * One atomic group of patches: the unit of undo, change notification and sync (ADR-0008).
 * Edits apply immediately (views redraw while a drag is in progress); the old value of every edit is
 * recorded so the transaction can be rolled back or inverted. Writes to the same path coalesce into one
 * patch that keeps the first old value and the last new value.
 */
export class Transaction {
    document;
    label;
    patches = [];
    state = 'open';
    _setPatches = new Map();
    constructor(document, label = '') {
        this.document = document;
        this.label = label;
    }
    /** Sets a property path on a document object (by object or uuid). */
    set(target, path, value) {
        this._assertOpen();
        const id = typeof target === 'string' ? target : target.uuid;
        const object = this.document.getObject(id);
        if (!object)
            throw new Error(`Transaction.set: object ${id} is not in the document`);
        const { owner, key } = resolvePath(object, path);
        const coalesceKey = `${id}\u0000${path}`;
        const existing = this._setPatches.get(coalesceKey);
        const oldValue = existing ? existing.oldValue : cloneValue(owner[key]);
        writeValue(owner, key, value);
        if (existing) {
            existing.value = cloneValue(value);
            this.document._onPatchApplied(existing);
        }
        else {
            const patch = { op: 'set', id, path, value: cloneValue(value), oldValue };
            this._setPatches.set(coalesceKey, patch);
            this.patches.push(patch);
            this.document._onPatchApplied(patch);
        }
    }
    /** Adds `object` under `parent` (object or uuid), at `index` or last. */
    insert(parent, object, index) {
        this._assertOpen();
        const parentId = typeof parent === 'string' ? parent : parent.uuid;
        const parentObject = this.document.getObject(parentId);
        if (!parentObject)
            throw new Error(`Transaction.insert: parent ${parentId} is not in the document`);
        const patch = { op: 'insert', parentId, index: index ?? parentObject.children.length, object };
        this.document._applyPatch(patch);
        this.patches.push(patch);
    }
    /** Removes a document object (by object or uuid) from its parent. */
    remove(target) {
        this._assertOpen();
        const id = typeof target === 'string' ? target : target.uuid;
        const object = this.document.getObject(id);
        if (!object || !object.parent)
            throw new Error(`Transaction.remove: object ${id} is not in the document`);
        const patch = { op: 'remove', parentId: object.parent.uuid, index: object.parent.children.indexOf(object), object };
        this.document._applyPatch(patch);
        this.patches.push(patch);
    }
    commit() {
        this._assertOpen();
        this.state = 'committed';
        this.document._endTransaction(this);
    }
    /** Undoes every edit of this open transaction and closes it. */
    rollback() {
        this._assertOpen();
        this.document._applyInverse(this.patches);
        this.state = 'rolledBack';
        this.document._endTransaction(this);
    }
    _assertOpen() {
        if (this.state !== 'open')
            throw new Error(`Transaction "${this.label}" is ${this.state}`);
    }
}
