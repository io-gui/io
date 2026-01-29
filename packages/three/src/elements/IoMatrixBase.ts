import { Register, IoElement, Property, ReactiveProperty, IoElementProps, VDOMElement, ReactiveNode } from '@io-gui/core'
import { ioNumber } from '@io-gui/inputs'

export type IoMatrixBaseProps = IoElementProps & {
  value?: number[]
  disabled?: boolean
}
/**
 * Input element for vector arrays and objects.
 **/
@Register
export class IoMatrixBase extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: grid;
        align-self: stretch;
        justify-self: stretch;
        grid-gap: var(--io_spacing);
        max-width: 100%;
        overflow: hidden;
        flex: 1 1 auto;
      }
      :host > io-number {
        flex: 1 1 auto;
      }
      :host > *:not(:last-child) {
        margin-right: 0;
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `
  }

  @ReactiveProperty({type: Array})
  declare value: Array<number>

  @ReactiveProperty({value: false, type: Boolean})
  declare disabled: boolean

  @Property({type: Array, init: null})
  declare keys: number[]

  constructor(args: IoMatrixBaseProps) {
    super(args)
  }

  _onNumberValueInput(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement
    this.value[item.id as any] = event.detail.value
    if (!(this.value as unknown as ReactiveNode)._isNode) {
      this.dispatchMutation(this.value)
    }
    // TODO: Rewise and normalize 'value-input' event
    this.dispatch('value-input', {property: item.id, value: this.value}, false)
  }

  valueChanged() {
    this.keys.length = 0
    this.keys = Array.from(Array(this.value.length).keys())
  }

  valueMutated() {
    this.debounce(this.changed)
  }
  changed() {
    const vChildren: Array<VDOMElement | null> = []
    for (const k of this.keys) {
      if (this.value[k] !== undefined) {
        vChildren.push(ioNumber({
          id: String(k),
          value: this.value[k],
          step: 0.00001,
          disabled: this.disabled,
          '@value-input': this._onNumberValueInput,
        }))
      }
    }
    this.render(vChildren)
  }
}