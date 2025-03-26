var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, IoField } from 'io-gui';
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
        padding-left: var(--io_spacing3);
        padding-right: var(--io_spacing3);
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
    _onPointerdown(event) {
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
    }
    _onPointermove(event) { }
    _onPointerup(event) {
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        if (document.activeElement !== this) {
            this.focus();
            this.setCaretPosition(this.textNode.length);
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
    _onKeyup(event) {
        super._onKeyup(event);
        if (this.live) {
            const carretPosition = this.getCaretPosition();
            this._setFromTextNode();
            this.setCaretPosition(carretPosition);
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
    Property(false)
], IoString.prototype, "live", void 0);
__decorate([
    Property('')
], IoString.prototype, "value", void 0);
__decorate([
    Property(true)
], IoString.prototype, "contenteditable", void 0);
__decorate([
    Property('textbox')
], IoString.prototype, "role", void 0);
__decorate([
    Property({ value: 'inset', reflect: true })
], IoString.prototype, "appearance", void 0);
IoString = __decorate([
    Register
], IoString);
export { IoString };
//# sourceMappingURL=io-string.js.map