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
        width: calc(1.5 * var(--ioFieldHeight));
        
      }
      :host:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--ioSpacing);
        left: 0;
        width: 100%;
        height: var(--ioLineHeight);
        border-radius: var(--ioLineHeight);
        border: var(--ioBorder);
        border-color: var(--ioBorderColorInset);
        background-color: var(--ioBackgroundColorField);
        box-shadow: var(--ioShadowInset);
        transition: background-color 0.4s;
      }
      :host:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: calc(var(--ioBorderWidth) + var(--ioSpacing));
        left: var(--ioBorderWidth);
        height: calc(var(--ioLineHeight) - calc(2 * var(--ioBorderWidth)));
        width: calc(var(--ioLineHeight) - calc(2 * var(--ioBorderWidth)));
        background-color: var(--ioBackgroundColorDark);
        box-shadow: var(--ioShadowOutset);
        border: var(--ioBorder);
        border-color: var(--ioBorderColorOutset);
        border-radius: var(--ioLineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: var(--ioBackgroundColorSelected);
        left: calc(100% - var(--ioLineHeight));
      }
      :host:focus:before,
      :host:focus:after {
        /* border-color: var(--ioBorderColorFocus); */
      }
      :host:focus {
        /* outline: 1px solid var(--ioBorderColorFocus); */
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
