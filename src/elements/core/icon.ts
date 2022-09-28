import {IoElement, RegisterIoElement} from '../../core/element.js';
import {IoProperty} from '../../core/internals/property.js';
import {IoIconsetSingleton} from './iconset.js';

@RegisterIoElement
export class IoIcon extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-icon;
      pointer-events: none;
    }
    :host {
      fill: var(--io-color, currentcolor);
      width: inherit !important;
    }
    :host:not([icon]) {
      display: none;
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      transform-origin: 0px 0px;
    }
    `;
  }
  @IoProperty({value: '', reflect: 'prop'})
  declare icon: string;

  @IoProperty({value: false})
  declare stroke: boolean;

  iconChanged() {
    if (this.icon.search(':') !== -1) {
      this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
    } else {
      this.textNode = this.icon;
    }
  }
}
