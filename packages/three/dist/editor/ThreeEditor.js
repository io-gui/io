var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property, Field } from '@io-gui/core';
import { ThreeDocument } from './ThreeDocument.js';
import { renderScheduler } from '../render/RenderScheduler.js';
import { OperatorRegistry } from '../tools/Operator.js';
import { Registry } from '../utils/Registry.js';
import { SelectionModel } from '../selection/SelectionModel.js';
import { translateOperatorType } from '../tools/operators/TranslateOperator.js';
import { translateTool } from '../tools/TranslateTool.js';
import { editModeToggleOperatorType, selectModeOperatorType } from '../tools/operators/EditModeOperators.js';
import { registerEditorGroups } from '@io-gui/editors';
/**
 * The app object (ADR-0002): one active ThreeDocument (switchable at runtime), the editor mode,
 * playback, operators and tools. Viewports read `editor.document`; they never hold a document themselves.
 */
let ThreeEditor = class ThreeEditor extends ReactiveObject {
    _renderer = null;
    /** Operators of this editor; built-ins (`transform.translate`, `object.editmode_toggle`, `mesh.select_mode`) are registered. */
    operators = new OperatorRegistry(this)
        .register(translateOperatorType)
        .register(editModeToggleOperatorType)
        .register(selectModeOperatorType);
    /** Tools of this editor; built-ins (`transform.translate`) are registered but not active. */
    tools = new Registry().register(translateTool);
    constructor(args) {
        super({ ...args, document: args?.document ?? new ThreeDocument() });
        this.isPlayingChanged();
    }
    /** The active document's change bus; the scheduler drains it each frame. */
    get changeBus() {
        return this.document.changeBus;
    }
    setActiveTool(viewKind, mode, toolId) {
        const activeTools = { ...this.activeTools };
        if (toolId)
            activeTools[`${viewKind}:${mode}`] = toolId;
        else
            delete activeTools[`${viewKind}:${mode}`];
        this.activeTools = activeTools;
    }
    getActiveTool(viewKind, mode = this.mode) {
        const id = this.activeTools[`${viewKind}:${mode}`];
        return id ? this.tools.get(id) ?? null : null;
    }
    documentChanged(change) {
        if (change.oldValue) {
            this.operators.cancelRunning();
            // Views tag themselves for the new document; changes left for the old one would never be drained.
            change.oldValue.changeBus.clear();
        }
        if (change.value)
            this.selection = this._selectionFor(change.value);
    }
    _selectionFor(document) {
        let selection = this._selections.get(document.uuid);
        if (!selection) {
            selection = new SelectionModel({ document });
            this._selections.set(document.uuid, selection);
        }
        return selection;
    }
    isPlayingChanged() {
        if (this.isPlaying) {
            renderScheduler.addTicker(this);
        }
        else {
            renderScheduler.removeTicker(this);
        }
    }
    tick(frame) {
        if (!this.isPlaying)
            return;
        this.onAnimate(frame.delta, frame.time);
        this.document.onAnimate(frame.delta, frame.time);
        this.document.notify({ kind: 'time' });
    }
    /** Reports a change in the active document (the source is always the document). */
    notify(change) {
        this.document.notify(change);
    }
    /** Redraws every view showing the active document on the next frame. */
    requestRender() {
        this.document.notify({ kind: 'other' });
    }
    isRendererInitialized() {
        return !!this._renderer && this._renderer.initialized === true;
    }
    onRendererInitialized(renderer) {
        this._renderer = renderer;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta, time) { }
    dispose() {
        this.operators.cancelRunning();
        for (const selection of this._selections.values())
            selection.dispose();
        this.isPlaying = false;
        renderScheduler.removeTicker(this);
        super.dispose();
    }
};
__decorate([
    Property({ type: ThreeDocument })
], ThreeEditor.prototype, "document", void 0);
__decorate([
    Property({ type: String, value: 'object' })
], ThreeEditor.prototype, "mode", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], ThreeEditor.prototype, "isPlaying", void 0);
__decorate([
    Property({ type: Object, init: null })
], ThreeEditor.prototype, "activeTools", void 0);
__decorate([
    Property({ type: SelectionModel })
], ThreeEditor.prototype, "selection", void 0);
__decorate([
    Field(Map)
], ThreeEditor.prototype, "_selections", void 0);
ThreeEditor = __decorate([
    Register
], ThreeEditor);
export { ThreeEditor };
// Session and runtime state of the editor stay out of property editors that show an editor subclass.
registerEditorGroups(ThreeEditor, {
    Hidden: [new RegExp(/^_/), 'isPlaying', 'changeBus', 'document', 'selection', 'mode', 'activeTools', 'operators', 'tools'],
});
