var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import { Binding } from '../../core/internals/binding.js';
import { Options } from '../../models/options.js';
import { IoStorageFactory as $ } from '../../core/storage.js';
/*
 * Labeled tabs for selection.
 *
 * Implements `<io-option-menu>` and `<io-button>`.
 *
 * <io-element-demo element="io-sidebar"
 *     properties='{
 *         "selected": 1,
 *         "options": [1,2,3],
 *         "collapsed": false}'
 *     config='{"options": ["io-properties"]}'>
 * </io-element-demo>
 *
 * <io-element-demo element="io-sidebar"
 *     properties='{
 *         "selected": 1,
 *         "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}],
 *         "collapsed": false}'
 *     config='{"type:object": ["io-properties"]}'>
 * </io-element-demo>
 *
 * When tabs are clicked, `selected` value is set.
 **/
let IoSidebar = class IoSidebar extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: hidden;
      overflow-y: auto;
      padding: var(--io-spacing);
      flex-direction: column;
      -webkit-overflow-scrolling: touch;
    }
    :host > * {
      align-self: stretch !important;
      flex: 0 0 auto;
    }
    :host * {
      overflow: visible !important;
    }
    :host io-collapsable {
      padding: 0;
    }
    :host io-collapsable > io-content {
      padding: 0 0 0 0.75em;
    }
    :host io-button {
      text-align: left;
      align-self: stretch;
    }
    :host io-button,
    :host io-collapsable,
    :host io-content {
      background: none;
      box-shadow: none;
      border-color: transparent;
    }
    :host io-boolean:not(:focus) {
      border-bottom-color: transparent  !important;
    }
    `;
    }
    static get Properties() {
        return {
            selected: null,
            options: {
                type: Options,
                observe: true,
            },
            collapsed: {
                type: Boolean,
                reflect: 'prop',
            },
            role: 'navigation',
        };
    }
    _filterObject(object, predicate, _depth = 5, _chain = [], _i = 0) {
        if (_chain.indexOf(object) !== -1)
            return;
        _chain.push(object);
        if (_i > _depth)
            return;
        _i++;
        if (predicate(object))
            return object;
        for (const key in object) {
            const value = object[key] instanceof Binding ? object[key].value : object[key];
            if (predicate(value))
                return value;
            if (typeof value === 'object') {
                const subvalue = this._filterObject(value, predicate, _depth, _chain, _i);
                if (subvalue)
                    return subvalue;
            }
        }
    }
    _onSelect(id) {
        this.setProperty('selected', id);
    }
    _addOptions(options) {
        const elements = [];
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.options.length) {
                const containsSelected = !!this._filterObject(option.options, o => matches(this.selected, o));
                const collapsableState = $({ value: false, storage: 'local', key: genUUID(options, i) });
                elements.push(['io-collapsable', {
                        label: option.label,
                        expanded: containsSelected || collapsableState,
                        elements: [...this._addOptions(option.options)]
                    }]);
            }
            else {
                const selected = matches(this.selected, option);
                elements.push(['io-button', {
                        value: option.value || option,
                        label: option.label || option.value || option,
                        action: this._onSelect,
                        selected: selected,
                    }]);
            }
        }
        return elements;
    }
    changed() {
        if (this.collapsed) {
            const selected = this._filterObject(this.options, o => matches(this.selected, o));
            this.template([['io-option-menu', {
                        options: this.options,
                        value: this.bind('selected'),
                        label: selected ? selected.label : '',
                        icon: '☰',
                        selectable: true,
                        title: 'select tab',
                        class: 'io-field',
                    }]]);
        }
        else {
            this.template([...this._addOptions(this.options)]);
        }
    }
};
IoSidebar = __decorate([
    RegisterIoElement
], IoSidebar);
export { IoSidebar };
function genUUID(options, i) {
    const option = options[i];
    let UUID = 'io-sidebar-collapse-state-' + i + '-' + options.length;
    if (option.label)
        UUID += '-' + option.label;
    if (option.options.length)
        UUID += '(' + option.options.length + ')';
    return UUID;
}
function matches(selected, option) {
    if (selected === undefined)
        return false;
    if (typeof option === 'object')
        option = option.value;
    return String(selected).toLowerCase() === String(option).toLowerCase();
}
//# sourceMappingURL=sidebar.js.map