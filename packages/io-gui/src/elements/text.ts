import { Register } from '../decorators/register';
import { IoElement } from '../elements/element';

@Register
export class IoText extends IoElement {
  static get Style() {
    return /* css */`
      --ioText: {
        display: inline-block;
        height: var(--io_lineHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        color: var(--io_color);
      }
      :host {
        @apply --ioText;
      }
    `;
  }
}
export const ioText = IoText.vConstructor;
