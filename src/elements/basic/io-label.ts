import { IoElement, RegisterIoElement } from '../../core/element.js';

@RegisterIoElement
export class IoLabel extends IoElement {
  static get Style() {
    return /* css */`
      --io-label: {
        display: inline-block;
        height: var(--io-line-height);
        line-height: var(--io-line-height);
        font-size: var(--io-font-size);
        padding: 0 var(--io-spacing);
      }
      :host {
        @apply --io-label;
      }
      :host:not([label]) {
        display: none;
      }
    `;
  }
  labelChanged() {
    super.labelChanged();
    this.textNode = this.label;
  }
}
