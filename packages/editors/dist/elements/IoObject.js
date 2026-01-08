var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property, Storage as $ } from '@io-gui/core';
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
      max-width: 100%;
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
    valueChanged() {
        if (!this.value)
            return;
        let uuid = genIdentifier(this.value);
        let storage = 'local';
        if (!uuid) {
            uuid = getTempIdentifier(this.value);
            storage = 'none';
        }
        // TODO: Test
        const expandedBinding = $({ value: false, storage: storage, key: uuid + '-' + this.label });
        const bindingTargets = expandedBinding.targets;
        const targetIsThis = bindingTargets.has(this);
        if (bindingTargets.size < 1) {
            if (!targetIsThis) {
                const targetP = this._reactiveProperties.get('expanded');
                if (targetP.binding && targetP.binding !== expandedBinding) {
                    targetP.binding.removeTarget(this, 'expanded');
                }
                expandedBinding.addTarget(this, 'expanded');
            }
        }
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
                widget: this.widget,
                labeled: this.labeled,
                labelWidth: this.labelWidth,
            }));
        }
        this.render(vChildren);
        this.setAttribute('aria-expanded', String(this.expanded));
    }
};
__decorate([
    ReactiveProperty({ type: Object })
], IoObject.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoObject.prototype, "properties", void 0);
__decorate([
    ReactiveProperty({ type: String, value: '' })
], IoObject.prototype, "label", void 0);
__decorate([
    ReactiveProperty(true)
], IoObject.prototype, "labeled", void 0);
__decorate([
    ReactiveProperty('80px')
], IoObject.prototype, "labelWidth", void 0);
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoObject.prototype, "expanded", void 0);
__decorate([
    ReactiveProperty({ value: false })
], IoObject.prototype, "persistentExpand", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoObject.prototype, "config", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoObject.prototype, "groups", void 0);
__decorate([
    ReactiveProperty({ type: Object })
], IoObject.prototype, "widget", void 0);
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
function genIdentifier(object) {
    const id = object.guid || object.uuid || object.id || object.name || object.label;
    if (id) {
        return 'io-object-collapse-state-' + object.constructor.name + '-' + id;
    }
}
const tempIdentifiers = new WeakMap();
function getTempIdentifier(object) {
    if (!tempIdentifiers.has(object)) {
        const randomuuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        tempIdentifiers.set(object, randomuuid);
    }
    return tempIdentifiers.get(object);
}
//# sourceMappingURL=IoObject.js.map