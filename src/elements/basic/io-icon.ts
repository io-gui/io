import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoIconsetSingleton } from './io-iconset.js';

/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 **/
@RegisterIoElement
export class IoIcon extends IoElement {
  static get Style() {
    return /* css */`
      --io-icon: {
        display: inline-block;
        height: var(--ioLineHeight);
        min-width: var(--ioLineHeight);
        line-height: var(--ioLineHeight);
        font-size: var(--ioFontSize);
        text-align: center;
        fill: currentcolor;
      }
      :host {
        @apply --io-icon;
      }
      :host:not([icon]) {
        display: none;
      }
      :host[stroke] {
        stroke: currentcolor;
        stroke-width: var(--ioStrokeWidth);
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
