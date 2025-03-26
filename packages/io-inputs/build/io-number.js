var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, IoField, IoOverlaySingleton } from 'io-gui';
import { IoNumberLadderSingleton } from './io-number-ladder.js';
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
        padding-left: var(--io_spacing3);
        padding-right: var(--io_spacing3);
      }
    `;
    }
    _pointer = '';
    _onBlur(event) {
        super._onBlur(event);
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
    _onPointerdown(event) {
        if (this._pointer === 'touch')
            event.preventDefault();
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
        if (document.activeElement === this && event.button === 0)
            return;
        this._pointer = event.pointerType;
    }
    _onPointerup(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        if (this.ladder || event.button === 1) {
            if (this._pointer === 'touch') {
                event.preventDefault();
                document.activeElement.blur();
            }
            else {
                if (document.activeElement !== this) {
                    this.focus();
                    this.setCaretPosition(this.textNode.length);
                }
            }
            this._expandLadder();
        }
        else {
            if (document.activeElement !== this) {
                this.focus();
                this.setCaretPosition(this.textNode.length);
            }
        }
    }
    _onFocus(event) {
        super._onFocus(event);
        if (this._pointer === 'touch') {
            IoNumberLadderSingleton.expanded = false;
        }
    }
    _expandLadder() {
        IoNumberLadderSingleton.src = this;
        IoNumberLadderSingleton.expanded = true;
    }
    _onKeydown(event) {
        const rng = window.getSelection().getRangeAt(0);
        const start = rng.startOffset;
        const end = rng.endOffset;
        const length = this.childNodes[0] ? this.childNodes[0].length : 0;
        const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);
        if (event.which === 27 || event.which === 13 || event.which === 32) { //  esc || enter || space
            event.preventDefault();
            this._setFromTextNode();
        }
        else if (event.which === 36) { // home
            this.textNode = this.min;
            this._setFromTextNode();
        }
        else if (event.which === 35) { // end
            this.textNode = this.max;
            this._setFromTextNode();
        }
        else if (event.which === 33) { // pgup
            const valueNumber = Number(this.textNode);
            if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
                this.textNode = Number(this.textNode) + this.step;
            }
            else {
                this.textNode = this.step;
            }
            this._setFromTextNode();
        }
        else if (event.which === 34) { // pgdown
            const valueNumber = Number(this.textNode);
            if (!isNaN(valueNumber) && Math.abs(valueNumber) < Infinity) {
                this.textNode = Number(this.textNode) - this.step;
            }
            else {
                this.textNode = -this.step;
            }
            this._setFromTextNode();
        }
        else if (event.which === 37) { // left
            if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('left');
            }
        }
        else if (event.which === 38) { // up
            if (IoNumberLadderSingleton.expanded) {
                const upStep = IoNumberLadderSingleton.querySelector('.io-up1');
                if (upStep)
                    upStep.focus();
            }
            else if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('up');
            }
        }
        else if (event.which === 39) { // right
            if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('right');
            }
        }
        else if (event.which === 40) { // down
            if (IoNumberLadderSingleton.expanded) {
                const downStep = IoNumberLadderSingleton.querySelector('.io-down1');
                if (downStep)
                    downStep.focus();
            }
            else if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('down');
            }
        }
    }
    _onKeyup(event) {
        if (event.which === 17) { // ctrl
            this._expandLadder();
        }
        else if (event.which === 27 || event.which === 13 || event.which === 32) { // esc || enter || space
            IoOverlaySingleton.expanded = false;
        }
    }
    _setFromTextNode() {
        const valueText = this.textNode;
        let valueNumber = Number(valueText) / this.conversion;
        valueNumber = Math.min(this.max, Math.max(this.min, valueNumber));
        valueNumber = Math.round(valueNumber / this.step) * this.step;
        const d = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
        valueNumber = Number(valueNumber.toFixed(d));
        if (!isNaN(valueNumber))
            this.inputValue(valueNumber);
        else
            this.textNode = 'NaN';
    }
    init() {
        this.changed();
    }
    changed() {
        this.setAttribute('value', this.value);
        this.setAttribute('aria-valuenow', this.value);
        this.setAttribute('aria-valuemin', this.min);
        this.setAttribute('aria-valuemax', this.max);
        this.setAttribute('aria-valuestep', this.step);
        if (typeof this.value !== 'number' || isNaN(this.value)) {
            this.setAttribute('aria-invalid', 'true');
        }
        else {
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
    Property('textbox')
], IoNumber.prototype, "role", void 0);
__decorate([
    Property({ value: 0, type: Number })
], IoNumber.prototype, "value", void 0);
__decorate([
    Property({ value: 1, type: Number })
], IoNumber.prototype, "conversion", void 0);
__decorate([
    Property({ value: 0.0001, type: Number })
], IoNumber.prototype, "step", void 0);
__decorate([
    Property({ value: -Infinity, type: Number })
], IoNumber.prototype, "min", void 0);
__decorate([
    Property({ value: Infinity, type: Number })
], IoNumber.prototype, "max", void 0);
__decorate([
    Property({ value: false, type: Boolean })
], IoNumber.prototype, "ladder", void 0);
__decorate([
    Property({ value: true, type: Boolean })
], IoNumber.prototype, "contenteditable", void 0);
__decorate([
    Property({ value: 'number', type: String, reflect: true })
], IoNumber.prototype, "type", void 0);
__decorate([
    Property({ value: 'pattern="[0-9]*"', type: String, reflect: true })
], IoNumber.prototype, "pattern", void 0);
__decorate([
    Property({ value: 'numeric', type: String, reflect: true })
], IoNumber.prototype, "inputmode", void 0);
__decorate([
    Property({ value: 'false', type: String, reflect: true })
], IoNumber.prototype, "spellcheck", void 0);
__decorate([
    Property({ value: 'inset', type: String, reflect: true })
], IoNumber.prototype, "appearance", void 0);
IoNumber = __decorate([
    Register
], IoNumber);
export { IoNumber };
//# sourceMappingURL=io-number.js.map