import { Register } from '../../core/decorators/register.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/decorators/property.js';
import { IoIconsetSingleton } from './io-iconset.js';

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
        width: var(--iotLineHeight);
        height: var(--iotLineHeight);
        min-width: var(--iotLineHeight);
        line-height: var(--iotLineHeight);
        font-size: var(--iotFontSize);
        text-align: center;
        fill: var(--iotColor);
      }
      :host {
        @apply --ioIcon;
      }
      :host:not([icon]) {
        display: none;
      }
      :host[stroke] {
        stroke: var(--iotColorStrong);
        stroke-width: var(--iotBorderWidth);
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
