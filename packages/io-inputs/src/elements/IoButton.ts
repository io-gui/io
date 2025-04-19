import { Register, Property, span, ArgsWithBinding } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';

export type IoButtonArgs = IoInputBaseArgs & ArgsWithBinding<{
  action?: Function;
}>;

/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
@Register
export class IoButton extends IoInputBase {
  static get Style() {
    return /* css */`
      :host {
        text-align: center;
        padding-left: calc(2 * var(--io_spacing));
        padding-right: calc(2 * var(--io_spacing));
        color: var(--io_colorStrong);
      }
      :host > io-icon {
        margin-right: var(--io_spacing);
      }
      :host > span {
        vertical-align: top;
      }
    `;
  }
  @Property({value: undefined, type: undefined, reflect: false})
  declare value: any;

  @Property(undefined)
  declare action?: Function;

  @Property({value: 'outset', type: String, reflect: true})
  declare appearance: 'inset' | 'outset' | 'neutral';

  @Property('button')
  declare role: string;

  constructor(args: IoButtonArgs = {}) { super(args); }

  onPointerdown(event: PointerEvent) {
    event.preventDefault();
    super.onPointerdown(event);
  }
  onKeydown(event: KeyboardEvent) {
    super.onKeydown(event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
    }
  }
  onKeyup(event: KeyboardEvent) {
    super.onKeyup(event);
    this.pressed = false;
  }
  onClick(event: MouseEvent) {
    if (typeof this.action === 'function') this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value}, true);
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('aria-pressed', String(this.pressed));
    this.template([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label) : null
    ]);
  }
}
export const ioButton = IoButton.vConstructor;