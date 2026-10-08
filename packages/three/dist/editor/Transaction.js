import { patchValue, resolvePath, writeValue } from './Patch.js';
/**
 * One atomic group of patches: the unit of undo, change notification and sync (ADR-0008).
 * Edits apply immediately (views redraw while a drag is in progress); the old value of every edit is
 * recorded so the transaction can be rolled back or inverted. Repeated writes to one path coalesce into one
 * patch that keeps the first old value and the last new value.
 */
export class Transaction {
    document;
    label;
    patches = [];
    state = 'open';
    _valuePatches = new Map();
    constructor(document, label = '') {
        this.document = document;
        this.label = label;
    }
    /**
     * Assigns `value` to a property path of a document object (by object or uuid). Read-only properties
     * (`position`, `rotation`, `quaternion`, `scale`) throw: write them with `copy`, or set their components.
     */
    set(target, path, value) {
        this._write('set', target, path, value);
    }
    /** Copies `value` into the object a property path holds (`Vector3`, `Euler`, `Color`, ...), keeping its identity. */
    copy(target, path, value) {
        this._write('copy', target, path, value);
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
    _write(op, target, path, value) {
        this._assertOpen();
        const id = typeof target === 'string' ? target : target.uuid;
        const object = this.document.getObject(id);
        if (!object)
            throw new Error(`Transaction.${op}: object ${id} is not in the document`);
        const { owner, key } = resolvePath(object, path);
        // Writes coalesce into the path's last patch when they repeat its op; mixing set and copy keeps the order.
        const coalesceKey = `${id}\u0000${path}`;
        const last = this._valuePatches.get(coalesceKey);
        const existing = last?.op === op ? last : undefined;
        const oldValue = existing ? existing.oldValue : patchValue(op, owner[key]);
        writeValue(op, owner, key, value);
        const patch = existing ?? { op, id, path, value, oldValue };
        patch.value = patchValue(op, value);
        if (!existing) {
            this._valuePatches.set(coalesceKey, patch);
            this.patches.push(patch);
        }
        this.document._onPatchApplied(patch);
    }
    _assertOpen() {
        if (this.state !== 'open')
            throw new Error(`Transaction "${this.label}" is ${this.state}`);
    }
}
