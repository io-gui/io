var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
let IoField = class IoField extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        @apply --io-field;
        display: flex;
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host[reverse] {
        flex-flow: row-reverse;
      }
      :host[selected] {
        color: var(--io-color-link);
        background-color: var(--io-background-color-light);
      }
      :host:focus {
        z-index: 200;
        position: relative;
        text-overflow: inherit;
        border-color: var(--io-color-focus);
        outline-color: var(--io-color-focus);
      }
    `;
    }
    static get Listeners() {
        return {
            'focus': '_onFocus',
            'pointerdown': '_onPointerdown',
            'click': '_onClick',
        };
    }
    _onFocus(event) {
        this.addEventListener('blur', this._onBlur);
        this.addEventListener('keydown', this._onKeydown);
        this.addEventListener('keyup', this._onKeyup);
    }
    _onBlur(event) {
        this.removeEventListener('blur', this._onBlur);
        this.removeEventListener('keydown', this._onKeydown);
        this.removeEventListener('keyup', this._onKeyup);
    }
    _onPointerdown(event) {
        event.preventDefault();
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerleave', this._onPointerleave);
        this.addEventListener('pointerup', this._onPointerup);
    }
    _onPointermove(event) { }
    _onPointerleave(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerleave', this._onPointerleave);
        this.removeEventListener('pointerup', this._onPointerup);
    }
    _onPointerup(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerleave', this._onPointerleave);
        this.removeEventListener('pointerup', this._onPointerup);
        this.focus();
    }
    _onClick() {
        this.dispatchEvent('io-field-clicked', { value: this.value }, true);
    }
    _onKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this._onClick();
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.focusTo('left');
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.focusTo('up');
        }
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.focusTo('right');
        }
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.focusTo('down');
        }
    }
    _onKeyup(event) { }
    getCaretPosition() {
        let position = 0;
        const selection = window.getSelection();
        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const selected = range.toString().length;
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(this);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length - selected;
        }
        return position;
    }
    setCaretPosition(position) {
        if (!position)
            return;
        const selection = window.getSelection();
        if (selection) {
            const range = document.createRange();
            range.setStart(this.firstChild, position);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    changed() {
        let label = '';
        if (this.label) {
            label = this.label;
        }
        else {
            if (this.value && typeof this.value === 'object') {
                label = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
            }
            else {
                label = String(this.value);
            }
        }
        this.template([
            this.icon ? ['io-icon', { icon: this.icon, stroke: this.stroke }] : null,
            ['io-label', { label: label }]
        ]);
    }
};
__decorate([
    IoProperty('0')
], IoField.prototype, "tabindex", void 0);
__decorate([
    IoProperty(undefined)
], IoField.prototype, "value", void 0);
__decorate([
    IoProperty('')
], IoField.prototype, "icon", void 0);
__decorate([
    IoProperty({ value: false })
], IoField.prototype, "stroke", void 0);
__decorate([
    IoProperty({ value: false, reflect: 'prop' })
], IoField.prototype, "reverse", void 0);
__decorate([
    IoProperty({ value: false, reflect: 'prop' })
], IoField.prototype, "selected", void 0);
IoField = __decorate([
    RegisterIoElement
], IoField);
export { IoField };
//# sourceMappingURL=field.js.map