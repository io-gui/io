var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, Property } from '@io-gui/core';
import { IoField } from './IoField.js';
/**
 * Input element for `String` data type.
 **/
let IoString = class IoString extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
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
    onPointerdown(event) {
        // if (event.pointerType === 'touch') event.preventDefault()
        this.addEventListener('pointermove', this.onPointermove);
        this.addEventListener('pointerup', this.onPointerup);
        // If already focused, let browser handle cursor placement naturally
        if (document.activeElement === this && event.button === 0)
            return;
    }
    onPointerup(event) {
        this.removeEventListener('pointermove', this.onPointermove);
        this.removeEventListener('pointerup', this.onPointerup);
        // Focus and set caret to end only when gaining focus programmatically
        if (document.activeElement !== this) {
            this.focus();
            this.setCaretPosition(this.textNode.length);
        }
    }
    get textNode() {
        this._flattenTextNode(this);
        return this._textNode.nodeValue;
    }
    set textNode(value) {
        this._flattenTextNode(this);
        this._textNode.nodeValue = String(value);
    }
    _setFromTextNode() {
        const textNode = this.textNode;
        if (typeof this.value === 'string' && textNode !== String(this.value)) {
            this.inputValue(textNode);
        }
    }
    // TODO: reconsider this feature
    _setObjectFromTextNodeJSON() {
        const textNode = this.textNode;
        try {
            const value = JSON.parse(textNode.replace(/[\t\n\r ]+/g, ' '));
            this.inputValue(value);
        }
        catch (error) {
            console.warn('IoString: Cannot parse value', textNode);
            console.error(error);
            this._setFromTextNode();
        }
    }
    onBlur(event) {
        super.onBlur(event);
        this._setFromTextNode();
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
    onKeydown(event) {
        const range = window.getSelection().getRangeAt(0);
        const rangeStart = range.startOffset;
        const rangeEnd = range.endOffset;
        const length = this.childNodes[0] ? this.childNodes[0].length : 0;
        const rangeInside = range.startContainer === range.endContainer && (range.startContainer === this.childNodes[0] || range.startContainer === this);
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (event.shiftKey) {
                    // TODO: reconsider this feature
                    this._setObjectFromTextNodeJSON();
                }
                else {
                    this._setFromTextNode();
                }
                break;
            case 'ArrowLeft':
                if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: 'ArrowLeft' }, true);
                }
                break;
            case 'ArrowUp':
                if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === 0)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: 'ArrowUp' }, true);
                }
                break;
            case 'ArrowRight':
                if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: 'ArrowRight' }, true);
                }
                break;
            case 'ArrowDown':
                if (event.ctrlKey || (rangeInside && rangeStart === rangeEnd && rangeStart === length)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: 'ArrowDown' }, true);
                }
                break;
            default:
                if (['Tab', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
                    event.preventDefault();
                    this.dispatch('io-focus-to', { source: this, command: event.key }, true);
                }
        }
    }
    onKeyup(event) {
        super.onKeyup(event);
        if (this.live) {
            const carretPosition = this.getCaretPosition();
            this._setFromTextNode();
            this.setCaretPosition(carretPosition);
        }
    }
    ready() {
        this.disabledChanged();
    }
    valueChanged() {
        this.invalid = (typeof this.value !== 'string' && this.value !== null && this.value !== undefined);
    }
    changed() {
        this.textNode = String(this.value || '');
    }
};
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoString.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], IoString.prototype, "live", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String, reflect: true })
], IoString.prototype, "placeholder", void 0);
__decorate([
    ReactiveProperty({ value: 'inset', reflect: true })
], IoString.prototype, "appearance", void 0);
__decorate([
    Property('true')
], IoString.prototype, "contentEditable", void 0);
__decorate([
    Property('textbox')
], IoString.prototype, "role", void 0);
IoString = __decorate([
    Register
], IoString);
export { IoString };
export const ioString = function (arg0) {
    return IoString.vConstructor(arg0);
};
//# sourceMappingURL=IoString.js.map