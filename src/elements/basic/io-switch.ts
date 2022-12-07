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
        width: calc(1.5 * var(--iotFieldHeight));
        
      }
      :host:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--iotSpacing);
        left: 0;
        width: 100%;
        height: var(--iotLineHeight);
        border-radius: var(--iotLineHeight);
        border: var(--iotBorder);
        border-color: var(--iotBorderColorInset);
        background-color: var(--iotBackgroundColorField);
        box-shadow: var(--iotShadowInset);
        transition: background-color 0.4s;
      }
      :host:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: calc(var(--iotBorderWidth) + var(--iotSpacing));
        left: var(--iotBorderWidth);
        height: calc(var(--iotLineHeight) - calc(2 * var(--iotBorderWidth)));
        width: calc(var(--iotLineHeight) - calc(2 * var(--iotBorderWidth)));
        background-color: var(--iotBackgroundColorDark);
        box-shadow: var(--iotShadowOutset);
        border: var(--iotBorder);
        border-color: var(--iotBorderColorOutset);
        border-radius: var(--iotLineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: var(--iotBackgroundColorSelected);
        left: calc(100% - var(--iotLineHeight));
      }
      :host:focus:before,
      :host:focus:after {
        /* border-color: var(--iotBorderColorFocus); */
      }
      :host:focus {
        /* outline: 1px solid var(--iotBorderColorFocus); */
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
