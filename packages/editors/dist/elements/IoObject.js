var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property } from '@io-gui/core';
import { ioBoolean } from '@io-gui/inputs';
import { ioPropertyEditor } from './IoPropertyEditor.js';
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
let IoObject = class IoObject extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-boolean {
      padding: var(--io_spacing) var(--io_spacing2);
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
    :host > io-property-editor {
      margin: var(--io_spacing);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
    }
    `;
    }
    changed() {
        const label = this.label || this.value.constructor.name;
        const vChildren = [];
        vChildren.push(ioBoolean({
            appearance: 'neutral',
            true: label,
            false: label,
            value: this.bind('expanded')
        }));
        if (this.expanded) {
            vChildren.push(ioPropertyEditor({
                value: this.value,
                properties: this.properties,
                config: this.config,
                groups: this.groups,
                widgets: this.widgets,
                labeled: this.labeled,
            }));
        }
        this.render(vChildren);
        this.setAttribute('aria-expanded', String(this.expanded));
    }
};
__decorate([
    ReactiveProperty()
], IoObject.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoObject.prototype, "properties", void 0);
__decorate([
    ReactiveProperty(true)
], IoObject.prototype, "labeled", void 0);
__decorate([
    ReactiveProperty('')
], IoObject.prototype, "label", void 0);
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoObject.prototype, "expanded", void 0);
__decorate([
    ReactiveProperty({ type: Map, init: null })
], IoObject.prototype, "config", void 0);
__decorate([
    ReactiveProperty({ type: Map, init: null })
], IoObject.prototype, "groups", void 0);
__decorate([
    ReactiveProperty({ type: Map, init: null })
], IoObject.prototype, "widgets", void 0);
__decorate([
    Property('region')
], IoObject.prototype, "role", void 0);
IoObject = __decorate([
    Register
], IoObject);
export { IoObject };
export const ioObject = function (arg0) {
    return IoObject.vConstructor(arg0);
};
//# sourceMappingURL=IoObject.js.map