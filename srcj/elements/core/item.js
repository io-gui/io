/* eslint-disable @typescript-eslint/no-unused-vars */
import { IoElement, RegisterIoElement } from '../../components/io-element.js';
/*
 * Extends [`IoElement`](/#doc=core-element).
 *
 * This is the simplest element with a `value`, a building block for more complex elements.
 *
 * It simply displays `value` or `label` property if set.
 *
 * It changes its apparence if `selected` of `disabled` properties are `true`.
 *
 * Arow keys up, down, left, right and tab change focus to the nearest focusable element in the chosen direction.
 *
 * <io-element-demo element="io-item" properties='{"label": "Item", "value": "null", "selected": false, "disabled": false}'></io-element-demo>
 **/
export class IoItem extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-item;
    }
    :host[selected] {
      color: var(--io-color-link);
      background-color: var(--io-background-color-highlight);
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
    static get Properties() {
        return {
            value: undefined,
            selected: {
                type: Boolean,
                reflect: 1,
            },
            tabindex: 0,
        };
    }
    static get Listeners() {
        return {
            'focus': '_onFocus',
            'pointerdown': '_onPointerdown',
            'click': '_onClick',
        };
    }
    constructor(properties = {}) {
        super(properties);
        Object.defineProperty(this, '__textNode', { enumerable: false, writable: true, value: document.createTextNode('') });
        this.appendChild(this.__textNode);
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
        this.dispatchEvent('item-clicked', { value: this.value, label: this.label }, true);
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
        let label;
        if (this.label) {
            label = this.label;
            this.title = this.label;
        }
        else {
            let valueText;
            if (this.value && typeof this.value === 'object') {
                valueText = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
            }
            else {
                valueText = String(this.value);
            }
            this.title = valueText;
            label = valueText;
        }
        this.textNode = label;
    }
}
RegisterIoElement(IoItem);
//# sourceMappingURL=item.js.map