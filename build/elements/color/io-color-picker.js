var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoColorPanelSingleton } from './io-color-panel.js';
import { IoOverlaySingleton } from '../../core/overlay.js';
import './io-color-swatch.js';
let IoColorPicker = class IoColorPicker extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        height: var(--iotFieldHeight);
        border: var(--iotBorder);
        border-radius: var(--iotBorderRadius);
        overflow: hidden;
      }
    `;
    }
    static get Listeners() {
        return {
            'click': '_onClick',
            'keydown': '_onKeydown',
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onClick(event) {
        this.toggle();
    }
    get expanded() {
        return IoColorPanelSingleton.expanded && IoColorPanelSingleton.value === this.value;
    }
    _onKeydown(event) {
        const rect = this.getBoundingClientRect();
        const pRect = IoColorPanelSingleton.getBoundingClientRect();
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggle();
            if (this.expanded)
                IoColorPanelSingleton.firstChild.focus();
        }
        else if (this.expanded && pRect.top >= rect.bottom && event.key === 'ArrowDown') {
            event.preventDefault();
            IoColorPanelSingleton.firstChild.focus();
        }
        else if (this.expanded && pRect.bottom <= rect.top && event.key === 'ArrowUp') {
            event.preventDefault();
            IoColorPanelSingleton.firstChild.focus();
        }
        else {
            this.collapse();
            super._onKeydown(event);
        }
    }
    _onValueSet() {
        this.dispatchEvent('value-input', { property: 'value', value: this.value }, true);
    }
    toggle() {
        if (this.expanded) {
            this.collapse();
        }
        else {
            this.expand();
        }
    }
    expand() {
        IoColorPanelSingleton.value = this.value;
        IoColorPanelSingleton.expanded = true;
        IoOverlaySingleton.setElementPosition(IoColorPanelSingleton, 'down', this.getBoundingClientRect());
        // hook up 'value-input' event dispatch
        IoColorPanelSingleton.addEventListener('value-input', this._onValueSet);
        IoColorPanelSingleton._targetValueSetHandler = this._onValueSet;
    }
    collapse() {
        IoColorPanelSingleton.removeEventListener('value-input', IoColorPanelSingleton._targetValueSetHandler);
        IoColorPanelSingleton.expanded = false;
    }
    changed() {
        this.template([['io-color-swatch', { $: 'swatch', value: this.value }]]);
    }
};
__decorate([
    Property({ value: { r: 1, g: 1, b: 1, a: 1 } })
], IoColorPicker.prototype, "value", void 0);
__decorate([
    Property('0')
], IoColorPicker.prototype, "tabindex", void 0);
IoColorPicker = __decorate([
    Register
], IoColorPicker);
export { IoColorPicker };
//# sourceMappingURL=io-color-picker.js.map