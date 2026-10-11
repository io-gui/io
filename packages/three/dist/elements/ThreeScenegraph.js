var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, Field, ReactiveElement } from '@io-gui/core';
import { Editor } from '../editor/Editor.js';
import { SelectionModel } from '../selection/SelectionModel.js';
import { renderScheduler } from '../render/RenderScheduler.js';
import { selectObjects } from '../input/behaviors/SelectBehavior.js';
import { getObjectIcon } from '../icons/objectIcons.js';
import { threeScenegraphItem } from './ThreeScenegraphItem.js';
/** Past this many entries `disclosure` drops the oldest: uuids of objects that are gone (reloaded examples) pile up. */
export const DISCLOSURE_LIMIT = 1000;
/**
 * A collapsible tree of the editor document's scene. Each row shows an object's type icon (`getObjectIcon`) and its
 * name, or `<ClassName>` when it has none. Everything starts expanded; `disclosure` keeps what the user collapsed, by
 * uuid. Rows highlight the editor's selection, the active object strongest; clicking a row selects its object as a
 * viewport click would (Shift toggles, Ctrl removes). A new active object, from anywhere, is revealed: its ancestors
 * expand and its row scrolls into view. Double-click or F2 renames an object through the `object.rename` operator.
 * Follows `editor.document` and refreshes on its `structure` changes and renames, also those made outside
 * transactions that are reported with `notify()`.
 */
let ThreeScenegraph = class ThreeScenegraph extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: grid;
        /* As wide as the widest row, at least the panel: deep or long rows scroll horizontally. */
        grid-template-columns: minmax(max-content, auto);
        align-content: start;
        overflow: auto;
        padding: var(--io_spacing) 0;
        @apply --io-unselectable;
      }
    `;
    }
    static get Listeners() {
        return {
            'three-scenegraph-select': 'onSelectObject',
            'three-scenegraph-toggle': 'onToggleObject',
            'three-scenegraph-rename-start': 'onRenameStart',
            'three-scenegraph-rename-end': 'onRenameEnd',
        };
    }
    constructor(args) { super(args); }
    /** The document whose changes the scheduler hands to `onDocumentChanges`. */
    get document() {
        return this.editor?.document ?? null;
    }
    connectedCallback() {
        super.connectedCallback();
        renderScheduler.addListener(this);
        // Changes made while disconnected were not seen.
        this.debounce(this.mutated);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        renderScheduler.removeListener(this);
    }
    isExpanded(object) {
        return this.disclosure[object.uuid] ?? true;
    }
    setExpanded(object, expanded) {
        this._setExpanded([object], expanded);
    }
    /** Expands the ancestors of `object` and scrolls its row into view. */
    reveal(object) {
        const ancestors = [];
        for (let parent = object.parent; parent; parent = parent.parent)
            ancestors.push(parent);
        this._scrollTarget = object;
        this._setExpanded(ancestors, true);
        this.debounce(this.mutated);
    }
    /** Shows a name field on the object's row, scrolled into view. */
    startRename(object) {
        this._scrollTarget = object;
        this.renamingId = object.uuid;
    }
    /** Renames the object being renamed (through the `object.rename` operator), or with `null` keeps its name. */
    endRename(name) {
        const id = this.renamingId;
        if (!id)
            return;
        if (name !== null)
            this.editor.operators.run('object.rename', { id, name });
        this.renamingId = '';
    }
    onSelectObject(event) {
        event.stopPropagation();
        const { object, mode } = event.detail;
        selectObjects(this.editor.selection, mode, [object.uuid], object.uuid);
    }
    onToggleObject(event) {
        event.stopPropagation();
        const object = event.detail.object;
        this.setExpanded(object, !this.isExpanded(object));
    }
    onRenameStart(event) {
        event.stopPropagation();
        this.startRename(event.detail.object);
    }
    onRenameEnd(event) {
        event.stopPropagation();
        this.endRename(event.detail.name);
    }
    onDocumentChanges(changes) {
        // `other` covers renames; `settings` a replaced scene.
        if (changes.some(change => change.kind === 'structure' || change.kind === 'other' || change.kind === 'settings')) {
            this.debounce(this.mutated);
        }
    }
    editorChanged() {
        this.selection = this.editor.selection;
    }
    /** The editor switched documents (and selections), or changed mode or playback. */
    editorMutated() {
        this.selection = this.editor.selection;
        if (this.renamingId && !this.editor.document.getObject(this.renamingId))
            this.renamingId = '';
        this._revealActive();
        this.debounce(this.mutated);
    }
    selectionMutated() {
        this._revealActive();
        this.debounce(this.mutated);
    }
    mutated() {
        const selection = this.editor.selection;
        const rows = [];
        const addRows = (object, depth) => {
            const hasChildren = object.children.length > 0;
            const expanded = hasChildren && this.isExpanded(object);
            rows.push(threeScenegraphItem({
                object,
                depth,
                hasChildren,
                expanded,
                icon: getObjectIcon(object),
                label: object.name || `<${object.constructor.name}>`,
                selected: selection.has(object.uuid),
                active: selection.active === object.uuid,
                renaming: this.renamingId === object.uuid,
            }));
            if (expanded)
                for (const child of object.children)
                    addRows(child, depth + 1);
        };
        addRows(this.editor.document.scene, 0);
        this.render(rows);
        const target = this._scrollTarget;
        if (target) {
            this._scrollTarget = undefined;
            const row = [...this.children].find(row => row.object === target);
            if (row)
                this._scrollToRow(row);
        }
    }
    dispose() {
        renderScheduler.removeListener(this);
        super.dispose();
    }
    /** Reveals the selection's active object when it changed since the last reveal. */
    _revealActive() {
        const active = this.editor.selection.active;
        if (active === this._revealedId)
            return;
        this._revealedId = active;
        const object = active ? this.editor.document.getObject(active) : undefined;
        if (object)
            this.reveal(object);
    }
    /** Scrolls the least that shows the row, then its label (deep rows are wider than the view). */
    _scrollToRow(row) {
        row.scrollIntoView({ block: 'nearest' });
        row.lastElementChild.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    _setExpanded(objects, expanded) {
        const changed = objects.filter(object => this.isExpanded(object) !== expanded);
        if (!changed.length)
            return;
        const disclosure = { ...this.disclosure };
        for (const object of changed) {
            if (expanded)
                delete disclosure[object.uuid];
            else
                disclosure[object.uuid] = false;
        }
        const uuids = Object.keys(disclosure);
        for (let i = 0; i < uuids.length - DISCLOSURE_LIMIT; i++)
            delete disclosure[uuids[i]];
        this.disclosure = disclosure;
    }
};
__decorate([
    Property({ type: Editor })
], ThreeScenegraph.prototype, "editor", void 0);
__decorate([
    Property({ type: SelectionModel })
], ThreeScenegraph.prototype, "selection", void 0);
__decorate([
    Property({ type: Object, init: null })
], ThreeScenegraph.prototype, "disclosure", void 0);
__decorate([
    Property({ type: String, value: '' })
], ThreeScenegraph.prototype, "renamingId", void 0);
__decorate([
    Field('tree')
], ThreeScenegraph.prototype, "role", void 0);
__decorate([
    Field('true')
], ThreeScenegraph.prototype, "ariaMultiSelectable", void 0);
__decorate([
    Field('')
], ThreeScenegraph.prototype, "_revealedId", void 0);
ThreeScenegraph = __decorate([
    Register
], ThreeScenegraph);
export { ThreeScenegraph };
export const threeScenegraph = function (arg0) {
    return ThreeScenegraph.vConstructor(arg0);
};
