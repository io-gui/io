var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import './properties.js';
/*
 * Extends `IoElement`. Implements `IoProperties` and `IoBoolean`.
 *
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsable element. It can be configured to use custom property editors and display only specified properties.
 *
 * <io-element-demo element="io-object" properties='{"expanded": true, "label": "Custom Object Label", "labeled": true, "value": {"hello": "world"}}'></io-element-demo>
 **/
let IoObject = class IoObject extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-panel;
    }
    :host > io-boolean {
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 1.125em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > :nth-child(n+2) {
      margin-top: var(--io-spacing);
    }
    `;
    }
    static get Properties() {
        return {
            value: Object,
            properties: Array,
            config: Object,
            labeled: true,
            label: {
                reflect: 'prop',
            },
            expanded: {
                type: Boolean,
                reflect: 'prop',
            },
            slotted: Array,
            role: 'region',
        };
    }
    changed() {
        const label = this.label || this.value.constructor.name;
        const elements = [['io-boolean', { true: label, false: label, value: this.bind('expanded') }]];
        if (this.expanded) {
            elements.push(['io-properties', {
                    value: this.value,
                    properties: this.properties,
                    config: this.config,
                    labeled: this.labeled,
                    slotted: this.slotted,
                }]);
        }
        this.template(elements);
        this.setAttribute('aria-expanded', String(this.expanded));
    }
};
IoObject = __decorate([
    RegisterIoElement
], IoObject);
export { IoObject };
//# sourceMappingURL=object.js.map