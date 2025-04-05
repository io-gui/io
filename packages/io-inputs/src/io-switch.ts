import { Register } from 'io-gui';
import { IoBoolean } from './io-boolean';

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
        width: calc(1.5 * var(--io_fieldHeight));
        overflow: visible;
      }
      :host:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--io_spacing);
        left: 0;
        width: 100%;
        height: var(--io_lineHeight);
        border-radius: var(--io_lineHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        background-color: var(--io_bgColorInput);
        box-shadow: var(--io_shadowInset);
        transition: background-color 0.4s;
      }
      :host:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: calc(var(--io_borderWidth) + var(--io_spacing));
        left: var(--io_borderWidth);
        height: calc(var(--io_lineHeight) - calc(2 * var(--io_borderWidth)));
        width: calc(var(--io_lineHeight) - calc(2 * var(--io_borderWidth)));
        background-color: var(--io_bgColorDimmed);
        box-shadow: var(--io_shadowOutset);
        border: var(--io_border);
        border-color: var(--io_borderColorOutset);
        border-radius: var(--io_lineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: var(--io_bgColorBlue);
        left: calc(100% - calc(var(--io_lineHeight) - var(--io_borderWidth)));
      }
      :host:focus:before {
        border-color: var(--io_colorBlue);
        outline: 1px auto var(--io_colorBlue);
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
  valueChanged() {
    this.setAttribute('aria-checked', String(!!this.value));
    if (typeof this.value !== 'boolean') {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
}
export const ioSwitch = IoSwitch.vConstructor;