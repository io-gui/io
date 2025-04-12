import { Register, IoElement, Property, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
import { ioNumber, ioBoolean } from 'io-inputs';

export type IoVectorArgs = IoElementArgs & ArgsWithBinding<{
  value?: {x: number, y: number, z?: number, w?: number} | number[];
  conversion?: number;
  step?: number;
  min?: number;
  max?: number;
  linkable?: boolean;
  linked?: boolean;
  ladder?: boolean;
}>;
/**
 * Input element for vector arrays and objects.
 **/
@Register
export class IoVector extends IoElement {
  static vConstructor: (arg0?: IoVectorArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 0 1 auto;
        min-width: var(--io_fieldHeight5);
        width: var(--io_fieldHeight8);
      }
      :host > io-number {
        flex: 1 1 100%;
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

  @Property({})
  declare value: {x: number, y: number, z?: number, w?: number} | number[];

  @Property(1)
  declare conversion: number;

  @Property(0.001)
  declare step: number;

  @Property(-Infinity)
  declare min: number;

  @Property(Infinity)
  declare max: number;

  @Property(false)
  declare linkable: boolean;

  @Property(false)
  declare linked: boolean;

  @Property(true)
  declare ladder: boolean;

  @Property({type: Array})
  declare keys: string[];

  private _ratios: Record<string, number> = {};

  _onNumberPointerDown(event: PointerEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const id = item.id as keyof typeof this.value;
    this._ratios = {};
    if (this.linked && this.value[id] !== 0) {
      for (const k of this.keys as [keyof typeof this.value]) this._ratios[k] = this.value[k] / this.value[id];
    }
  }

  _onNumberValueInput(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const id = item.id as keyof typeof this.value;
    const newValue = event.detail.value;
    const oldValue = event.detail.oldValue;
    const value = this.value as any;
    value[id] = newValue;

    if (this.linked) {
      for (const k of this.keys) {
        if (k !== id && this._ratios[k]) value[k] = value[id] * this._ratios[k];
      }
    }
    const detail = this.linked ? {object: this.value} : {object: this.value, property: id, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
  }

  valueChanged() {
    this.keys.length = 0;
    this.keys.push(...Object.keys(this.value).filter(key => typeof (this.value as any)[key] === 'number') as Array<keyof typeof this.value>);
    debug: if (this.keys.find(k => ['0', '1', '2', '3', 'x', 'y', 'z', 'w', 'r', 'g', 'b', 'a', 'u', 'v'].indexOf(k) === -1)) {
      console.warn('IoVector: Unrecognized vector type!');
    }
  }
  changed() {
    const elements: Array<VDOMElement | null> = [];
    for (const k of this.keys as [keyof typeof this.value]) {
      if (this.value[k] !== undefined) {
        elements.push(ioNumber({
          id: k, // Consider removing global id collisions
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
    elements.push(this.getSlotted());
    this.template(elements);
  }
  getSlotted(): VDOMElement | null {
    return this.linkable ? ioBoolean({value: this.bind('linked') as any, true: 'io:link', false: 'io:unlink'}) : null;
  }
}
export const ioVector = IoVector.vConstructor;