var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { MathUtils, NoToneMapping, Scene } from 'three/webgpu';
import { ChangeBus } from './ChangeBus.js';
import { changeKindForPatch, insertChild, invertPatch, resolvePath, writeValue } from './Patch.js';
import { Transaction } from './Transaction.js';
const HISTORY_LIMIT = 100;
/**
 * The content of a ThreeEditor (ADR-0002): the scene of authored objects plus scene render settings.
 * Edits go through transactions of invertible patches (ADR-0008); every applied patch is reported on
 * the change bus, so views redraw without extra calls.
 */
let ThreeDocument = class ThreeDocument extends ReactiveObject {
    /** Stable id of this document, used to key per-document session state (selection, view navigation). */
    uuid = MathUtils.generateUUID();
    changeBus = new ChangeBus();
    _index = new Map();
    _active = null;
    _history = [];
    _commitListeners = new Set();
    constructor(args) {
        super(args);
    }
    /** Committed transactions, oldest first, up to the last 100. Not an undo stack (plan Phase 8). */
    get history() {
        return this._history;
    }
    get activeTransaction() {
        return this._active;
    }
    notify(change) {
        this.changeBus.notify({ ...change, source: this });
    }
    /** Finds a scene object by uuid. Objects added outside transactions are found too. */
    getObject(uuid) {
        const scene = this.scene;
        if (!scene)
            return undefined;
        if (uuid === scene.uuid)
            return scene;
        const cached = this._index.get(uuid);
        if (cached && this._isInScene(cached))
            return cached;
        this._rebuildIndex();
        return this._index.get(uuid);
    }
    /** Opens a long-running transaction (an interactive drag). Commit or roll it back when done. */
    begin(label = '') {
        debug: {
            if (this._active)
                console.error(`ThreeDocument.begin("${label}"): transaction "${this._active.label}" is still open`);
        }
        const transaction = new Transaction(this, label);
        this._active = transaction;
        return transaction;
    }
    /**
     * Runs `edit` in a transaction and commits it, or rolls it back if `edit` throws.
     * Inside an open transaction, `edit` joins it instead.
     */
    transact(edit, label = '') {
        if (this._active)
            return edit(this._active);
        const transaction = this.begin(label);
        try {
            const result = edit(transaction);
            transaction.commit();
            return result;
        }
        catch (error) {
            if (transaction.state === 'open')
                transaction.rollback();
            throw error;
        }
    }
    /** Applies the inverse of a committed transaction. The future undo stack builds on this. */
    revert(transaction) {
        this._applyInverse(transaction.patches);
    }
    /** Re-applies a committed transaction's patches (redo). */
    reapply(transaction) {
        for (const patch of transaction.patches)
            this._applyPatch(patch);
    }
    /** Called with every committed transaction (future undo stack and sync). */
    addCommitListener(listener) {
        this._commitListeners.add(listener);
    }
    removeCommitListener(listener) {
        this._commitListeners.delete(listener);
    }
    mutated() {
        // Also runs inside the base constructor, before class fields exist.
        if (this.changeBus)
            this.notify({ kind: 'settings' });
    }
    /** @internal Applies a patch and reports it. */
    _applyPatch(patch) {
        if (patch.op === 'set') {
            const object = this.getObject(patch.id);
            if (!object)
                throw new Error(`Patch: object ${patch.id} is not in the document`);
            const { owner, key } = resolvePath(object, patch.path);
            writeValue(owner, key, patch.value);
        }
        else {
            const parent = this.getObject(patch.parentId);
            if (!parent)
                throw new Error(`Patch: parent ${patch.parentId} is not in the document`);
            if (patch.op === 'insert') {
                insertChild(parent, patch.object, patch.index);
                patch.object.traverse(object => { this._index.set(object.uuid, object); });
            }
            else {
                parent.remove(patch.object);
                patch.object.traverse(object => { this._index.delete(object.uuid); });
            }
        }
        this._onPatchApplied(patch);
    }
    /** @internal */
    _applyInverse(patches) {
        for (let i = patches.length - 1; i >= 0; i--)
            this._applyPatch(invertPatch(patches[i]));
    }
    /** @internal */
    _onPatchApplied(patch) {
        const id = patch.op === 'set' ? patch.id : patch.object.uuid;
        this.notify({ kind: changeKindForPatch(patch), ids: [id] });
    }
    /** @internal */
    _endTransaction(transaction) {
        if (this._active === transaction)
            this._active = null;
        if (transaction.state !== 'committed' || transaction.patches.length === 0)
            return;
        this._history.push(transaction);
        if (this._history.length > HISTORY_LIMIT)
            this._history.shift();
        for (const listener of this._commitListeners)
            listener(transaction);
    }
    _isInScene(object) {
        let node = object;
        while (node) {
            if (node === this.scene)
                return true;
            node = node.parent;
        }
        return false;
    }
    _rebuildIndex() {
        this._index.clear();
        this.scene?.traverse(object => { this._index.set(object.uuid, object); });
    }
};
__decorate([
    Property({ type: Scene, init: null })
], ThreeDocument.prototype, "scene", void 0);
__decorate([
    Property({ type: Number, value: NoToneMapping })
], ThreeDocument.prototype, "toneMapping", void 0);
__decorate([
    Property({ type: Number, value: 1 })
], ThreeDocument.prototype, "toneMappingExposure", void 0);
ThreeDocument = __decorate([
    Register
], ThreeDocument);
export { ThreeDocument };
