var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement } from '../../core/element.js';
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
/**
 * An element with collapsable content.
 * When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.
 **/
let IoCollapsable = class IoCollapsable extends IoElement {
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
      border: var(--iotBorder);
      border-radius: calc(var(--iotBorderRadius) - var(--iotSpacing));
      border-color: var(--iotBorderColorOutset);
      min-height: var(--iotFieldHeight);
      background-color: var(--iotBackgroundColorDimmed);
    }
    :host > io-boolean {
      flex: 0 0 auto;
      padding-left: 0;
      margin: var(--iotSpacing) var(--iotSpacing2);
      border-radius: 0;
      background-color: transparent;
    }
    :host > io-boolean:before {
      text-align: center;
      width: var(--iotLineHeight);
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾"
    }
    :host > div.io-collapsable-content {
      position: relative;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      overflow: auto;
      background-color: var(--iotBackgroundColorStrong);
    }
    :host[direction=row] > div.io-collapsable-content {
      flex-direction: row;
    }
    :host > div.io-collapsable-content:not(:empty) {
      margin: var(--iotSpacing);
      margin-top: 0;
      padding: var(--iotSpacing);
      border-radius: var(--iotBorderRadius);
    }
    `;
    }
    changed() {
        this.template([
            // TODO: consider implementing caching
            ['io-boolean', { true: this.label, false: this.label, icon: this.icon, value: this.bind('expanded') }],
            ['div', { class: 'io-collapsable-content' }, this.expanded ? this.elements : []],
        ]);
    }
};
__decorate([
    Property(Array)
], IoCollapsable.prototype, "elements", void 0);
__decorate([
    Property('')
], IoCollapsable.prototype, "label", void 0);
__decorate([
    Property({ value: 'column', reflect: true })
], IoCollapsable.prototype, "direction", void 0);
__decorate([
    Property('')
], IoCollapsable.prototype, "icon", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoCollapsable.prototype, "expanded", void 0);
__decorate([
    Property('region')
], IoCollapsable.prototype, "role", void 0);
IoCollapsable = __decorate([
    Register
], IoCollapsable);
export { IoCollapsable };
//# sourceMappingURL=io-collapsable.js.map