import { Register, Property, span, WithBinding, Field } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'
import { IoField, IoFieldProps } from './IoField.js'

export type IoBooleanProps = IoFieldProps & {
  value?: WithBinding<boolean>
  true?: string
  false?: string
}

/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` strings.
 **/
@Register
export class IoBoolean extends IoField {

  static override get Style() {
    return /* css */`
      :host {
        padding: var(--io_spacing);
      }
    `
  }

  @Property({value: false, type: Boolean, reflect: true})
  declare value: boolean

  @Property({value: 'true', type: String})
  declare true: string

  @Property({value: 'false', type: String})
  declare false: string

  @Field('checkbox')
  declare role: string

  constructor(args: IoBooleanProps = {}) { super(args) }

  override onClick() {
    this.toggle()
    this.dispatch('io-boolean-clicked', {value: this.value}, true)
  }
  toggle() {
    this.inputValue(!this.value)
  }
  override ready() {
    this.valueChanged()
    this.mutated()
  }
  valueChanged() {
    this.invalid = typeof this.value !== 'boolean'
    this.setAttribute('aria-checked', String(!!this.value))
  }
  override mutated() {
    const value = this.value ? this.true : this.false
    this.render([
      this.icon ? ioIcon({value: this.icon}) : null,
      // TODO: Make more robust, it should work with any iconset and show text if no icon is found
      value ? value.startsWith('io:') ? ioIcon({value: value}) : span(value) : null
    ])
  }
}
export const ioBoolean = function(arg0?: IoBooleanProps) {
  return IoBoolean.vConstructor(arg0)
}
