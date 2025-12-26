var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, div, Property } from 'io-core';
import { ioButton, ioString } from 'io-inputs';
import { ioPropertyLink } from './IoPropertyLink.js';
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
    }
    :host > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1 1 auto;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      border-radius: var(--io_borderRadius);
      background-color: var(--io_bgColorInput);
      overflow: hidden;
    }
    :host > io-button {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      margin: var(--io_borderWidth);
      flex: 0 0 auto;
    }
    :host:not([search]) > io-button.clear-button {
      display: none;
    }
    :host > div > io-property-link:last-of-type {
      flex-shrink: 0;
    }
    :host > div > io-property-link:last-of-type > span {
      flex-shrink: 0;
      text-overflow: clip;
    }
    :host > div > io-property-link:not(:first-of-type):before {
      content: '>';
      padding-right: calc(var(--io_fontSize) / 2);
      color: var(--io_colorStrong);
      opacity: 0.5;
    }
    :host > .search-input {
      flex: 0 0 auto;
      overflow: hidden;
      min-width: calc(var(--io_fieldHeight) + var(--io_borderWidth) * 2);
      height: calc(var(--io_fieldHeight) + var(--io_borderWidth) * 2);
      margin-left: var(--io_spacing);
    }
    :host > .search-input:empty::before {
      content: '🔍';
      font-size: 0.9em;
    }
    `;
    }
    valueChanged() {
        this._crumbs.length = 0;
        this._crumbs.push(this.value);
    }
    selectedChanged() {
        const index = this._crumbs.indexOf(this.selected);
        if (index !== -1) {
            this._crumbs.length = index + 1;
        }
        else {
            this._crumbs.push(this.selected);
        }
    }
    onClearSearch() {
        this.search = '';
    }
    changed() {
        const vChildren = [];
        if (this._crumbs.length > 1) {
            vChildren.push(ioButton({
                icon: 'io:arrow_left',
                class: 'back-button',
                value: this._crumbs[this._crumbs.length - 2],
            }));
        }
        const crumbs = div();
        crumbs.children = [];
        for (let i = Math.max(0, this._crumbs.length - 2); i < this._crumbs.length; i++) {
            crumbs.children.push(ioPropertyLink({
                value: this._crumbs[i],
                showName: i === this._crumbs.length - 1,
            }));
        }
        vChildren.push(crumbs, ioButton({ icon: 'io:close', class: 'clear-button', action: this.onClearSearch }), ioString({ id: 'search', class: 'search-input', value: this.bind('search'), live: true }));
        this.render(vChildren);
    }
};
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoBreadcrumbs.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoBreadcrumbs.prototype, "selected", void 0);
__decorate([
    ReactiveProperty({ type: String, reflect: true })
], IoBreadcrumbs.prototype, "search", void 0);
__decorate([
    Property(Array)
], IoBreadcrumbs.prototype, "_crumbs", void 0);
IoBreadcrumbs = __decorate([
    Register
], IoBreadcrumbs);
export { IoBreadcrumbs };
export const ioBreadcrumbs = function (arg0) {
    return IoBreadcrumbs.vConstructor(arg0);
};
//# sourceMappingURL=IoBreadcrumbs.js.map