var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, ReactiveProperty, div, Property } from '@io-gui/core';
import { ioBoolean } from '@io-gui/inputs';
/**
 * An element with collapsible content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
let IoCollapsible = class IoCollapsible extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-self: stretch;
      box-sizing: content-box;
      align-items: stretch;
      align-self: stretch;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) - var(--io_spacing));
      border-color: var(--io_borderColorOutset);
      min-height: var(--io_fieldHeight);
      background-color: var(--io_bgColorLight);
    }
    :host > io-boolean {
      flex: 0 0 auto;
      padding-left: 0;
      margin: var(--io_spacing) var(--io_spacing2);
      border-radius: 0;
      background-color: transparent;
    }
    :host > io-boolean:before {
      text-align: center;
      width: var(--io_lineHeight);
      margin-right: var(--io_spacing2);
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾"
    }
    :host > div.io-collapsible-content {
      position: relative;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      overflow: auto;
      background-color: var(--io_bgColorStrong);
    }
    :host[direction=row] > div.io-collapsible-content {
      flex-direction: row;
    }
    :host > div.io-collapsible-content:not(:empty) {
      margin: var(--io_spacing);
      margin-top: 0;
      padding: var(--io_spacing);
      border-radius: var(--io_borderRadius);
    }
    `;
    }
    changed() {
        this.render([
            // TODO: consider implementing caching
            ioBoolean({ icon: this.icon, true: this.label, false: this.label, value: this.bind('expanded') }),
            div({ class: 'io-collapsible-content' }, this.expanded ? this.elements : []),
        ]);
    }
};
__decorate([
    ReactiveProperty(Array)
], IoCollapsible.prototype, "elements", void 0);
__decorate([
    ReactiveProperty('')
], IoCollapsible.prototype, "label", void 0);
__decorate([
    ReactiveProperty({ value: 'column', reflect: true })
], IoCollapsible.prototype, "direction", void 0);
__decorate([
    ReactiveProperty('')
], IoCollapsible.prototype, "icon", void 0);
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoCollapsible.prototype, "expanded", void 0);
__decorate([
    Property('region')
], IoCollapsible.prototype, "role", void 0);
IoCollapsible = __decorate([
    Register
], IoCollapsible);
export { IoCollapsible };
export const ioCollapsible = function (arg0) {
    return IoCollapsible.vConstructor(arg0);
};
//# sourceMappingURL=IoCollapsible.js.map