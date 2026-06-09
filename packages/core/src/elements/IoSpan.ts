import { ReactiveProperty } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { Binding } from '../core/Binding.js'
import { IoElement, IoElementProps } from './IoElement.js'

type IoSpanProps = IoElementProps & {
  value?: string | Binding
}

@Register
export class IoSpan extends IoElement {
  constructor(props: IoSpanProps) {
    super(props)
  }

  static get Style() {
    return /* css */`
      :host {
        display: inline-block;
      }
    `
  }

  @ReactiveProperty({type: String, value: ''})
  declare value: string

  valueChanged() {
    this.innerText = this.value
  }
}

export const ioSpan = function(props?: IoSpanProps) {
  return IoSpan.vConstructor(props)
}