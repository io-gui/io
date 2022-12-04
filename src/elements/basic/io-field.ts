/* eslint-disable @typescript-eslint/no-unused-vars */
import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';

// let focusBacktrack = new WeakMap();
// const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
// function setBacktrack(element, dir, target) {
//   const backtrack = focusBacktrack.get(element) || {};
//   backtrack[backtrackDir[dir]] = target;
//   focusBacktrack.set(element, backtrack);
// }

@RegisterIoElement
export class IoField extends IoElement {
  static get Style() {
    return /* css */`
      --io-field: {
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;

        overflow: hidden;
        text-overflow: ellipsis;
        flex-wrap: nowrap;
        white-space: nowrap;

        height: var(--io-field-height);
        line-height: var(--io-line-height);

        font-size: var(--io-font-size);
        border: var(--io-border);
        border-radius: var(--io-border-radius);
        border-color: transparent;
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        padding: var(--io-spacing) calc(var(--io-spacing) + 0.5em);
        transition: background-color 0.25s;
      }
      :host {
        @apply --io-field;
      }
      :host[appearance=neutral] {
        background-color: transparent;
      }
      :host[appearance=inset] {
        border-color: var(--io-color-border-inset);
      }
      :host[appearance=outset] {
        border-color: var(--io-color-border-outset);
        background-image: var(--io-gradient-outset);
      }
      :host[invalid] {
        color: var(--io-color-error);
        border: var(--io-border-error);
      }
      :host[selected] {
        color: var(--io-color-field-selected);
        background-color: var(--io-background-color-field-selected);
      }
      :host:focus {
        z-index: 200;
        position: relative;
        text-overflow: inherit;
        border-color: var(--io-background-color);
        outline: 1px solid var(--io-background-color-focus);
      }
      :host[placeholder]:empty:before {
        content: attr(placeholder);
        visibility: visible;
        color: var(--io-color-field);
        padding: 0 calc(var(--io-spacing) + var(--io-border-width));
        opacity: 0.5;
      }
    `;
  }

  @Property('0')
  declare tabindex: string;

  @Property(undefined)
  declare value: any;

  @Property({value: '', reflect: 'prop'})
  declare icon: string;

  @Property({value: 'flush', reflect: 'prop'})
  declare appearance: 'flush' | 'inset' | 'outset' | 'neutral';

  @Property({value: false, reflect: 'prop'})
  declare stroke: boolean;

  @Property({value: false, reflect: 'prop'})
  declare selected: boolean;

  @Property({value: false, reflect: 'prop'})
  declare invalid: boolean;

  @Property({value: '', reflect: 'prop'})
  declare placeholder: string;

  static get Listeners() {
    return {
      'focus-to': '_onFocusTo',
      'focus': '_onFocus',
      'pointerdown': '_onPointerdown',
      'click': '_onClick',
    };
  }
  _onFocus(event: FocusEvent) {
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('keyup', this._onKeyup);
  }
  _onBlur(event: FocusEvent) {
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('keyup', this._onKeyup);
  }
  _onPointerdown(event: PointerEvent) {
    event.preventDefault();
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerleave', this._onPointerleave);
    this.addEventListener('pointerup', this._onPointerup);
  }
  _onPointermove(event: PointerEvent) {}
  _onPointerleave(event: PointerEvent) {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerleave', this._onPointerleave);
    this.removeEventListener('pointerup', this._onPointerup);
  }
  _onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerleave', this._onPointerleave);
    this.removeEventListener('pointerup', this._onPointerup);
    this.focus();
  }
  _onClick() {
    this.dispatchEvent('io-field-clicked', {value: this.value}, true);
  }
  _onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._onClick();
    }
    else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusTo('left');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusTo('right');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusTo('down');
    }
  }
  _onKeyup(event: KeyboardEvent) {}
  _onFocusTo(event: CustomEvent) {
    const src = event.composedPath()[0];
    const dir = event.detail.dir;
    const rect = event.detail.rect;
    rect.center = {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2};

    if (src !== this as any) {
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
        sRect.center = {x: sRect.x + sRect.width / 2, y: sRect.y + sRect.height / 2};

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
              } else if (distX === closestX && distY < closestY) {
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
              } else if (distX === closestX && distY < closestY) {
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
              } else if (distY === closestY && distX < closestX) {
                closest = siblings[i];
                closestX = distX;
              }
            }
            break;
          }
          case 'up':{
            if (sRect.bottom <= (rect.top + 1)) {
              const distX = Math.abs(sRect.center.x - rect.center.x);
              const distY = Math.abs(sRect.bottom - rect.top);
              if (distY < closestY || distX < closestX / 3) {
                closest = siblings[i];
                closestX = distX;
                closestY = distY;
              } else if (distY === closestY && distX < closestX) {
                closest = siblings[i];
                closestX = distX;
              }
            }
            break;
          }
        }
      }

      if (closest !== src) {
        (closest as any).focus();
        // setBacktrack(closest, dir, src);
        event.stopPropagation();
      }
    }
  }
  focusTo(dir: string) {
    const rect = this.getBoundingClientRect();
    this.dispatchEvent('focus-to', {dir: dir, rect: rect}, true);
  }
  getCaretPosition() {
    let position = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const selected = range.toString().length;
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(this as unknown as Node);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length - selected;
    }
    return position;
  }
  setCaretPosition(position: number){
    if (!position) return;
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
    } else {
      if (this.value && typeof this.value === 'object') {
        label = `${this.value.constructor.name}` + (this.value instanceof Array ? `(${this.value.length})` : '');
      } else {
        label = String(this.value);
      }
    }
    this.template([
      this.icon ? ['io-icon', {icon: this.icon, stroke: this.stroke}] : null,
      ['io-label', {label: label}]
    ]);
  }
}
