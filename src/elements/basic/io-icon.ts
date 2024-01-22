import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
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
        fill: currentcolor;
        /* line-height: initial; */
      }
      :host {
        @apply --ioIcon;
      }
      :host:not([icon]) {
        display: none;
      }
      :host[stroke] {
        stroke: currentcolor;
        stroke-width: var(--iotStrokeWidth);
      }
      :host > svg {
        height: 100%;
      }
      :host > svg > g {
        transform-origin: 0px 0px;
      }
    `;
  }
  @Property({value: '', reflect: true})
  declare icon: string;

  @Property({value: false, reflect: true})
  declare stroke: boolean;

  iconChanged() {
    if (this.icon.search(':') !== -1) {
      this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
    } else {
      this.textNode = this.icon;
    }
  }
}
