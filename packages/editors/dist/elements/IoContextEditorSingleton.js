var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoOverlaySingleton, nudge, ReactiveProperty, Register } from '@io-gui/core';
import { IoPropertyEditor } from './IoPropertyEditor.js';
let IoContextEditor = class IoContextEditor extends IoPropertyEditor {
    static get Style() {
        return /* css */ `
      :host {
        z-index: 2;
      }
      :host:not([expanded]) {
      visibility: hidden;
    }
    `;
    }
    static get Listeners() {
        return {
            'keydown': 'onKeydown',
            'io-focus-to': 'onIoFocusTo',
        };
    }
    onKeydown(event) {
        if (event.key === 'Escape' || event.key === 'Enter') {
            event.preventDefault();
            this.expanded = false;
        }
    }
    onIoFocusTo(event) {
        const source = event.detail.source;
        const cmd = event.detail.command;
        const siblings = Array.from(this.querySelectorAll('[tabindex="0"]'));
        const index = [...siblings].indexOf(source);
        let cmdOverride = '';
        if (this.horizontal) {
            if (cmd === 'ArrowRight')
                cmdOverride = 'next';
            if (cmd === 'ArrowLeft')
                cmdOverride = 'prev';
        }
        else {
            if (cmd === 'ArrowDown')
                cmdOverride = 'next';
            if (cmd === 'ArrowUp')
                cmdOverride = 'prev';
        }
        if (cmdOverride) {
            if (cmdOverride === 'next') {
                siblings[(index + 1) % siblings.length].focus();
            }
            else if (cmdOverride === 'prev') {
                siblings[(index - 1 + siblings.length) % siblings.length].focus();
            }
            else if (cmdOverride === 'out') {
                if (this.$parent)
                    this.$parent.focus();
            }
            event.stopPropagation();
        }
    }
    expand(props) {
        this.setProperties({
            value: props.value,
            properties: props.properties || [],
            labeled: props.labeled || true,
            labelWidth: props.labelWidth || '80px',
            orientation: props.orientation || 'vertical',
            config: props.config || [],
            groups: props.groups || {},
            widgets: props.widgets || new Map(),
            expanded: true,
        });
        this.onClose = props.onClose || null;
        // TODO: nudge: 'none' should open at cursor position like context menu
        nudge(this, props.source, props.direction);
        this.debounce(this.onExpand);
    }
    onExpand() {
        this.querySelector('[tabindex="0"]:not([inert])')?.focus();
        // TODO: keyboard focus navigation
    }
    expandedChanged() {
        if (!this.expanded) {
            this.setProperties({
                value: {},
                properties: [],
                labeled: true,
                config: [],
                groups: {},
                widgets: new Map(),
            });
            if (this.onClose) {
                this.onClose();
                this.onClose = null;
            }
        }
    }
};
__decorate([
    ReactiveProperty({ type: Boolean, value: false, reflect: true })
], IoContextEditor.prototype, "expanded", void 0);
IoContextEditor = __decorate([
    Register
], IoContextEditor);
export const IoContextEditorSingleton = new IoContextEditor();
setTimeout(() => {
    IoOverlaySingleton.appendChild(IoContextEditorSingleton);
}, 100);
//# sourceMappingURL=IoContextEditorSingleton.js.map