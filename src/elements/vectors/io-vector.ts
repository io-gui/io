import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import '../basic/io-boolean.js';

@RegisterIoElement
export class IoVector extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: row;
        flex: 0 1;
        flex-basis: calc(var(--io-field-height) * 10);
      }
      :host > io-number {
        flex-grow: 1;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io-spacing);
      }
      :host > io-boolean {
        flex-shrink: 0;
      }
    `;
  }

  @Property({value: [0, 0, 0, 0], type: [Array, Object], observe: true})
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

  @Property({notify: false})
  declare keys: Array<keyof typeof this.value>;

  private _ratios: Record<string, number> = {};

  _onNumberPointerDown(event: PointerEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const id = item.id as keyof typeof this.value;
    this._ratios = {};
    if (this.linked && this.value[id] !== 0) {
      for (const k of this.keys) this._ratios[k] = this.value[k] / this.value[id];
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
    this.keys = Object.keys(this.value).filter(key => typeof (this.value as any)[key] === 'number') as Array<keyof typeof this.value>;
    debug: {
      if (this.keys.find(k => ['0', '1', '2', '3', 'x', 'y', 'z', 'w', 'r', 'g', 'b', 'a', 'u', 'v'].indexOf(k) === -1)) {
        console.warn('IoVector: Unrecognized vector type!');
      }
    }
  }
  changed() {
    const elements = [];
    for (const k of this.keys) {
      if (this.value[k] !== undefined) {
        elements.push(['io-number', {
          id: k,
          value: this.value[k],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: this.ladder,
          'on-pointerdown': this._onNumberPointerDown,
          'on-value-input': this._onNumberValueInput,
        }]);
      }
    }
    elements.push(this.getSlotted());
    this.template(elements);
  }
  getSlotted(): Array<any> | null {
    return this.linkable ? ['io-boolean', {value: this.bind('linked'), true: 'icons:link', false: 'icons:unlink'}] : null;
  }
}
