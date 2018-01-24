import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoInspectorGroup extends Io {
  static get is() { return 'io-inspector-group'; }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
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
      props: {
        type: Array,
        observer: '_update',
      }
    }
  }
  connectedCallback() {
    this._update();
  }
  _update() {
    console.log(this.props);
    this.render([
      ['span', this.props[0]]
    ])
  }
}


window.customElements.define(IoInspectorGroup.is, IoInspectorGroup);
