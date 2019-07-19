import {html, IoElement} from "../../io.js";
import {IoThemeMixinSingleton as mixin} from "../../io-elements-core.js";

export class IoElementDemo extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.panel}
      }
      :host > io-boolean {
        cursor: pointer !important;
        align-self: stretch;
      }
      :host > .icon {
        margin-top: 0.2em;
        margin-bottom: -1.55em;
        display: inline-block;
        text-shadow: 0 0 4px #ffffff, 0 0 8px #ffffff, 0 0 16px #ffffff;
        padding: 0 0.5em;
        margin-left: auto;
      }
      :host > io-boolean {
        margin-bottom: var(--io-spacing);
      }
      :host > io-properties {
        align-self: stretch;
        padding: var(--io-spacing);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      element: {
        type: String,
        reflect: -1,
        notify: true,
      },
      properties: {
        type: Object,
        reflect: -1,
        notify: true,
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
        notify: true,
      },
    };
  }
  static get Properties() {
    return {
      expanded: false,
    };
  }
  _onPropSet(event) {
    if (this.properties[event.detail.property] !== undefined) {
      this.properties[event.detail.property] = event.detail.value;
    }
    this.dispatchEvent('object-mutated', {
      object: this.properties,
      property: event.detail.property,
      value: event.detail.value,
      oldValue: event.detail.oldValue,
    }, false, window);
  }
  _onObjectMutation(event) {
    super._onObjectMutation(event);
    for (let p in this.properties) {
      if (typeof this.properties[p] === 'object') {
        this._bubbleMutation(this.properties[p], this.properties, event.detail.object);
      }
    }
  }
  _bubbleMutation(object, parentObject, srcObject) {
    if (object === srcObject) {
      this.dispatchEvent('object-mutated', {
        object: parentObject,
      }, false, window);
    } else {
      for (let p in object) {
        if (typeof object[p] === 'object') {
          this._bubbleMutation(object[p], object, srcObject);
        }
      }
    }
  }
  changed() {
    for (let prop in this.properties) {
      if (this.properties[prop] === 'undefined') {
        this.properties[prop] = undefined;
      }
    }
    if (this.element) {
      const hasProps = !!Object.keys(this.properties).length;
      const label = '<' + this.element + '>';
      this.template([
        hasProps ? ['span', {class: 'icon'}, '🔧'] : null,
        ['io-boolean', {class: 'io-item', value: this.bind('expanded'), true: label, false: label}],
        (hasProps && this.expanded) ?
        ['io-properties', {value: this.properties, config: Object.assign({
            'type:number': ['io-float'],
            'type:boolean': ['io-switch'],
          }, this.config)}] : null,
        ['div', {class: 'io-frame'}, [
          [this.element, Object.assign({'on-value-set': this._onPropSet, 'id': 'demo-element'}, this.properties)],
        ]],
       ]);
       if (this.$['demo-element']) {
         if (this.width) this.$['demo-element'].style.width = this.width;
         if (this.height) this.$['demo-element'].style.height = this.height;
       }
    } else {
      this.template([null]);
    }
  }
}

IoElementDemo.Register();
