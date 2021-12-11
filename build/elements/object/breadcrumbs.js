import { IoElement, RegisterIoElement } from '../../components/io-element.js';
/*
 * Extends `IoElement`. Implements `IoButton`.
 *
 * Breadcrumbs select element. When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value. Optionally, it can trim the `options` array to selected option index.
 *
 * <io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [1,2,3], "trim": false}' config='{"options": ["io-object", {"expanded": true}]}'></io-element-demo>
 *
 * <io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "trim": true}' config='{"options": ["io-object", {"expanded": true}]}'></io-element-demo>
 **/
export class IoBreadcrumbs extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      padding: var(--io-spacing);
      color: var(--io-color-field);
      background-color: var(--io-background-color-field);
      overflow-x: hidden;
    }
    :host > io-item:hover {
      text-decoration: underline;
    }
    :host > io-item:first-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-left: var(--io-spacing);
    }
    :host > io-item:last-of-type {
      overflow: visible;
      text-overflow: clip;
      margin-right: var(--io-spacing);
    }
    :host > io-item:not(:first-of-type):before {
      content: '>';
      margin: 0 var(--io-spacing);
      padding: 0 var(--io-spacing) 0 0;
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
        this.set('selected', this.options[event.detail.value]);
    }
    valueChanged() {
        this.options.length = 0;
        this.options.push(this.value);
    }
    selectedChanged() {
        const index = this.options.indexOf(this.selected);
        if (index !== -1) {
            this.options.length = index + 1;
        }
        else {
            this.options.push(this.selected);
        }
    }
    changed() {
        const elements = [];
        for (let i = 0; i < this.options.length; i++) {
            elements.push(['io-item', {
                    value: i,
                    label: getLabel(this.options[i]),
                    'on-item-clicked': this._onClick,
                }]);
        }
        this.template(elements);
    }
}
RegisterIoElement(IoBreadcrumbs);
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
//# sourceMappingURL=breadcrumbs.js.map