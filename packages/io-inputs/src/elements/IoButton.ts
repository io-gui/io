import { Register, ReactiveProperty, span, Property } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoField, IoFieldProps } from './IoField.js';

export type IoButtonProps = IoFieldProps & {
  action?: Function,
};

/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
@Register
export class IoButton extends IoField {
  static get Style() {
    return /* css */`
      :host {
        text-align: center;
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
  @ReactiveProperty({value: undefined})
  declare value: any;

  @ReactiveProperty()
  declare action?: Function;

  @ReactiveProperty({value: 'outset', type: String, reflect: true})
  declare appearance: 'inset' | 'outset' | 'neutral';

  @Property('button')
  declare role: string;

  constructor(args: IoButtonProps = {}) { super(args); }

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
    this.dispatch('io-button-clicked', {value: this.value}, true);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.setAttribute('aria-pressed', String(this.pressed));
    this.render([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label) : null
    ]);
  }
}
export const ioButton = function(arg0?: IoButtonProps) {
  return IoButton.vConstructor(arg0);
};