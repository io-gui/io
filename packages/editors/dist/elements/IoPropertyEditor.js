var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, ReactiveProperty, Register, span, div, HTML_ELEMENTS } from '@io-gui/core';
import { getEditorConfig } from '../utils/EditorConfig.js';
import { getEditorGroups, getAllPropertyNames } from '../utils/EditorGroups.js';
import { getEditorWidget } from '../utils/EditorWidgets.js';
import { ioObject } from './IoObject.js';
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
let IoPropertyEditor = class IoPropertyEditor extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
      font-size: var(--io_fontSize);
    }
    :host[orientation="horizontal"] {
      flex-direction: row;
    }
    :host > .row {
      display: flex;
      flex-direction: row;
      flex: 1 1 auto;
      margin: var(--io_spacing);
      padding: var(--io_spacing) 0;
      border-radius: var(--io_borderRadius);
      margin-bottom: 0;
      background-color: var(--io_bgColorLight);
    }
    :host[orientation="horizontal"] > .row {
      flex-direction: column;
    }
    :host io-property-editor {
      margin-top: calc(var(--io_spacing) * -1) !important;
    }
    :host io-property-editor > .row {
      /* margin: 0 !important; */
      padding: 0 !important;
    }
    :host > .row:last-of-type {
      margin-bottom: var(--io_spacing);
    }
    :host > .row > span {
      flex: 0 0 auto;
      padding: var(--io_borderWidth); /* TODO: verify correctness */
      margin: var(--io_spacing);
      margin-left: var(--io_spacing2);
      line-height: var(--io_lineHeight);
      height: var(--io_lineHeight);
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host > .row > span:after {
      display: inline-block;
      margin-left: var(--io_spacing);
      opacity: 0.5;
      content: ':';
    }

    :host > .row > :not(span) {
      flex-grow: 1;
    }
    :host io-object {
      margin-right: var(--io_spacing);
    }
    `;
    }
    _config = null;
    _groups = null;
    _widget = null;
    init() {
        this._observedObjectProperties.push('value');
        window.addEventListener('io-object-mutation', this.onPropertyMutated);
    }
    _onValueInput(event) {
        event.stopImmediatePropagation();
        const id = event.target.id;
        if (id !== undefined) {
            this.value[id] = event.detail.value;
            if (!this.value._isNode) {
                this.dispatchMutation(this.value);
            }
        }
        else {
            debug: console.warn('IoPropertyEditor: "value-input" recieved from an input without a property id');
        }
    }
    valueMutated(event) {
        this.throttle(this.changed);
    }
    configChanged() {
        this.throttle(this.configureThrottled);
    }
    groupsChanged() {
        this.throttle(this.configureThrottled);
    }
    widgetChanged() {
        this.throttle(this.configureThrottled);
    }
    valueChanged() {
        this.throttle(this.configureThrottled);
    }
    configureThrottled() {
        this._config = getEditorConfig(this.value, this.config);
        this._groups = getEditorGroups(this.value, this.groups);
        this._widget = getEditorWidget(this.value, this.widgets);
        this.throttle(this.changed);
    }
    changed() {
        this.debounce(this.changedDebounced);
    }
    changedDebounced() {
        if (!this.value) {
            this._config = null;
            this._groups = null;
            this._widget = null;
            this.render([]);
            return;
        }
        const config = this._config;
        const groups = this._groups;
        const widget = this._widget;
        if (!config || !groups)
            return;
        const properties = [];
        const vChildren = [];
        if (this.properties.length) {
            properties.push(...this.properties);
        }
        else {
            if (widget) {
                const widgetWithValue = {
                    tag: widget.tag,
                    props: Object.assign({ value: this.value }, widget.props),
                    children: widget.children
                };
                vChildren.push(widgetWithValue);
            }
            properties.push(...groups.Main);
        }
        const allProps = getAllPropertyNames(this.value);
        for (let i = 0; i < properties.length; i++) {
            if (allProps.includes(properties[i])) {
                const id = properties[i];
                const value = this.value[id];
                const tag = config[id].tag;
                const props = config[id].props || {};
                const finalProps = { id: id, value: value, '@value-input': this._onValueInput };
                Object.assign(finalProps, props);
                let children = undefined;
                if (HTML_ELEMENTS.includes(tag) && typeof value === 'string') {
                    children = value;
                }
                if (tag === 'io-object' || tag === 'io-property-editor') {
                    finalProps.config = finalProps.config || this.config;
                    finalProps.groups = finalProps.groups || this.groups;
                }
                if (tag === 'io-object') {
                    finalProps.persistentExpand = true;
                }
                // NOTE: Functions dont have labels. They are displayed as labeled buttons.
                const isFunction = typeof value === 'function';
                if (isFunction) {
                    finalProps.action = value;
                    finalProps.label = finalProps.label || id;
                }
                const isIoObject = tag === 'io-object';
                if (isIoObject) {
                    finalProps.label = id + ': ' + (finalProps.label || value.constructor?.name);
                }
                vChildren.push(div({ class: 'row' }, [
                    (this.labeled && !isFunction && !isIoObject) ? span({ style: { width: this.labelWidth } }, id) : null,
                    { tag: tag, props: finalProps, children: children },
                ]));
            }
            else {
                debug: console.warn(`IoPropertyEditor: property "${properties[i]}" not found in value`);
            }
        }
        if (!this.properties.length) {
            for (const group in groups) {
                if (group !== 'Main' && group !== 'Hidden' && groups[group].length) {
                    vChildren.push(ioObject({
                        label: group,
                        labelWidth: this.labelWidth,
                        persistentExpand: true,
                        value: this.value,
                        properties: groups[group],
                        config: this.config,
                    }));
                }
            }
        }
        this.render(vChildren);
    }
    dispose() {
        super.dispose();
        window.removeEventListener('io-object-mutation', this.onPropertyMutated);
    }
};
__decorate([
    ReactiveProperty()
], IoPropertyEditor.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoPropertyEditor.prototype, "properties", void 0);
__decorate([
    ReactiveProperty(true)
], IoPropertyEditor.prototype, "labeled", void 0);
__decorate([
    ReactiveProperty('80px')
], IoPropertyEditor.prototype, "labelWidth", void 0);
__decorate([
    ReactiveProperty({ type: String, value: 'vertical', reflect: true })
], IoPropertyEditor.prototype, "orientation", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoPropertyEditor.prototype, "config", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoPropertyEditor.prototype, "groups", void 0);
__decorate([
    ReactiveProperty({ type: Map, init: null })
], IoPropertyEditor.prototype, "widgets", void 0);
IoPropertyEditor = __decorate([
    Register
], IoPropertyEditor);
export { IoPropertyEditor };
export const ioPropertyEditor = function (arg0) {
    return IoPropertyEditor.vConstructor(arg0);
};
//# sourceMappingURL=IoPropertyEditor.js.map