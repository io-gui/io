import {IoElement} from '../io.js';
import {IoStorageFactory as $} from '../io-elements.js';

export class IoElementDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
      position: relative;
    }
    :host > io-boolicon {
      z-index: 2;
      position: absolute !important;
      top: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
      right: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
    }
    :host > io-boolicon:not([value]):not(:hover) {
      opacity: 0.5;
    }
    :host > io-properties {
      align-self: stretch;
      padding: var(--io-spacing) 0;
      margin: var(--io-border-width);
      margin-right: var(--io-spacing);
      margin-bottom: calc(2 * var(--io-spacing));
    }
    :host > io-properties > :nth-child(3) {
      margin-right: calc(var(--io-item-height) + var(--io-spacing));
    }
    :host > .io-content {
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      padding: var(--io-spacing);
      box-shadow: var(--io-shadow-inset);
      color: var(--io-color);
      background-color: var(--io-background-color);
      background-image: none;
    }
    :host:not([expanded]) > .io-content {
      margin-right: calc(var(--io-item-height) + calc(3 * var(--io-spacing)));
    }
    `;
  }
  static get Properties() {
    return {
      element: {
        type: String,
        reflect: -1,
      },
      properties: {
        type: Object,
        reflect: -1,
        observe: true,
      },
      width: {
        type: String,
        reflect: -1,
      },
      height: {
        type: String,
        reflect: -1,
      },
      config: {
        type: Object,
        reflect: -1,
      },
      expanded: {
        type: Boolean,
        reflect: 2,
      }
    };
  }
  objectMutated(event) {
    super.objectMutated(event);
    for (let i = this.__observedObjects.length; i--;) {
      const prop = this.__observedObjects[i];
      const value = this.__properties[prop].value;
      const hasObject = !!this.filterObject(value, o => { return o === event.detail.object; });
      if (hasObject) {
        const children = this.querySelectorAll('*');
        for (let i = 0; i < children.length; i++) {
          if (children[i].changed) children[i].changed();
        }
      }
    }
  }
  propertiesChanged() {
    // TODO: Unhack demovalues
    for (let p in this.properties) {
      const prop = this.properties[p];
      if (typeof prop === 'string' && prop.startsWith('demo:')) {
        this.properties[p] = $({key: prop});
      }
    }
  }
  changed() {
    const properties = this.properties;
    const elements = [['io-boolicon', {value: this.bind('expanded'), true: 'icons:tune', false: 'icons:tune'}]];
    if (this.expanded) {
      elements.push(['io-properties', {
        value: properties,
        config: Object.assign({
          'type:number': ['io-number', {step: 0.00001}],
          'type:boolean': ['io-switch'],
        }, this.config)}
      ]);
    }
    elements.push(['div', {class: 'io-content'}, [
      [this.element, Object.assign({'id': 'demo-element'}, properties)],
    ]]);
    this.template(elements);
    if (this.width) this.$['demo-element'].style.width = this.width;
    if (this.height) this.$['demo-element'].style.height = this.height;
    if (this.$['demo-element'].onResized) this.$['demo-element'].onResized();
  }
}

IoElementDemo.Register();
