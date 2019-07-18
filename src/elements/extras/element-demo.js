import {html, IoElement} from "../../io.js";

export class IoElementDemo extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        border: var(--io-outset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-outset-border-color);
        background: var(--io-background-color-dark);
        background-image: var(--io-gradient-frame);
        padding: var(--io-spacing);
      }
      :host > div {
        display: flex;
        flex-direction: column;
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        padding: var(--io-spacing);
        background: var(--io-background-color);
      }
      :host > io-boolean {
        background: none;
        border: none;
      }
      :host > .icon {
        margin-bottom: -1.6em;
        display: inline-block;
        content: '🔩';
        text-shadow: 0 0 4px #ffffff, 0 0 8px #ffffff, 0 0 16px #ffffff;
        padding: 0 0.5em;
        margin-left: auto;
      }
      :host > io-properties {
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
        hasProps ? ['span', {class: 'icon'}, '🔩'] : null,
        ['io-boolean', {value: this.bind('expanded'), true: label, false: label}],
        (hasProps && this.expanded) ?
        ['io-properties', {value: this.properties, config: Object.assign({
            'type:number': ['io-float'],
            'type:boolean': ['io-switch'],
          }, this.config)}] : null,
        ['div', [
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
