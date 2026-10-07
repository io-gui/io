var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { ThreeDocument } from './ThreeDocument.js';
import { renderScheduler } from '../render/RenderScheduler.js';
import { OperatorRegistry } from '../tools/Operator.js';
import { ToolRegistry } from '../tools/Tool.js';
import { SelectionModel } from '../selection/SelectionModel.js';
import { translateOperatorType } from '../tools/operators/TranslateOperator.js';
import { translateTool } from '../tools/TranslateTool.js';
import { editModeToggleOperatorType, selectModeOperatorType } from '../tools/operators/EditModeOperators.js';
/**
 * The app object (ADR-0002): one active ThreeDocument (switchable at runtime), the editor mode,
 * playback, operators and tools. Viewports read `editor.document`; they never hold a document themselves.
 */
let ThreeEditor = class ThreeEditor extends ReactiveObject {
    _renderer = null;
    constructor(args) {
        super({ ...args, document: args?.document ?? new ThreeDocument() });
        this.isPlayingChanged();
    }
    /** Operators of this editor; built-ins (`transform.translate`, `object.editmode_toggle`, `mesh.select_mode`) are registered. */
    get operators() {
        if (!this._operators) {
            this._operators = new OperatorRegistry(this);
            this._operators.register(translateOperatorType);
            this._operators.register(editModeToggleOperatorType);
            this._operators.register(selectModeOperatorType);
        }
        return this._operators;
    }
    /** Tools of this editor; built-ins (`transform.translate`) are registered but not active. */
    get tools() {
        if (!this._tools) {
            this._tools = new ToolRegistry();
            this._tools.register(translateTool);
        }
        return this._tools;
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
        if (change.oldValue && change.oldValue !== change.value)
            this._operators?.cancelRunning();
        if (change.value)
            this.selection = this._selectionFor(change.value);
    }
    _selectionFor(document) {
        if (!this._selections)
            this._selections = new Map();
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
        this.document.notify({ kind: 'time' });
    }
    /** Reports a change in the active document (the source is always the document). */
    notify(change) {
        this.document.notify({ kind: change.kind, ids: change.ids });
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
    /**
     * @deprecated Size belongs to each view (ADR-0002). Called when a viewport showing this editor resizes;
     * with several viewports, the last one resized wins.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResized(width, height, viewport) { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta, time) { }
    dispose() {
        this._operators?.cancelRunning();
        for (const selection of this._selections?.values() ?? [])
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
ThreeEditor = __decorate([
    Register
], ThreeEditor);
export { ThreeEditor };
