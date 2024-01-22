var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
let IoBreadcrumbs = class IoBreadcrumbs extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      border-radius: var(--iotBorderRadius);
      border: var(--iotBorder);
      border-color: var(--iotBorderColorInset);
      padding: var(--iotSpacing);
      background-color: var(--iotBackgroundColorField);
      overflow-x: hidden;
    }
    :host > io-field {
      padding-left: var(--iotSpacing);
      padding-right: var(--iotSpacing);
      color: var(--iotColorLink);
    }
    :host > io-field:hover {
      text-decoration: underline;
    }
    :host > io-field:first-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-left: var(--iotSpacing);
    }
    :host > io-field:last-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-right: var(--iotSpacing);
    }
    :host > io-field:not(:first-of-type):before {
      content: '>';
      margin: 0 var(--iotSpacing);
      padding: 0 var(--iotSpacing) 0 0;
      opacity: 0.25;
    }
    `;
    }
    static get Properties() {
        return {
            value: Object,
            selected: null,
            options: {
                type: Array,
                observe: true,
            },
        };
    }
    _onClick(event) {
        this.setProperty('selected', this.options[event.detail.value]);
    }
    valueChanged() {
        this.options.length = 0;
        // TODO: check for memory leaks
        this.options.push(this.value);
    }
    selectedChanged() {
        const index = this.options.indexOf(this.selected);
        if (index !== -1) {
            // TODO: check for memory leaks
            this.options.length = index + 1;
        }
        else {
            // TODO: check for memory leaks
            this.options.push(this.selected);
        }
    }
    changed() {
        const elements = [];
        for (let i = 0; i < this.options.length; i++) {
            elements.push(['io-field', {
                    class: 'select',
                    value: this.options[i],
                    label: getLabel(this.options[i]),
                    '@item-clicked': this._onClick,
                }]);
        }
        this.template(elements);
    }
};
IoBreadcrumbs = __decorate([
    Register
], IoBreadcrumbs);
export { IoBreadcrumbs };
function getLabel(object) {
    if (object instanceof Array) {
        return String(`${object.constructor.name} (${object.length})`);
    }
    else if (typeof object === 'object') {
        return String(`${object.constructor.name}`);
    }
    else {
        return String(object);
    }
}
//# sourceMappingURL=io-breadcrumbs.js.map