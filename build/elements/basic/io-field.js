var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
// let focusBacktrack = new WeakMap();
// const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
// function setBacktrack(element, dir, target) {
//   const backtrack = focusBacktrack.get(element) || {};
//   backtrack[backtrackDir[dir]] = target;
//   focusBacktrack.set(element, backtrack);
// }
let IoField = class IoField extends IoElement {
    static get Style() {
        return /* css */ `
      --ioField: {
        display: flex;

        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        height: var(--iotFieldHeight);
        line-height: var(--iotLineHeight);

        font-size: var(--iotFontSize);
        border: var(--iotBorder);
        border-radius: var(--iotBorderRadius);
        border-color: transparent;
        color: var(--iotColorField);
        background-color: var(--iotBackgroundColorField);
        padding: var(--iotSpacing) calc(var(--iotSpacing) + 0.5em);
        transition: background-color 0.25s;
      }
      :host {
        @apply --ioField;
      }
      :host[appearance=neutral] {
        background-color: transparent;
      }
      :host[appearance=inset] {
        border-color: var(--iotBorderColorInset);
      }
      :host[appearance=outset] {
        border-color: var(--iotBorderColorOutset);
        background-image: var(--iotGradientOutset);
      }
      :host[invalid] {
        color: var(--iotColorError);
        border: var(--iotBorderError);
      }
      :host[selected] {
        color: var(--iotColorSelected);
        background-color: var(--iotBackgroundColorSelected);
        border-color: var(--iotBorderColorSelected);
      }
      :host:focus {
        text-overflow: inherit;
      }
      :host[placeholder]:empty:before {
        content: attr(placeholder);
        visibility: visible;
        color: var(--iotColorField);
        padding: 0 calc(var(--iotSpacing) + var(--iotBorderWidth));
        opacity: 0.5;
      }
    `;
    }
    static get Listeners() {
        return {
            'focus-to': '_onFocusTo',
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
    _onFocusTo(event) {
        const src = event.composedPath()[0];
        const dir = event.detail.dir;
        const rect = event.detail.rect;
        rect.center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        if (src !== this) {
            let closest = src;
            let closestX = Infinity;
            let closestY = Infinity;
            // TODO: improve backtracking
            // const backtrack = focusBacktrack.get(src);
            // if (backtrack && backtrack[dir]) {
            //   backtrack[dir].focus();
            //   setBacktrack(backtrack[dir], dir, src);
            //   return;
            // }
            const siblings = this.querySelectorAll('[tabindex="0"]:not([disabled])');
            for (let i = siblings.length; i--;) {
                if (!siblings[i].offsetParent) {
                    continue;
                }
                // TODO: unhack
                const sStyle = window.getComputedStyle(siblings[i]);
                if (sStyle.visibility !== 'visible') {
                    continue;
                }
                const sRect = siblings[i].getBoundingClientRect();
                sRect.center = { x: sRect.x + sRect.width / 2, y: sRect.y + sRect.height / 2 };
                // TODO: improve automatic direction routing.
                switch (dir) {
                    case 'right': {
                        if (sRect.left >= (rect.right - 1)) {
                            const distX = Math.abs(sRect.left - rect.right);
                            const distY = Math.abs(sRect.center.y - rect.center.y);
                            if (distX < closestX || distY < closestY / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distX === closestX && distY < closestY) {
                                closest = siblings[i];
                                closestY = distY;
                            }
                        }
                        break;
                    }
                    case 'left': {
                        if (sRect.right <= (rect.left + 1)) {
                            const distX = Math.abs(sRect.right - rect.left);
                            const distY = Math.abs(sRect.center.y - rect.center.y);
                            if (distX < closestX || distY < closestY / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distX === closestX && distY < closestY) {
                                closest = siblings[i];
                                closestY = distY;
                            }
                        }
                        break;
                    }
                    case 'down': {
                        if (sRect.top >= (rect.bottom - 1)) {
                            const distX = Math.abs(sRect.center.x - rect.center.x);
                            const distY = Math.abs(sRect.top - rect.bottom);
                            if (distY < closestY || distX < closestX / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distY === closestY && distX < closestX) {
                                closest = siblings[i];
                                closestX = distX;
                            }
                        }
                        break;
                    }
                    case 'up': {
                        if (sRect.bottom <= (rect.top + 1)) {
                            const distX = Math.abs(sRect.center.x - rect.center.x);
                            const distY = Math.abs(sRect.bottom - rect.top);
                            if (distY < closestY || distX < closestX / 3) {
                                closest = siblings[i];
                                closestX = distX;
                                closestY = distY;
                            }
                            else if (distY === closestY && distX < closestX) {
                                closest = siblings[i];
                                closestX = distX;
                            }
                        }
                        break;
                    }
                }
            }
            if (closest !== src) {
                closest.focus();
                // setBacktrack(closest, dir, src);
                event.stopPropagation();
            }
        }
    }
    focusTo(dir) {
        const rect = this.getBoundingClientRect();
        this.dispatchEvent('focus-to', { dir: dir, rect: rect }, true);
    }
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
    Property('0')
], IoField.prototype, "tabindex", void 0);
__decorate([
    Property(undefined)
], IoField.prototype, "value", void 0);
__decorate([
    Property({ value: '', reflect: true })
], IoField.prototype, "icon", void 0);
__decorate([
    Property({ value: 'flush', reflect: true })
], IoField.prototype, "appearance", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoField.prototype, "stroke", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoField.prototype, "selected", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoField.prototype, "invalid", void 0);
__decorate([
    Property({ value: '', reflect: true })
], IoField.prototype, "placeholder", void 0);
IoField = __decorate([
    Register
], IoField);
export { IoField };
//# sourceMappingURL=io-field.js.map