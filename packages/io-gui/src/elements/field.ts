
import { Register } from '../core/decorators/register';
import { IoElement } from '../core/element';

@Register
export class IoFiiiiiiiiield extends IoElement {
  static get Style() {
    return /* css */`
      --ioFiiiiiiiiield: {
        height: var(--io_fieldHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        border: var(--io_border);
        padding: var(--io_spacing);
        color: var(--io_color);
      }
      :host {
        @apply --ioFiiiiiiiiield;
      }
    `;
  }
}
export const ioFiiiiiiiiield = IoFiiiiiiiiield.vDOM;

