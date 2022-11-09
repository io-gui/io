import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';

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
      width: var(--io-line-height) !important;
    }
    `;
  }

  @Property({value: [0, 0, 0, 0], observe: true})
  declare value: number[];

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

  components: string[] = [];

  _onValueSet(event: CustomEvent) {
    // const item = event.composedPath()[0] as HTMLElement;
    // const c = item.id as any;
    // const value = event.detail.value as number;
    // const oldValue = event.detail.oldValue as number;
    // this.value[c] = value;
    // if (this.linked) {
    //   const change = value / oldValue;
    //   for (const i in this.components) {
    //     const p = this.components[i] as any;
    //     if (oldValue === 0) {
    //       this.value[p] = value;
    //     } else if (p !== c) {
    //       this.value[p] *= change;
    //     }
    //   }
    // }
    // // TODO: test
    // const detail = {object: this.value, property: this.linked ? null : c, value: value, oldValue: oldValue};
    // this.dispatchEvent('object-mutated', detail, false, window);
  }
  valueChanged() {
    this.components = Object.keys(this.value).filter((key: any) => typeof this.value[key] === 'number');
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
