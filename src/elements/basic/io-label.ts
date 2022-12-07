import { IoElement, RegisterIoElement } from '../../core/element.js';

@RegisterIoElement
export class IoLabel extends IoElement {
  static get Style() {
    return /* css */`
      --io-label: {
        display: inline-block;
        height: var(--ioLineHeight);
        line-height: var(--ioLineHeight);
        font-size: var(--ioFontSize);
        padding: 0 var(--ioSpacing);
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
