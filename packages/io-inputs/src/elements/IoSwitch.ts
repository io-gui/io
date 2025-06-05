import { span, Register } from 'io-gui';
import { IoBoolean } from './IoBoolean';
import { ioIcon } from 'io-icons';

/**
 * Input element for `Boolean` data type displayed as switch.
 **/
@Register
export class IoSwitch extends IoBoolean {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        overflow: visible;
        padding: var(--io_spacing) var(--io_spacing);
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
        background-color: var(--io_bgColorDimmed);
        box-shadow: var(--io_shadowOutset);
        border: var(--io_border);
        border-color: var(--io_borderColorOutset);
        border-radius: var(--io_lineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value] > span:after {
        background-color: var(--io_bgColorBlue);
        left: calc(100% - calc(var(--io_lineHeight) - var(--io_borderWidth)));
      }
      :host:focus > span:before {
        border-color: var(--io_colorBlue);
        outline: 1px auto var(--io_colorBlue);
        outline: 1px auto -webkit-focus-ring-color;
      }
      :host > span:focus {
        outline: 0;
        border-color: transparent;
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