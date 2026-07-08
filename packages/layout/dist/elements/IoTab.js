var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, span } from '@io-gui/core';
import { IoField } from '@io-gui/inputs';
import { ioIcon } from '@io-gui/icons';
import { Tab } from '../models/Tab.js';
function keyToAction(key) {
    switch (key) {
        case 'Backspace':
            return 'delete';
        case 'ArrowLeft':
            return 'move-left';
        case 'ArrowRight':
            return 'move-right';
        case 'Home':
            return 'move-start';
        case 'End':
            return 'move-end';
    }
}
// TODO: fix and improve keyboard navigation in all cases.
let IoTab = class IoTab extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        position: relative;
        height: inherit;
        min-height: inherit;
        /* TODO: use vars for this */
        min-width: calc(var(--io_fieldHeight) * 1.25);
        margin: 0;
        margin-right: var(--io_spacing);
        background-color: var(--io_bgColorStrong) !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        padding: var(--io_spacing2);
        border-bottom-color: transparent !important;
      }
      :host:focus {
        outline: none !important;
        border-bottom-color: transparent !important;
      }
      :host[pressed] {
        border-color: unset !important;
        border-bottom-color: transparent !important;
        box-shadow: unset !important;
      }
      :host[selected] {
        color: var(--io_color);
        background-color: var(--io_bgColor) !important;
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColor);
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
      }
      :host > span {
        padding: 0 var(--io_spacing);
        overflow: hidden; 
        text-overflow: ellipsis !important;
      }
      :host > * {
        pointer-events: none;
        display: inline-block;
        white-space: nowrap;
      }
      :host > .io-tab-icon {
        margin: 0 var(--io_spacing) 0 var(--io_spacing) !important;
      }
      :host > .io-tab-close {
        pointer-events: auto;
        opacity: 0;
        margin: 0 var(--io_spacing) 0 0 !important;
        transform: scale(0.6);
      }
      :host:hover > .io-tab-close {
        opacity: 1;
        transform: scale(0.5);
      }
      :host > .io-tab-close:hover {
        transform: scale(0.6);
        fill: var(--io_colorStrong);
      }
    `;
    }
    _pointerDown = [0, 0];
    _dragging = false;
    constructor(args) { super(args); }
    onResized() {
        const span = this.querySelector('span');
        this.overflow = span.scrollWidth > span.clientWidth;
    }
    onPointerdown(event) {
        super.onPointerdown(event);
        this._pointerDown = [event.clientX, event.clientY];
        this._dragging = false;
    }
    onPointermove(event) {
        if (this._dragging) {
            this.dispatchDrag('move', event.clientX, event.clientY);
        }
        else {
            const [x, y] = this._pointerDown;
            const distance = Math.sqrt((x - event.clientX) ** 2 + (y - event.clientY) ** 2);
            if (distance > 10) {
                this._dragging = true;
                this.dispatchDrag('start', event.clientX, event.clientY);
            }
        }
        super.onPointermove(event);
    }
    onPointercancel(event) {
        super.onPointercancel(event);
        this.dispatchDrag('cancel', event.clientX, event.clientY);
    }
    onPointerleave(event) {
        super.onPointerleave(event);
        this.dispatchDrag('cancel', event.clientX, event.clientY);
    }
    onPointerup(event) {
        super.onPointerup(event);
        this.dispatchDrag('end', event.clientX, event.clientY);
    }
    onClick() {
        if (this._dragging)
            return;
        this.dispatchAction('select');
    }
    dispatchAction(action) {
        this.dispatch('io-tab-action', { model: this.model, action }, true);
    }
    dispatchDrag(phase, x, y) {
        this.dispatch('io-tab-drag', { model: this.model, phase, x, y }, true);
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    onClose(event) {
        event.stopPropagation();
        this.dispatchAction('delete');
    }
    onKeydown(event) {
        const action = keyToAction(event.key);
        if (event.shiftKey && action !== undefined) {
            event.preventDefault();
            this.dispatchAction(action);
        }
        else {
            super.onKeydown(event);
        }
    }
    modelMutated() {
        this.mutated();
    }
    mutated() {
        this.setAttribute('selected', this.model.selected);
        this.setAttribute('title', this.model.label);
        this.render([
            this.model.icon ? ioIcon({ value: this.model.icon, class: 'io-tab-icon' }) : null,
            span({ class: 'io-tab-label' }, this.model.label),
            ioIcon({ value: 'io:close', class: 'io-tab-close',
                '@pointerdown': this.stopPropagation,
                '@click': this.onClose
            })
        ]);
    }
};
__decorate([
    Property({ type: Tab })
], IoTab.prototype, "model", void 0);
__decorate([
    Property({ type: Boolean, reflect: true })
], IoTab.prototype, "overflow", void 0);
IoTab = __decorate([
    Register
], IoTab);
export { IoTab };
export const ioTab = function (arg0) {
    return IoTab.vConstructor(arg0);
};
