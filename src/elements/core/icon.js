import {IoElement} from '../../io.js';
import {IoIconsetSingleton} from './iconset.js';

export class IoIcon extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-item;
    }
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      border: 0;
      padding: 0;
      fill: var(--io-color, currentcolor);
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
      pointer-events: none;
      transform-origin: 0px 0px;
    }
    `;
  }
  static get Properties() {
    return {
      icon: {
        value: '',
        reflect: -1,
      },
      label: {
        value: '',
        reflect: 1,
      },
      stroke: {
        value: false,
        reflect: 1,
      },
    };
  }
  iconChanged() {
    this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
  }
}

IoIcon.Register();
