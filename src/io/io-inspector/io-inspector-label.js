import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoInspectorLabel extends Io {
  static get shadowStyle() {
    return html`
      <style>
      :host {
        width: 6em;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host:after {
        content: ":";
      }
      :host(.io-link) {
        color: #fc8;
        cursor: pointer;
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
      listeners: {
        'mousedown': '_mousedownHandler'
      }
    }
  }
  _mousedownHandler(event) {
    this.dispatchEvent(new CustomEvent('io-link-clicked', {
      detail: {key: this.key},
      bubbles: true,
      composed: true
    }));
  }
  _update() {
    this.innerText = this.key;
    this.classList.toggle('io-link', typeof this.value[this.key] === 'object');
  }
}


window.customElements.define('io-inspector-label', IoInspectorLabel);
