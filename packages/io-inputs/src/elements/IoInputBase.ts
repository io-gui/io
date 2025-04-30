import { Property, Default, Register, VDOMElement, PropsWithBinding } from 'io-gui';
import { IoField, IoFieldProps } from './IoField';

// let focusBacktrack = new WeakMap();
// const backtrackDir = {'left': 'right', 'right': 'left', 'down': 'up', 'up': 'down'};
// function setBacktrack(element, dir, target) {
//   const backtrack = focusBacktrack.get(element) || {};
//   backtrack[backtrackDir[dir]] = target;
//   focusBacktrack.set(element, backtrack);
// }

export type IoInputBaseProps = IoFieldProps & PropsWithBinding<{
  pressed?: boolean;
}>;

@Register
export class IoInputBase extends IoField {
  static vConstructor: (arg0?: IoInputBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
        border-radius: var(--io_borderRadius);
        color: var(--io_colorInput);
        background-color: var(--io_bgColorInput);
        transition: background-color 0.25s;
      }
      :host[pressed] {
        border-color: var(--io_borderColorInset);
        box-shadow: var(--io_shadowInset);
      }
    `;
  }

  static get Listeners() {
    return {
      'focus-to': 'onFocusTo',
      'focus': 'onFocus',
      'pointerdown': 'onPointerdown',
      'click': 'onClick',
    };
  }

  @Property({value: false, type: Boolean, reflect: true})
  declare pressed: boolean;

  @Property({value: '', type: String, reflect: true})
  declare pattern: string;

  @Default(false)
  declare spellcheck: boolean;

  constructor(args: IoInputBaseProps = {}) { super(args); }

  onFocus(event: FocusEvent) {
    this.addEventListener('blur', this.onBlur);
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('keyup', this.onKeyup);
  }
  onBlur(event: FocusEvent) {
    this.removeEventListener('blur', this.onBlur);
    this.removeEventListener('keydown', this.onKeydown);
    this.removeEventListener('keyup', this.onKeyup);
  }
  onPointerdown(event: PointerEvent) {
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerleave', this.onPointerleave);
    this.addEventListener('pointerup', this.onPointerup);
    this.pressed = true;
  }
  onPointermove(event: PointerEvent) {}

  onPointerleave(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerleave', this.onPointerleave);
    this.removeEventListener('pointerup', this.onPointerup);
    this.pressed = false;
  }
  onPointerup(event: PointerEvent) {
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerleave', this.onPointerleave);
    this.removeEventListener('pointerup', this.onPointerup);
    this.pressed = false;
  }
  onClick(event?: MouseEvent) {}
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
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
  onKeyup(event: KeyboardEvent) {}
  onFocusTo(event: CustomEvent) {
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

      const siblings = this.querySelectorAll('[tabIndex="0"]:not([disabled])');

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
}
export const ioInputBase = IoInputBase.vConstructor;

