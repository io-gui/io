import { Register, ReactiveProperty, IoElement, IoElementProps, VDOMElement } from 'io-gui';
import { IconsetSingleton } from '../nodes/Iconset.js';

export type IoIconProps = IoElementProps & {
  value?: string,
  stroke?: boolean,
  size?: 'small' | 'medium' | 'large',
};

/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter.
 * Custom SVG assets need to be registered with `IconsetSingleton`.
 **/
@Register
export class IoIcon extends IoElement {
  static vConstructor: (arg0?: IoIconProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
        fill: var(--io_color);
      }
      :host[size=small] {
        width: var(--io_lineHeight);
        height: var(--io_lineHeight);
        min-width: var(--io_lineHeight);
      }
      :host[size=medium] {
        width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        min-width: var(--io_fieldHeight);
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
  @ReactiveProperty({value: '', type: String, reflect: true})
  declare value: string;

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare stroke: boolean;

  @ReactiveProperty({value: 'small', type: String, reflect: true})
  declare size: 'small' | 'medium' | 'large';

  constructor(args: IoIconProps = {}) { super(args); }

  valueChanged() {
    if (this.value.search(':') !== -1) {
      this.innerHTML = IconsetSingleton.getIcon(this.value);
    } else {
      this.innerText = this.value;
    }
  }
}
export const ioIcon = IoIcon.vConstructor;
