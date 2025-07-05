import { span, Register } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoBoolean } from './IoBoolean.js';

/**
 * Input element for `Boolean` data type displayed as switch.
 **/
@Register
export class IoSwitch extends IoBoolean {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        position: relative;
        overflow: visible;
        padding: var(--io_spacing) var(--io_spacing);
      }
      :host:focus {
        outline: 0 !important;
        border-color: transparent !important;
        z-index: 1;
      }
      :host:focus > span:before {
        @apply --io_focus;
      }
      :host[pressed] {
        border-color: transparent !important;
        box-shadow: none !important;
      }
      :host > span {
        position: relative;
        width: calc(1.5 * var(--io_fieldHeight));
      }
      :host > span:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
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
      :host > span:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--io_borderWidth);
        left: var(--io_borderWidth);
        height: calc(var(--io_lineHeight) - calc(2 * var(--io_borderWidth)));
        width: calc(var(--io_lineHeight) - calc(2 * var(--io_borderWidth)));
        background-color: var(--io_bgColorLight);
        box-shadow: var(--io_shadowOutset);
        border: var(--io_border);
        border-color: var(--io_borderColorOutset);
        border-radius: var(--io_lineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
        z-index: 2;
      }
      :host[value] > span:after {
        background-color: var(--io_bgColorBlue);
        left: calc(100% - calc(var(--io_lineHeight) - var(--io_borderWidth)));
      }
    `;
  }
  changed() {
    this.render([
      this.icon ? ioIcon({value: this.icon}) : null,
      span()
    ]);
  }
}
export const ioSwitch = IoSwitch.vConstructor;