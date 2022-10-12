var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoField } from './field.js';
let IoString = class IoString extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        @apply --io-field;
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        min-width: var(--io-field-height);
        border-color: var(--io-color-border-inset);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        box-shadow: var(--io-shadow-inset);
        flex-basis: 10em;
      }
      :host:before,
      :host:after {
        content: ' ';
        white-space: pre;
        visibility: hidden;
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
    `;
    }
    _setFromTextNode() {
        const textNode = this.textNode;
        if (typeof this.value === 'string' && textNode !== String(this.value)) {
            this.inputValue(textNode);
        }
    }
    _tryParseFromTextNode() {
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
    _onBlur(event) {
        super._onBlur(event);
        this._setFromTextNode();
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
    _onPointerdown() {
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
    }
    _onPointermove() { }
    _onPointerup() {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        if (document.activeElement !== this) {
            this.focus();
            this.setCaretPosition(this.textNode.length);
        }
    }
    _onKeyup(event) {
        super._onKeyup(event);
        if (this.live) {
            const carretPosition = this.getCaretPosition();
            this._setFromTextNode();
            this.setCaretPosition(carretPosition);
        }
    }
    _onKeydown(event) {
        const rng = window.getSelection().getRangeAt(0);
        const start = rng.startOffset;
        const end = rng.endOffset;
        const length = this.childNodes[0] ? this.childNodes[0].length : 0;
        const rngInside = rng.startContainer === rng.endContainer && (rng.startContainer === this.childNodes[0] || rng.startContainer === this);
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.shiftKey) {
                this._tryParseFromTextNode();
            }
            else {
                this._setFromTextNode();
            }
        }
        else if (event.key === 'ArrowLeft') {
            if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('left');
            }
        }
        else if (event.key === 'ArrowUp') {
            if (event.ctrlKey || (rngInside && start === end && start === 0)) {
                event.preventDefault();
                this.focusTo('up');
            }
        }
        else if (event.key === 'ArrowRight') {
            if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('right');
            }
        }
        else if (event.key === 'ArrowDown') {
            if (event.ctrlKey || (rngInside && start === end && start === length)) {
                event.preventDefault();
                this.focusTo('down');
            }
        }
    }
    changed() {
        this.title = this.label;
        this.textNode = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
    }
    valueChanged() {
        if (typeof this.value !== 'string') {
            this.setAttribute('aria-invalid', 'true');
        }
        else {
            this.removeAttribute('aria-invalid');
        }
    }
};
__decorate([
    IoProperty(false)
], IoString.prototype, "live", void 0);
__decorate([
    IoProperty('')
], IoString.prototype, "value", void 0);
__decorate([
    IoProperty(true)
], IoString.prototype, "contenteditable", void 0);
__decorate([
    IoProperty('textbox')
], IoString.prototype, "role", void 0);
IoString = __decorate([
    RegisterIoElement
], IoString);
export { IoString };
//# sourceMappingURL=string.js.map