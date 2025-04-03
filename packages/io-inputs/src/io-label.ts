import { Register, Property, IoElement } from 'io-gui';

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
      :host:not([value]) {
        display: none;
      }
    `;
  }

  @Property({value: '', type: String, reflect: true})
  declare value: string;

  valueChanged() {
    this.textNode = this.value;
  }
}
export const ioLabel = IoLabel.vDOM;
