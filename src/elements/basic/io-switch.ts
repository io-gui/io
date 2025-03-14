import { Register } from '../../core/decorators/register.js';
import { IoBoolean } from './io-boolean.js';

/**
 * Input element for `Boolean` data type displayed as switch.
 *
 * <io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>
 **/
@Register
export class IoSwitch extends IoBoolean {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        width: calc(1.5 * var(--iotFieldHeight));
        overflow: visible;
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
        background-color: var(--iotBgColorField);
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
        background-color: var(--iotBgColorDimmed);
        box-shadow: var(--iotShadowOutset);
        border: var(--iotBorder);
        border-color: var(--iotBorderColorOutset);
        border-radius: var(--iotLineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: var(--iotBgColorBlue);
        left: calc(100% - calc(var(--iotLineHeight) - var(--iotBorderWidth)));
      }
      :host:focus:before {
        border-color: var(--iotColorBlue);
        outline: 1px auto var(--iotColorBlue);
        outline: 1px auto -webkit-focus-ring-color;
      }
      :host:focus {
        outline: 0;
        border-color: transparent;
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
