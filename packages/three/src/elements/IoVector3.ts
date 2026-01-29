import { Register, IoElement, ReactiveProperty, IoElementProps, VDOMElement, ReactiveNode } from '@io-gui/core'
import { ioNumber, ioBoolean } from '@io-gui/inputs'
import { Vector3 } from 'three/webgpu'

const keys: Array<keyof Vector3> = ['x', 'y', 'z']

export type IoVector3Props = IoElementProps & {
  value?: Vector3
  conversion?: number
  step?: number
  min?: number
  max?: number
  linkable?: boolean
  linked?: boolean
  ladder?: boolean
  disabled?: boolean
}
/**
 * Input element for Vector3.
 **/
@Register
export class IoVector3 extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 auto;
        max-width: 100%;
        overflow: hidden;
      }
      :host > io-number {
        flex: 1 1 0;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `
  }

  @ReactiveProperty({type: Vector3, init: null})
  declare value: Vector3

  @ReactiveProperty(1)
  declare conversion: number

  @ReactiveProperty(0.001)
  declare step: number

  @ReactiveProperty(-Infinity)
  declare min: number

  @ReactiveProperty(Infinity)
  declare max: number

  @ReactiveProperty(false)
  declare linkable: boolean

  @ReactiveProperty(false)
  declare linked: boolean

  @ReactiveProperty(true)
  declare ladder: boolean

  @ReactiveProperty(false)
  declare disabled: boolean

  private _ratios: any = {}

  constructor(args: IoVector3Props) {
    super(args)
  }

  _onNumberPointerDown(event: PointerEvent) {
    const item = event.composedPath()[0] as HTMLElement
    const id = item.id as keyof typeof this.value
    this._ratios = {}
    if (this.linked && this.value[id] !== 0) {
      const value = this.value as any
      for (const k of keys) this._ratios[k] = value[k] / value[id]
    }
  }

  _onNumberValueInput(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement
    const id = item.id as keyof typeof this.value;
    (this.value as any)[id] = event.detail.value
    if (this.linked) {
      for (const k of keys) {
        const value = this.value as any
        if (k !== id && this._ratios[k]) (value as any)[k] = value[id] * this._ratios[k]
      }
    }
    if (!(this.value as unknown as ReactiveNode)._isNode) {
      this.dispatchMutation(this.value)
    }
  }

  valueMutated() {
    this.debounce(this.changed)
  }
  changed() {
    const vChildren: Array<VDOMElement | null> = []
    for (const k of keys) {
      const value = this.value[k] as number
      if (value !== undefined) {
        vChildren.push(ioNumber({
          id: k as string,
          value: value,
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: this.ladder,
          disabled: this.disabled,
          '@pointerdown': this._onNumberPointerDown,
          '@value-input': this._onNumberValueInput,
        }))
      }
    }
    vChildren.push(this.linkable ? ioBoolean({value: this.bind('linked') as any, true: 'io:link', false: 'io:unlink'}) : null)
    this.render(vChildren)
  }
}
export const ioVector3 = function(arg0?: IoVector3Props) {
  return IoVector3.vConstructor(arg0)
}