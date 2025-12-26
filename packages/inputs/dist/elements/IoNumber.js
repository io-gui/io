var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, Property } from '@io-gui/core';
import { IoNumberLadderSingleton } from './IoNumberLadderSingleton.js';
import { IoField } from './IoField.js';
/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
let IoNumber = class IoNumber extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        font-family: monospace;
      }
      :host[placeholder]:empty:before {
        content: attr(placeholder);
        visibility: visible;
        color: var(--io_colorInput);
        padding: 0 calc(var(--io_spacing) + var(--io_borderWidth));
        opacity: 0.5;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    get textNode() {
        this._flattenTextNode(this);
        return this._textNode.nodeValue;
    }
    set textNode(value) {
        this._flattenTextNode(this);
        this._textNode.nodeValue = String(value);
    }
    onBlur(event) {
        super.onBlur(event);
        this._setFromTextNode();
        this.scrollTop = 0;
        this.scrollLeft = 0;
        // TODO: unhack race condition
        setTimeout(() => {
            if (document.activeElement.parentElement !== IoNumberLadderSingleton) {
                IoNumberLadderSingleton.expanded = false;
            }
        });
    }
    onPointerdown(event) {
        if (event.pointerType === 'touch')
            event.preventDefault();
        this.addEventListener('pointermove', this.onPointermove);
        this.addEventListener('pointerup', this.onPointerup);
        if (document.activeElement === this && event.button === 0)
            return;
    }
    onPointerup(event) {
        this.removeEventListener('pointermove', this.onPointermove);
        this.removeEventListener('pointerup', this.onPointerup);
        if (this.ladder || event.button === 1) {
            if (event.pointerType === 'touch') {
                event.preventDefault();
                document.activeElement.blur();
            }
            else {
                if (document.activeElement !== this) {
                    this.focus();
                    this.setCaretPosition(this.textNode.length);
                }
            }
            this.expandLadder();
        }
        else {
            if (document.activeElement !== this) {
                this.focus();
                this.setCaretPosition(this.textNode.length);
            }
        }
    }
    expandLadder() {
        IoNumberLadderSingleton.src = this;
        IoNumberLadderSingleton.expanded = true;
    }
    collapseLadder() {
        IoNumberLadderSingleton.expanded = false;
    }
    onKeydown(event) {
        const range = window.getSelection().getRangeAt(0);
        const rangeStart = range.startOffset;
        const rangeEnd = range.endOffset;
        const length = this.childNodes[0] ? this.childNodes[0].length : 0;
        const rangeInside = range.startContainer === range.endContainer && (range.startContainer === this.childNodes[0] || range.startContainer === this);
        switch (event.key) {
            case 'Escape':
            case 'Enter':
            case ' ':
                event.preventDefault();
                this._setFromTextNode();
                // Only blur if on mobile
                if (isMobileDevice()) {
                    this.blur();
                }
                break;
            case 'Home':
                event.preventDefault();
                this.textNode = String(this.min);
                this._setFromTextNode();
                break;
            case 'End':
                event.preventDefault();
                this.textNode = String(this.max);
                this._setFromTextNode();
                break;
            case 'ArrowLeft':
                if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                }
                // TODO: shift step
                break;
            case 'ArrowUp':
                if (IoNumberLadderSingleton.expanded) {
                    event.preventDefault();
                    const upStep = IoNumberLadderSingleton.querySelector('.io-up1');
                    if (upStep)
                        upStep.focus();
                }
                else if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                }
                break;
            case 'ArrowRight':
                if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                }
                // TODO: shift step
                break;
            case 'ArrowDown':
                if (IoNumberLadderSingleton.expanded) {
                    event.preventDefault();
                    const downStep = IoNumberLadderSingleton.querySelector('.io-down1');
                    if (downStep)
                        downStep.focus();
                }
                else if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                }
                break;
        }
    }
    onKeyup(event) {
        // TODO: move to onkeydown?
        if (event.key === 'Control' || event.key === 'Shift') {
            IoNumberLadderSingleton.expanded ? this.collapseLadder() : this.expandLadder();
        }
        else if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
            this.collapseLadder();
        }
        if (this.live) {
            const carretPosition = this.getCaretPosition();
            this._setFromTextNode();
            this.setCaretPosition(carretPosition);
        }
    }
    _setFromTextNode() {
        // Normalize comma to period for decimal separator
        let valueText = this.textNode.trim().replace(',', '.');
        let valueNumber = Number(valueText) / this.conversion;
        valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
        valueNumber = Math.round(valueNumber / this.step) * this.step;
        const d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
        valueNumber = Number(valueNumber.toFixed(d));
        if (!isNaN(valueNumber)) {
            this._reactiveProperties.get('invalid').value = false;
            this.removeAttribute('invalid');
            this.removeAttribute('aria-invalid');
            this.inputValue(valueNumber);
        }
        else {
            this._reactiveProperties.get('invalid').value = true;
            this.setAttribute('invalid', 'true');
            this.setAttribute('aria-invalid', 'true');
        }
    }
    ready() {
        this.disabledChanged();
        this.changed();
    }
    changed() {
        this.setAttribute('aria-valuenow', this.value);
        this.setAttribute('aria-valuemin', this.min);
        this.setAttribute('aria-valuemax', this.max);
        this.setAttribute('aria-valuestep', this.step);
        if (typeof this.value !== 'number' || isNaN(this.value)) {
            this.setAttribute('invalid', 'true');
            this.setAttribute('aria-invalid', 'true');
        }
        else {
            this.removeAttribute('invalid');
            this.removeAttribute('aria-invalid');
        }
        let value = this.value;
        let valueText;
        if (typeof value === 'number' && !isNaN(value)) {
            value *= this.conversion;
            let d = -Math.floor(Math.log(this.step * this.conversion) / Math.LN10);
            d = Math.max(0, Math.min(100, d));
            value = Number(value.toFixed(d));
            valueText = String(value);
        }
        else {
            valueText = 'NaN';
        }
        this.setAttribute('value', valueText);
        this.setAttribute('positive', this.value >= 0);
        this.textNode = valueText;
    }
};
__decorate([
    ReactiveProperty({ value: 0, type: Number })
], IoNumber.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], IoNumber.prototype, "live", void 0);
__decorate([
    ReactiveProperty({ value: 1, type: Number })
], IoNumber.prototype, "conversion", void 0);
__decorate([
    ReactiveProperty({ value: 0.0001, type: Number })
], IoNumber.prototype, "step", void 0);
__decorate([
    ReactiveProperty({ value: -Infinity, type: Number })
], IoNumber.prototype, "min", void 0);
__decorate([
    ReactiveProperty({ value: Infinity, type: Number })
], IoNumber.prototype, "max", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], IoNumber.prototype, "ladder", void 0);
__decorate([
    ReactiveProperty({ value: 'inset', type: String, reflect: true })
], IoNumber.prototype, "appearance", void 0);
__decorate([
    Property('true')
], IoNumber.prototype, "contentEditable", void 0);
__decorate([
    ReactiveProperty({ value: 'pattern="-?[0-9]*?[0-9]*"', type: String, reflect: true })
], IoNumber.prototype, "pattern", void 0);
__decorate([
    Property('text')
], IoNumber.prototype, "inputMode", void 0);
__decorate([
    Property('textbox')
], IoNumber.prototype, "role", void 0);
IoNumber = __decorate([
    Register
], IoNumber);
export { IoNumber };
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)
        || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
}
export const ioNumber = function (arg0) {
    return IoNumber.vConstructor(arg0);
};
//# sourceMappingURL=IoNumber.js.map