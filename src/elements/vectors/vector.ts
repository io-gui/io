import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import '../basic/boolean.js';

// TODO: preserve linked scaling through zero.
@RegisterIoElement
export class IoVector extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: row;
        flex: 0 1 17.4em;
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

  @Property({notify: false})
  declare components: string[];

  _onValueSet(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const c = item.id as any;
    const newValue = event.detail.value as number;
    const oldValue = event.detail.oldValue as number;
    const value = this.value as any;
    value[c] = newValue;
    if (this.linked) {
      const change = newValue / oldValue;
      for (const i in this.components) {
        const p = this.components[i] as any;
        if (oldValue === 0) {
          value[p] = newValue;
        } else if (p !== c) {
          value[p] *= change;
        }
      }
    }
    // TODO: test
    const detail = {object: this.value, property: this.linked ? null : c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
  }
  valueChanged() {
    this.components = Object.keys(this.value).filter(key => typeof (this.value as any)[key] === 'number');
  }
  changed() {
    const elements = [];
    for (const i in this.components) {
      const c = this.components[i] as keyof typeof this.value;
      if (this.value[c] !== undefined) {
        elements.push(['io-number', {
          id: c,
          value: this.value[c],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: true,
          'on-value-input': this._onValueSet
        }]);
      }
    }
    elements.push(this.getSlotted());
    this.template(elements);
  }
  getSlotted() {
    return this.linkable ? ['io-boolean', {value: this.bind('linked'), true: 'icons:link', false: 'icons:unlink'}] : null;
  }
}
