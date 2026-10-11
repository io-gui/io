var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property, Field } from '@io-gui/core';
import { Document } from './Document.js';
import { renderScheduler } from '../render/RenderScheduler.js';
import { OperatorRegistry } from '../tools/Operator.js';
import { Registry } from '../utils/Registry.js';
import { SelectionModel } from '../selection/SelectionModel.js';
import { translateOperatorType } from '../tools/operators/TranslateOperator.js';
import { translateTool } from '../tools/TranslateTool.js';
import { editModeToggleOperatorType, selectModeOperatorType } from '../tools/operators/EditModeOperators.js';
import { renameOperatorType } from '../tools/operators/RenameOperator.js';
import { registerEditorGroups } from '@io-gui/editors';
/**
 * The app object (ADR-0002): one active Document (switchable at runtime), the editor mode,
 * playback, operators and tools. Viewports read `editor.document`; they never hold a document themselves.
 */
let Editor = class Editor extends ReactiveObject {
    _renderer = null;
    /**
     * Operators of this editor; built-ins (`transform.translate`, `object.editmode_toggle`, `mesh.select_mode`,
     * `object.rename`) are registered.
     */
    operators = new OperatorRegistry(this)
        .register(translateOperatorType)
        .register(editModeToggleOperatorType)
        .register(selectModeOperatorType)
        .register(renameOperatorType);
    /** Tools of this editor; built-ins (`transform.translate`) are registered but not active. */
    tools = new Registry().register(translateTool);
    constructor(args) {
        super({ ...args, document: args?.document ?? new Document() });
        this.isPlayingChanged();
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
            change.oldValue.clearChanges();
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
            const timeline = this.document.timeline;
            // Playing a timeline that stopped at its end starts it over.
            if (!timeline.loop && timeline.currentTime >= timeline.duration)
                timeline.currentTime = 0;
            renderScheduler.addTicker(this);
        }
        else {
            renderScheduler.removeTicker(this);
        }
    }
    /** Advances the active document's timeline by the frame delta; a timeline that stops at its end pauses the editor. */
    tick(frame) {
        if (!this.isPlaying)
            return;
        this.onAnimate(frame.delta, frame.time);
        if (!this.document.timeline.advance(frame.delta))
            this.isPlaying = false;
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
    /** Called each frame while playing, before the document advances. `time` is the scheduler clock, not document time. */
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
    Property({ type: Document })
], Editor.prototype, "document", void 0);
__decorate([
    Property({ type: String, value: 'object' })
], Editor.prototype, "mode", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], Editor.prototype, "isPlaying", void 0);
__decorate([
    Property({ type: Object, init: null })
], Editor.prototype, "activeTools", void 0);
__decorate([
    Property({ type: SelectionModel })
], Editor.prototype, "selection", void 0);
__decorate([
    Field(Map)
], Editor.prototype, "_selections", void 0);
Editor = __decorate([
    Register
], Editor);
export { Editor };
// Session and runtime state of the editor stay out of property editors that show an editor subclass.
registerEditorGroups(Editor, {
    Hidden: [new RegExp(/^_/), 'isPlaying', 'document', 'selection', 'mode', 'activeTools', 'operators', 'tools'],
});
