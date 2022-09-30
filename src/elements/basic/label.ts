import { IoElement, RegisterIoElement } from '../../core/element.js';

@RegisterIoElement
export class IoLabel extends IoElement {
  static get Style() {
    return /* css */`
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
