var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
/*
 * An element with collapsable content.
 *
 * Extends `IoElement`. Implements `IoBoolean` and `IoContent`.
 *
 * <io-element-demo element="io-collapsable"
 *     properties='{
 *         "elements": [["div", "Content"]],
 *         "label": "Collapsable",
 *         "expanded": true}'>
 * </io-element-demo>
 *
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
let IoCollapsable = class IoCollapsable extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
      width: auto;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
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
            elements: Array,
            label: {
                reflect: 'prop',
            },
            expanded: {
                type: Boolean,
                reflect: 'prop',
            },
            role: 'region',
        };
    }
    changed() {
        this.template([
            ['io-boolean', { true: this.label, false: this.label, value: this.bind('expanded') }],
            ['io-content', { elements: this.elements, expanded: this.expanded }],
        ]);
    }
};
IoCollapsable = __decorate([
    RegisterIoElement
], IoCollapsable);
export { IoCollapsable };
//# sourceMappingURL=collapsable.js.map