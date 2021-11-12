import {RegisterIoElement} from '../../../srcj/components/io-element.js';
import {IoItem} from './item.js';

/*
 * Extends `IoItem`.
 *
 * Button element. When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
 **/

export class IoButton extends IoItem {
  static get Style() {
    return /* css */`
    :host {
      text-align: center;
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
    }
    :host[pressed] {
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
    }
    `;
  }
  static get Properties() {
    return {
      action: null,
      value: undefined,
      pressed: {
        type: Boolean,
        reflect: 1,
      },
      label: 'Button',
      icon: '',
      role: 'button',
    };
  }
  _onPointerdown(event) {
    super._onPointerdown(event);
    this.pressed = true;
  }
  _onPointerleave(event) {
    super._onPointerleave(event);
    this.pressed = false;
  }
  _onPointerup(event) {
    super._onPointerup(event);
    this.pressed = false;
  }
  _onKeydown(event) {
    super._onKeydown(event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
    }
  }
  _onKeyup(event) {
    super._onKeyup(event);
    this.pressed = false;
  }
  _onClick() {
    super._onClick();
    if (typeof this.action === 'function') this.action(this.value);
  }
}

RegisterIoElement(IoButton);
