import { Register, Property, IoElement } from 'io-gui';
import { IoIconsetSingleton } from '../nodes/iconset';

/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 **/
@Register
export class IoIcon extends IoElement {
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
      :host:not([icon]) {
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
  declare icon: string;

  @Property({value: false, type: Boolean, reflect: true})
  declare stroke: boolean;

  iconChanged() {
    if (this.icon.search(':') !== -1) {
      this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
    } else {
      this.textNode = this.icon;
    }
  }
}
export const ioIcon = IoIcon.vDOM;
