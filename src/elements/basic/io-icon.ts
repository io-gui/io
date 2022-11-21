import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoIconsetSingleton } from './io-iconset.js';

/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 *
 * <io-element-demo element="io-icon" properties='{"icon": "icons:link", "stroke": false}' config='{"icon": ["io-option-menu", {"options": ["icons:link", "icons:unlink", "icons:check", "icons:uncheck"]}]}'></io-element-demo>
 **/
@RegisterIoElement
export class IoIcon extends IoElement {
  static get Style() {
    return /* css */`
      --io-icon: {
        display: inline-block;
        height: var(--io-line-height);
        line-height: var(--io-line-height);
        font-size: var(--io-font-size);
      }
      :host {
        @apply --io-icon;
        fill: currentcolor;
      }
      :host:not([icon]) {
        display: none;
      }
      :host[stroke] {
        stroke: currentcolor;
        stroke-width: var(--io-stroke-width);
      }
      :host > svg {
        height: 100%;
      }
      :host > svg > g {
        transform-origin: 0px 0px;
      }
    `;
  }
  @Property({value: '', reflect: 'prop'})
  declare icon: string;

  @Property({value: false, reflect: 'prop'})
  declare stroke: boolean;

  iconChanged() {
    if (this.icon.search(':') !== -1) {
      this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
    } else {
      this.textNode = this.icon;
    }
  }
}
