var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, IoElement, Property, nudge } from 'io-core';
import { IoColorPanelSingleton as Panel } from './IoColorPanelSingleton.js';
import { ioColorSwatch } from './IoColorSwatch.js';
let IoColorPicker = class IoColorPicker extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        height: var(--io_fieldHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        border-radius: var(--io_borderRadius);
        overflow: hidden;
      }
      :host:focus {
        @apply --io_focus;
      }
      :host > io-color-swatch {
        width: 100%;
        height: 100%;
      }
    `;
    }
    static get Listeners() {
        return {
            'click': 'onClick',
            'keydown': 'onKeydown',
        };
    }
    get expanded() {
        return Panel.expanded && Panel.value === this.value;
    }
    ready() {
        this.valueChanged();
    }
    onClick() {
        if (!this.expanded)
            this.expand();
    }
    onKeydown(event) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!this.expanded)
                    this.expand();
                break;
            default:
                if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                }
        }
    }
    onValueSet() {
        this.dispatch('value-input', { property: 'value', value: this.value }, true);
    }
    onPanelCollapse() {
        // TODO: Reconsider this.
        if (!this.expanded) {
            Panel.removeEventListener('value-input', this.onValueSet);
            Panel.removeEventListener('expanded-changed', this.onPanelCollapse);
        }
    }
    expand() {
        Panel.value = this.value;
        Panel.expanded = true;
        Panel.addEventListener('value-input', this.onValueSet);
        Panel.addEventListener('expanded-changed', this.onPanelCollapse);
        nudge(Panel, this, 'right');
        Panel.firstChild?.firstChild?.focus();
    }
    collapse() {
        Panel.expanded = false;
        Panel.value = { r: 1, g: 1, b: 1, a: 1 };
    }
    valueChanged() {
        this.render([
            ioColorSwatch({ value: this.value })
        ]);
    }
};
__decorate([
    ReactiveProperty({ value: { r: 1, g: 1, b: 1, a: 1 } })
], IoColorPicker.prototype, "value", void 0);
__decorate([
    Property(0)
], IoColorPicker.prototype, "tabIndex", void 0);
IoColorPicker = __decorate([
    Register
], IoColorPicker);
export { IoColorPicker };
export const ioColorPicker = function (arg0) {
    return IoColorPicker.vConstructor(arg0);
};
//# sourceMappingURL=IoColorPicker.js.map