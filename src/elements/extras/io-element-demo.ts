import { Register } from '../../core/decorators/register.js';
import { IoElement } from '../../core/element.js';
import '../objct/io-properties.js';
import '../basic/io-boolicon.js';

@Register
export class IoElementDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      /* Panel */
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      color: var(--io_colorField);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing);
      /*  */
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      position: relative;
    }
    :host > io-boolean {
      z-index: 2;
      position: absolute !important;
      top: calc(calc(2 * var(--io_spacing)) + var(--io_borderWidth));
      right: calc(calc(2 * var(--io_spacing)) + var(--io_borderWidth));
    }
    :host > io-boolean:not([value]):not(:hover) {
      opacity: 0.5;
    }
    :host > io-properties {
      align-self: stretch;
      padding: var(--io_spacing) 0;
      margin: var(--io_borderWidth);
      margin-right: var(--io_spacing);
      margin-bottom: calc(2 * var(--io_spacing));
    }
    :host > io-properties > :nth-child(3) {
      margin-right: calc(var(--io_fieldHeight) + var(--io_spacing));
    }
    :host > .io-content {
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      padding: var(--io_spacing);
      color: var(--io_color);
      background-color: var(--io_bgColor);
      background-image: none;
    }
    :host:not([expanded]) > .io-content {
      margin-right: calc(var(--io_fieldHeight) + calc(3 * var(--io_spacing)));
    }
    `;
  }
  static get Properties(): any {
    return {
      element: {
        type: String,
        reflect: true,
      },
      properties: {
        type: Object,
        reflect: true,
      },
      width: {
        type: String,
        reflect: true,
      },
      height: {
        type: String,
        reflect: true,
      },
      config: {
        type: Object,
        reflect: true,
      },
      expanded: {
        type: Boolean,
        reflect: true,
      }
    };
  }
  // objectMutated = (prop: string) => {
  //   super.objectMutated(prop);
  //   // for (let i = this._protochain.mutationObservedProperties.length; i--;) {
  //   //   const prop = this._protochain.mutationObservedProperties[i];
  //   //   const value = this._properties.get(prop)!.value;
  //   //   const hasObject = !!this._filterObject(value, o => { return o === event.detail.object; });
  //   //   if (hasObject) {
  //   //     const children = this.querySelectorAll('*');
  //   //     for (let i = 0; i < children.length; i++) {
  //   //       if (children[i].changed) children[i].changed();
  //   //     }
  //   //   }
  //   // }
  // };
  changed() {
    const properties = this.properties;
    const elements: any = [['io-boolicon', {value: this.bind('expanded'), true: 'icons:tune', false: 'icons:tune'}]];
    if (this.expanded) {
      elements.push(['io-properties', {
        value: properties,
        config: Object.assign({
          'type:number': ['io-number', {step: 0.00001}],
          'type:boolean': ['io-switch'],
        }, this.config)}
      ]);
    }
    elements.push(['div', [
      [this.element, Object.assign({'id': 'demo-element'}, properties)],
    ]]);
    this.template(elements);
    if (this.width) this.$['demo-element'].style.width = this.width;
    if (this.height) this.$['demo-element'].style.height = this.height;
    if (this.$['demo-element'].onResized) this.$['demo-element'].onResized();
  }
}
