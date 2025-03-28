var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, Property } from 'io-gui';
import './io-properties.js';
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.
 **/
let IoObject = class IoObject extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      /* Panel */
      display: flex;
      flex-direction: column; */
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      color: var(--io_colorField);
      background-color: var(--io_bgColor);
    }
    :host > io-boolean {
      padding-left: 0;
      padding-right: 0;
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 0.75em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    `;
    }
    changed() {
        const label = this.label || this.value.constructor.name;
        const elements = [];
        elements.push(['io-boolean', {
                appearance: 'neutral',
                true: label,
                false: label,
                value: this.bind('expanded')
            }
        ]);
        if (this.expanded) {
            elements.push(['io-properties', {
                    value: this.value,
                    properties: this.properties,
                    config: this.config,
                    labeled: this.labeled,
                    widget: this.widget,
                }]);
        }
        this.template(elements);
        this.setAttribute('aria-expanded', String(this.expanded));
    }
};
__decorate([
    Property({})
], IoObject.prototype, "value", void 0);
__decorate([
    Property({ type: Array })
], IoObject.prototype, "properties", void 0);
__decorate([
    Property({ type: Object })
], IoObject.prototype, "config", void 0);
__decorate([
    Property({ type: Array })
], IoObject.prototype, "widget", void 0);
__decorate([
    Property(true)
], IoObject.prototype, "labeled", void 0);
__decorate([
    Property('')
], IoObject.prototype, "label", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoObject.prototype, "expanded", void 0);
__decorate([
    Property('region')
], IoObject.prototype, "role", void 0);
IoObject = __decorate([
    Register
], IoObject);
export { IoObject };
//# sourceMappingURL=io-object.js.map