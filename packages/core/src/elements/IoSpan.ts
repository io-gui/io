import { ReactiveProperty } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { WithBinding } from '../nodes/ReactiveNode.js'
import { IoElement, IoElementProps } from './IoElement.js'

type IoSpanProps = IoElementProps & {
  value?: WithBinding<string>
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