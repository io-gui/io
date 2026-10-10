var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, ReactiveElement, div, span, Register } from '@io-gui/core';
import { ThreeEditor } from './ThreeEditor.js';
let ThreeEditorStatus = class ThreeEditorStatus extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        padding: var(--io_spacing2);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        box-shadow: var(--io_shadowInset);
        color: var(--io_colorBlue);
      }
    `;
    }
    constructor(props) {
        super(props);
        this.editor = props.editor;
    }
    ready() {
        this.editorMutated();
    }
    editorMutated() {
        const document = this.editor.document;
        if (document !== this._document) {
            this._document?.removeEventListener('commit', this.onCommit);
            document.addEventListener('commit', this.onCommit);
            this._document = document;
        }
        this.changed();
    }
    onCommit() {
        this.changed();
    }
    changed() {
        const cmd = this.editor.operators.lastCommand;
        const last = cmd ? `${cmd.name} ${JSON.stringify(cmd.args)}` : 'none';
        this.render([
            div({ class: 'status' }, [span(`Last command: ${last}`)]),
        ]);
    }
};
__decorate([
    Property({ type: ThreeEditor })
], ThreeEditorStatus.prototype, "editor", void 0);
ThreeEditorStatus = __decorate([
    Register
], ThreeEditorStatus);
export { ThreeEditorStatus };
export const threeEditorStatus = (props) => ThreeEditorStatus.vConstructor(props);
