import { Register } from '../../core/decorators/register.js';
import { IoElement } from '../../core/element.js';

@Register
export class IoLabel extends IoElement {
  static get Style() {
    return /* css */`
      --ioLabel: {
        display: inline-block;
        height: var(--io_lineHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        padding: 0 var(--io_spacing);
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
