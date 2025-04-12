import { Register, Property, span, ArgsWithBinding } from 'io-gui';
import { ioIcon } from 'io-icons';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';

export type IoButtonArgs = IoInputBaseArgs & ArgsWithBinding<{
  action?: Function;
  pressed?: boolean;
}>;

/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
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
      :host[pressed] {
        border-color: var(--io_borderColorInset);
      }
      :host > io-icon {
        margin-right: var(--io_spacing);
      }
      :host > span {
        vertical-align: top;
      }
    `;
  }

  @Property(undefined)
  declare action?: Function;

  @Property({value: undefined, type: undefined, reflect: false})
  declare value: any;

  @Property({value: 'outset', type: String, reflect: true})
  declare appearance: 'flush' | 'inset' | 'outset' | 'neutral';

  @Property({value: false, type: Boolean, reflect: true})
  declare pressed: boolean;

  @Property('button')
  declare role: string;

  constructor(args: IoButtonArgs = {}) { super(args); }

  onPointerdown(event: PointerEvent) {
    super.onPointerdown(event);
    this.pressed = true;
  }
  onPointerleave(event: PointerEvent) {
    super.onPointerleave(event);
    this.pressed = false;
  }
  onPointerup(event: PointerEvent) {
    super.onPointerup(event);
    this.pressed = false;
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
  onClick() {
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