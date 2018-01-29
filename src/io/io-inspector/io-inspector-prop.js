import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
// import {IoObjectProperty} from "../io-object/io-object-prop.js"

// TODO: extend IoObjectProperty and make sure Handlers are bound correctly
export class IoInspectorProp extends Io {
  static get style() {
    return html`
      <style>
        :host > .io-link {
          color: #fc8;
        }
        :host > io-boolean {
          color: #9c8;
        }
        :host > io-string,
        :host > io-number {
          background: #555;
        }
        :host io-vector > io-number,
        :host io-color > io-number {
          background: #555;
          margin-right: 2px;
        }
        :host io-color > io-number:last-of-type,
        :host io-vector > io-number:last-of-type {
          margin-right: 0;
        }
      </style>
    `;
  }
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          padding: 1px 0;
          font-weight: lighter;
        }
        ::slotted(:nth-child(2)) {
          margin: 0 2px 0 0;
          flex: 1;
        }
        ::slotted(.io-link),
        ::slotted(.io-label) {
          display: inline-block;
          width: 8em;
          text-align: right;
          margin: 0 2px 0 2px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        ::slotted(.io-link) {
          color: blue;
          cursor: pointer;
        }
        ::slotted(.io-link):after,
        ::slotted(.io-label):after {
          content: ":";
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_update'
      },
      key: {
        type: String,
        observer: '_update'
      },
      config: {
        type: Array,
        observer: '_update'
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  _valueSetHandler(event) {
    this.value[this.key] = event.detail.value;
    window.dispatchEvent(new CustomEvent('io-object-mutated', {
      detail: {object: this.value, key: this.key},
      bubbles: false,
      composed: true
    }));
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this.value) {
      if (event.detail.key === this.key || event.detail.key === '*') {
        this._update();
      }
    }
  }
  _update() {
    let isObject = typeof this.value[this.key] === 'object' && this.value[this.key] !== null;
    this.render([
      ['span', {className: isObject ? 'io-link' : 'io-label'}, this.key],
      this.config.tag !== 'io-object' ? [this.config.tag, Object.assign({value: this.value[this.key], label: this.key, listeners: {'value-set': this._valueSetHandler}}, this.config.props) ] : null
    ]);
  }
}


window.customElements.define('io-inspector-prop', IoInspectorProp);
