import { RegisterIoElement } from '../../core/element.js';
import { IoBoolean } from './io-boolean.js';

/**
 * Input element for `Boolean` data type displayed as switch.
 *
 * <io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>
 **/
@RegisterIoElement
export class IoSwitch extends IoBoolean {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        width: calc(1.5 * var(--io-field-height));
        
      }
      :host:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--io-spacing);
        left: 0;
        width: 100%;
        height: var(--io-line-height);
        border-radius: var(--io-line-height);
        border: var(--io-border);
        border-color: var(--io-color-border-inset);
        background-color: var(--io-background-color-field);
        box-shadow: var(--io-shadow-inset);
        transition: background-color 0.4s;
      }
      :host:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: calc(var(--io-border-width) + var(--io-spacing));
        left: var(--io-border-width);
        height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
        width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
        background-color: var(--io-background-color-dark);
        box-shadow: var(--io-shadow-outset);
        border: var(--io-border);
        border-color: var(--io-color-border-outset);
        border-radius: var(--io-line-height);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: var(--io-background-color-field-selected);
        left: calc(100% - var(--io-line-height));
      }
      :host:focus:before,
      :host:focus:after {
        /* border-color: var(--io-background-color-focus); */
      }
      :host:focus {
        /* outline: 1px solid var(--io-background-color-focus); */
      }
    `;
  }
  init() {
    this.setAttribute('aria-checked', String(!!this.value));
  }
  changed() {
    this.title = this.label;
  }
  valueChanged() {
    this.setAttribute('aria-checked', String(!!this.value));
    if (typeof this.value !== 'boolean') {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
}
