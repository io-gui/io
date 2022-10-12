var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
/*

 **/
let IoElementDemo = class IoElementDemo extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-panel;
      position: relative;
    }
    :host > io-boolean {
      z-index: 2;
      position: absolute !important;
      top: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
      right: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
    }
    :host > io-boolean:not([value]):not(:hover) {
      opacity: 0.5;
    }
    :host > io-properties {
      align-self: stretch;
      padding: var(--io-spacing) 0;
      margin: var(--io-border-width);
      margin-right: var(--io-spacing);
      margin-bottom: calc(2 * var(--io-spacing));
    }
    :host > io-properties > :nth-child(3) {
      margin-right: calc(var(--io-field-height) + var(--io-spacing));
    }
    :host > .io-content {
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      padding: var(--io-spacing);
      box-shadow: var(--io-shadow-inset);
      color: var(--io-color);
      background-color: var(--io-background-color);
      background-image: none;
    }
    :host:not([expanded]) > .io-content {
      margin-right: calc(var(--io-field-height) + calc(3 * var(--io-spacing)));
    }
    `;
    }
    static get Properties() {
        return {
            element: {
                type: String,
                reflect: 'attr',
            },
            properties: {
                type: Object,
                reflect: 'attr',
                observe: true,
            },
            width: {
                type: String,
                reflect: 'attr',
            },
            height: {
                type: String,
                reflect: 'attr',
            },
            config: {
                type: Object,
                reflect: 'attr',
            },
            expanded: {
                type: Boolean,
                reflect: 'both',
            }
        };
    }
    objectMutated = (prop) => {
        super.objectMutated(prop);
        // for (let i = this._protochain.observedObjectProperties.length; i--;) {
        //   const prop = this._protochain.observedObjectProperties[i];
        //   const value = this._properties[prop].value;
        //   const hasObject = !!this._filterObject(value, o => { return o === event.detail.object; });
        //   if (hasObject) {
        //     const children = this.querySelectorAll('*');
        //     for (let i = 0; i < children.length; i++) {
        //       if (children[i].changed) children[i].changed();
        //     }
        //   }
        // }
    };
    changed() {
        const properties = this.properties;
        const elements = [['io-boolean', { value: this.bind('expanded'), true: 'icons:tune', false: 'icons:tune' }]];
        if (this.expanded) {
            elements.push(['io-properties', {
                    value: properties,
                    config: Object.assign({
                        'type:number': ['io-number', { step: 0.00001 }],
                        'type:boolean': ['io-switch'],
                    }, this.config)
                }
            ]);
        }
        elements.push(['div', { class: 'io-content' }, [
                [this.element, Object.assign({ 'id': 'demo-element' }, properties)],
            ]]);
        this.template(elements);
        if (this.width)
            this.$['demo-element'].style.width = this.width;
        if (this.height)
            this.$['demo-element'].style.height = this.height;
        if (this.$['demo-element'].onResized)
            this.$['demo-element'].onResized();
    }
};
IoElementDemo = __decorate([
    RegisterIoElement
], IoElementDemo);
export { IoElementDemo };
//# sourceMappingURL=element-demo.js.map