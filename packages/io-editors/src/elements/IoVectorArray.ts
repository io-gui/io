import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, VDOMElement, Node } from 'io-core';
import { ioNumber, ioBoolean } from 'io-inputs';

export type IoVectorArrayProps = IoElementProps & {
  value?: number[],
  conversion?: number,
  step?: number,
  min?: number,
  max?: number,
  linkable?: boolean,
  linked?: WithBinding<boolean>,
  ladder?: boolean,
};
/**
 * Input element for vector arrays and objects.
 **/
@Register
export class IoVectorArray extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 auto;
      }
      :host > io-number {
        flex: 1 1 auto;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `;
  }

  @ReactiveProperty({type: Array, init: null})
  declare value: number[];

  @ReactiveProperty(1)
  declare conversion: number;

  @ReactiveProperty(0.001)
  declare step: number;

  @ReactiveProperty(-Infinity)
  declare min: number;

  @ReactiveProperty(Infinity)
  declare max: number;

  @ReactiveProperty(false)
  declare linkable: boolean;

  @ReactiveProperty(false)
  declare linked: boolean;

  @ReactiveProperty(true)
  declare ladder: boolean;

  @ReactiveProperty({type: Array, init: null})
  declare keys: number[];

  private _ratios: any = {};

  _onNumberPointerDown(event: PointerEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const id = item.id as keyof typeof this.value;
    this._ratios = {};
    if (this.linked && this.value[id] !== 0) {
      const value = this.value as any;
      for (const k of this.keys as [keyof typeof value]) this._ratios[k] = value[k] / value[id];
    }
  }

  _onNumberValueInput(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const index = Number(item.id);
    (this.value as any)[index] = event.detail.value;
    if (this.linked) {
      for (const k of this.keys) {
        const value = this.value as any;
        if (k !== index && this._ratios[k]) (value as any)[k] = value[index] * this._ratios[k];
      }
    }
    if (!(this.value as unknown as Node)._isNode) {
      this.dispatchMutation(this.value);
    }
    this.dispatch('value-input', {property: 'value', value: this.value}, false);
  }

  valueChanged() {
    this.keys.length = 0;
    this.keys = Array.from(Array(this.value.length).keys());
    debug: if (this.keys.find(k => [0, 1, 2, 3].indexOf(k) === -1)) {
      console.warn('IoVectorArray: Unrecognized vector type!');
    }
  }
  valueMutated() {
    this.debounce(this.changed);
  }
  changed() {
    const vChildren: Array<VDOMElement | null> = [];
    for (const k of this.keys) {
      if (this.value[k] !== undefined) {
        vChildren.push(ioNumber({
          id: String(k), // Consider removing global id collisions
          value: this.value[k],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: this.ladder,
          '@pointerdown': this._onNumberPointerDown,
          '@value-input': this._onNumberValueInput,
        }));
      }
    }
    vChildren.push(this.linkable ? ioBoolean({value: this.bind('linked') as any, true: 'io:link', false: 'io:unlink'}) : null);
    this.render(vChildren);
  }
}
export const ioVectorArray = function(arg0?: IoVectorArrayProps) {
  return IoVectorArray.vConstructor(arg0);
};