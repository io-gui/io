import { IoElement, RegisterIoElement } from '../../core/element.js';

@RegisterIoElement
export class IoLabel extends IoElement {
  static get Style() {
    return /* css */`
      --ioLabel: {
        display: inline-block;
        height: var(--iotLineHeight);
        line-height: var(--iotLineHeight);
        font-size: var(--iotFontSize);
        padding: 0 var(--iotSpacing);
      }
      :host {
        @apply --ioLabel;
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
