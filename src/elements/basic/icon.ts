import { IoElement, RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoIconsetSingleton } from './iconset.js';

@RegisterIoElement
export class IoIcon extends IoElement {
  static get Style() {
    return /* css */`
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
  @IoProperty({value: '', reflect: 'prop'})
  declare icon: string;

  @IoProperty({value: false, reflect: 'prop'})
  declare stroke: boolean;

  iconChanged() {
    if (this.icon.search(':') !== -1) {
      this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
    } else {
      this.textNode = this.icon;
    }
  }
}
