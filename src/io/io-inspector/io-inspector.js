import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoInspector extends Io {
  static get is() { return 'io-inspector'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          min-width: 10em;
          position: relative;
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
      expanded: {
        type: Boolean,
        observer: '_update',
        reflectToAttribute: true
      }
    }
  }
  _update() {
    if (this.value instanceof Object === false) return;
  }
}

window.customElements.define(IoInspector.is, IoInspector);
