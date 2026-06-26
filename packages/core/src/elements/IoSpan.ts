import { Property } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { WithBinding } from '../nodes/ReactiveObject.js'
import { ReactiveElement, IoElementProps } from './ReactiveElement.js'

type IoSpanProps = IoElementProps & {
  value?: WithBinding<string>
}

/** Inline text element; `value` updates `innerText`. */
@Register
export class IoSpan extends ReactiveElement {
  constructor(props: IoSpanProps) {
    super(props)
  }

  static override get Style() {
    return /* css */`
      :host {
        display: inline-block;
      }
    `
  }

  @Property({type: String, value: ''})
  declare value: string

  valueChanged() {
    this.innerText = this.value
  }
}

export const ioSpan = function(props?: IoSpanProps) {
  return IoSpan.vConstructor(props)
}