import { Register, Property, IoElement, IoElementArgs, VDOMElement, ArgsWithBinding } from 'io-gui';
import { IconsetSingleton } from '../nodes/Iconset';

export type IoIconArgs = IoElementArgs & ArgsWithBinding<{
  value?: string;
  stroke?: boolean;
}>;

/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter.
 * Custom SVG assets need to be registered with `IconsetSingleton`.
 **/
@Register
export class IoIcon extends IoElement {
  static vConstructor: (arg0?: IoIconArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      --ioIcon: {
        display: inline-block;
        width: var(--io_lineHeight);
        height: var(--io_lineHeight);
        min-width: var(--io_lineHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        text-align: center;
        fill: var(--io_color);
      }
      :host {
        @apply --ioIcon;
      }
      :host:not([value]) {
        display: none;
      }
      :host[stroke] {
        stroke: var(--io_colorStrong);
        stroke-width: var(--io_borderWidth);
      }
      :host > svg {
        height: 100%;
      }
      :host > svg > g {
        transform-origin: 0px 0px;
      }
    `;
  }
  @Property({value: '', type: String, reflect: true})
  declare value: string;

  @Property({value: false, type: Boolean, reflect: true})
  declare stroke: boolean;

  constructor(args: IoIconArgs = {}) { super(args); }

  valueChanged() {
    if (this.value.search(':') !== -1) {
      this.innerHTML = IconsetSingleton.getIcon(this.value);
    } else {
      this.textNode = this.value;
    }
  }
}
export const ioIcon = IoIcon.vConstructor;
