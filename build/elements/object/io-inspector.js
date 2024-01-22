var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoStorage as $ } from '../../core/storage.js';
import { ObjectGroups } from './models/object-groups.js';
import { ObjectWidgets } from './models/object-widgets.js';
import './io-breadcrumbs.js';
import '../basic/io-boolicon.js';
import { ProtoObjectConfig } from './io-properties.js';
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
let IoInspector = class IoInspector extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      flex: 0 1 calc(var(--iotLineHeight) * 17.5);
    }
    :host > * {
      flex-shrink: 0;
    }
    :host > .inspector-header {
      display: flex;
      flex-direction: row;
      margin-bottom: var(--iotSpacing);
      flex-grow: 0;
    }
    :host > .inspector-header > io-breadcrumbs {
      flex: 1 1;
    }
    :host > .inspector-header > io-boolean {
      width: calc(var(--iotSpacing) + var(--iotLineHeight));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-boolean:not([value]) {
      opacity: 0.25;
    }
    :host > .inspector-header > io-string {
      margin: 0 var(--iotSpacing);
      padding: calc(2 * var(--iotSpacing));
      align-self: stretch;
      height: auto;
    }
    :host > .inspector-header > io-string:focus {
      width: 6em;
    }
    :host > .inspector-header > io-string:empty:before {
      content: ' 🔍';
      white-space: pre;
      visibility: visible;
      opacity: 0.33;
    }
    :host > io-collapsable > io-boolean,
    :host > io-object > io-boolean {
      text-transform: capitalize;
    }
    :host > io-object {
      flex-basis: auto !important;
    }
    :host > io-object > io-properties {
      border-radius: var(--iotBorderRadius);
      background-color: var(--iotBackgroundColor) !important;
      border: var(--iotBorder);
      border-color: var(--iotBorderColorInset);
      padding: var(--iotSpacing);
      overflow: hidden;
    }
    :host > io-object > io-properties:not([horizontal])[labeled] {
      grid-template-columns: minmax(6em, min-content) minmax(12em, 1fr);
    }
    :host > io-object > io-properties:not([horizontal])[labeled] > span.io-field {
      text-align: right;
    }
    :host io-properties io-field.select {
      color: var(--iotColorLink) !important;
    }
    :host io-properties io-field.select:hover {
      text-decoration: underline;
    }
    `;
    }
    // @Property({type: Array})
    // declare widget: VDOMArray;
    static get Listeners() {
        return {
            'io-field-clicked': '_onItemClicked',
        };
    }
    _onItemClicked(event) {
        event.stopPropagation();
        const value = event.detail.value;
        const item = event.composedPath()[0];
        if (value && typeof value === 'object' && item.classList.contains('select')) {
            this.setProperty('selected', value);
        }
    }
    valueChanged() {
        this.selected = this.value;
    }
    advancedChanged() {
        delete this._currentCfgLen;
    }
    selectedMutated() {
        clearTimeout(this._cfgTimeout);
        this._cfgTimeout = setTimeout(() => {
            this._onChange();
        }, 1000 / 10);
    }
    changed() {
        this._onChangedThrottled();
    }
    _onChangedThrottled() {
        this.throttle(this._onChange);
    }
    _onChange() {
        const config = this.__proto__._protoConfig.getObjectConfig(this.selected);
        Object.assign(config, this.config);
        this._groups = this.__proto__._groups.getObjectGroups(this.selected, this.groups, Object.getOwnPropertyNames(config));
        this._widgets = this.__proto__._widgets.getObjectWidgets(this.selected, this.widgets);
        const uuid = this.uuid || genUUID(this.selected);
        const elements = [
            ['div', { class: 'inspector-header' }, [
                    ['io-breadcrumbs', { value: this.value, selected: this.bind('selected') }],
                    // ['io-string', {$: 'search', value: this.bind('search'), live: true}],
                ]],
            this._widgets.main ? this._widgets.main : null
        ];
        for (const group in this._widgets.groups) {
            if (!this._groups[group]) {
                elements.push(['io-collapsable', {
                        label: group,
                        expanded: $({ value: true, storage: 'local', key: uuid + '-' + group }),
                        elements: [this._widgets.groups[group]],
                    }]);
            }
        }
        for (const group in this._groups) {
            elements.push(['io-object', {
                    label: group,
                    expanded: $({ value: true, storage: 'local', key: this.uuid + '-' + group }),
                    value: this.selected,
                    properties: this._groups[group],
                    config: config,
                    widget: this._widgets.groups[group] || [],
                }]);
        }
        this.template(elements);
    }
    static get Config() {
        return [
            [Object, [
                    [null, ['io-field', { appearance: 'neutral', class: 'select' }]],
                    [undefined, ['io-string', { appearance: 'neutral' }]],
                    [String, ['io-string', { appearance: 'neutral' }]],
                    [Number, ['io-number', { appearance: 'neutral', step: 0.0001 }]],
                    [Boolean, ['io-boolean']],
                    [Object, ['io-field', { appearance: 'neutral', class: 'select' }]],
                ]],
        ];
    }
    static get ObjectGroups() {
        return {
            'Object|hidden': [/^_/],
            'Array|main': [/^[0-9]+$/],
            // TODO
            'HTMLElement|main': ['localName', 'tagName', 'nodeName', /class/i, /attribute/i],
            'HTMLElement|hidden': [/^on/, /^[A-Z0-9_]*$/, 'childElementCount'],
            'HTMLElement|content': [/content/i, /inner/i, /outer/i],
            'HTMLElement|display': [/width/i, /height/i, /top/i, /left/i, /scroll/i, /style/i],
            'HTMLElement|hierarchy': [/parent/i, /child/i, /element/i, /root/i, /slot/i, /sibling/i, /document/i],
        };
    }
    static get ObjectWidgets() {
        return {
        // 'Object': ['io-field', {label: 'This is a main widget'}],
        // 'Object|main': ['io-field', {label: 'This is a main group widget'}],
        };
    }
    Register(ioNodeConstructor) {
        super.Register(ioNodeConstructor);
        Object.defineProperty(ioNodeConstructor.prototype, '_protoConfig', { writable: true, value: new ProtoObjectConfig(ioNodeConstructor.prototype._protochain.constructors) });
        Object.defineProperty(ioNodeConstructor.prototype, '_groups', { writable: true, value: new ObjectGroups(ioNodeConstructor.prototype._protochain.constructors) });
        Object.defineProperty(ioNodeConstructor.prototype, '_widgets', { writable: true, value: new ObjectWidgets(ioNodeConstructor.prototype._protochain.constructors) });
    }
};
__decorate([
    Property({ observe: true })
], IoInspector.prototype, "value", void 0);
__decorate([
    Property({ observe: true })
], IoInspector.prototype, "selected", void 0);
__decorate([
    Property({ type: Object })
], IoInspector.prototype, "config", void 0);
__decorate([
    Property('')
], IoInspector.prototype, "uuid", void 0);
__decorate([
    Property('')
], IoInspector.prototype, "search", void 0);
__decorate([
    Property({ type: Object })
], IoInspector.prototype, "groups", void 0);
__decorate([
    Property({ type: Object })
], IoInspector.prototype, "widgets", void 0);
IoInspector = __decorate([
    Register
], IoInspector);
export { IoInspector };
function genUUID(object) {
    let UUID = 'io-object-collapse-state-' + object.constructor.name;
    UUID += '-' + (object.guid || object.uuid || object.id || '');
    const props = JSON.stringify(Object.keys(object));
    let hash = 0;
    for (let i = 0; i < props.length; i++) {
        hash = ((hash << 5) - hash) + props.charCodeAt(i);
        hash |= 0;
    }
    hash = (-hash).toString(16);
    UUID += '-' + hash;
    return UUID;
}
//# sourceMappingURL=io-inspector.js.map