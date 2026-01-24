var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, span } from '@io-gui/core';
import { ioBreadcrumbs } from './IoBreadcrumbs.js';
import { ioPropertyEditor } from './IoPropertyEditor.js';
import { getAllPropertyNames } from '../utils/EditorGroups.js';
import { ioPropertyLink } from './IoPropertyLink.js';
function isNestedObject(value, selected) {
    if (value === selected)
        return true;
    if (value instanceof Array) {
        return value.some(v => isNestedObject(v, selected));
    }
    if (value instanceof Object) {
        return Object.keys(value).some(k => isNestedObject(value[k], selected));
    }
    return false;
}
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsible` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
let IoInspector = class IoInspector extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      flex: 0 1 calc(var(--io_lineHeight) * 17.5);
      padding: var(--io_spacing);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-breadcrumbs {
      margin: 0 var(--io_spacing);
    }
    :host > span {
      padding: var(--io_spacing) var(--io_spacing3);
      color: var(--io_colorStrong);
    }
    :host io-property-editor > .row > span {
      min-width: 6em;
      text-align: right;
    }
    `;
    }
    static get Listeners() {
        return {
            'io-button-clicked': 'onLinkClicked',
        };
    }
    onLinkClicked(event) {
        event.stopPropagation();
        const value = event.detail.value;
        const item = event.composedPath()[0];
        if (value && typeof value === 'object') {
            if (item.localName === 'io-property-link' || item.className === 'back-button') {
                this.setProperty('selected', value);
            }
        }
    }
    valueChanged() {
        this.selected = this.value;
    }
    valueMutated() {
        // TODO: Improve this check to update selected to new object if it replaced the previously selected.
        if (!isNestedObject(this.value, this.selected)) {
            this.selected = this.value;
        }
        this.changed();
    }
    selectedMutated() {
        this.changed();
    }
    selectedChanged() {
        this.search = '';
    }
    changed() {
        this.debounce(this.changedDebounced);
    }
    changedDebounced() {
        const vChildren = [
            ioBreadcrumbs({ value: this.value, selected: this.bind('selected'), search: this.bind('search') }),
        ];
        const config = [...this.config];
        config.push([Object, ioPropertyLink({ showName: true })]);
        const properties = [];
        if (this.search) {
            for (const key of getAllPropertyNames(this.selected)) {
                if (key.toLowerCase().includes(this.search.toLowerCase())) {
                    properties.push(key);
                }
            }
        }
        if (this.search && properties.length === 0) {
            vChildren.push(span(`No results found for "${this.search}"`));
        }
        else {
            vChildren.push(ioPropertyEditor({
                value: this.selected,
                config: config,
                groups: this.groups,
                widget: this.widget,
                properties: properties,
            }));
        }
        this.render(vChildren);
    }
    dispose() {
        super.dispose();
        window.removeEventListener('io-object-mutation', this.onPropertyMutated);
    }
};
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoInspector.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoInspector.prototype, "selected", void 0);
__decorate([
    ReactiveProperty({ type: String })
], IoInspector.prototype, "search", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoInspector.prototype, "config", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoInspector.prototype, "groups", void 0);
__decorate([
    ReactiveProperty({ type: Object })
], IoInspector.prototype, "widget", void 0);
IoInspector = __decorate([
    Register
], IoInspector);
export { IoInspector };
export const ioInspector = function (arg0) {
    return IoInspector.vConstructor(arg0);
};
//# sourceMappingURL=IoInspector.js.map