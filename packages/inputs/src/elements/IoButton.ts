import { Register, Property, span, Field } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'
import { IoField, IoFieldProps } from './IoField.js'

export type IoButtonProps = IoFieldProps & {
  action?: (value: unknown) => void
}

/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
@Register
export class IoButton extends IoField {
  static override get Style() {
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
    `
  }
  @Property({value: undefined})
  declare value: unknown

  @Property()
  declare action?: (value: unknown) => void

  @Property({value: 'outset', type: String, reflect: true})
  declare appearance: 'inset' | 'outset' | 'neutral'

  @Field('button')
  declare role: string

  constructor(args: IoButtonProps = {}) { super(args) }

  override onPointerdown(event: PointerEvent) {
    event.preventDefault()
    super.onPointerdown(event)
  }
  override onKeydown(event: KeyboardEvent) {
    super.onKeydown(event)
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true
    }
  }
  override onKeyup(event: KeyboardEvent) {
    super.onKeyup(event)
    this.pressed = false
  }
  override onClick(event: MouseEvent) {
    if (typeof this.action === 'function') this.action(this.value)
    this.dispatch('io-button-clicked', {value: this.value}, true)
  }
  override ready() {
    this.mutated()
  }
  override mutated() {
    this.setAttribute('aria-pressed', String(this.pressed))
    this.render([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.label ? span(this.label) : null
    ])
  }
}
export const ioButton = function(arg0?: IoButtonProps) {
  return IoButton.vConstructor(arg0)
}