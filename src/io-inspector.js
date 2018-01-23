import {IoBase, html} from "./io-base.js"

export class IoInspector extends IoBase {
  static get is() { return 'io-inspector'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          min-width: 10em;
          position: relative;
        }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_updateJob'
      },
      expanded: {
        type: Boolean,
        observer: '_updateJob',
        reflectToAttribute: true
      }
    }
  }
  constructor(props) {
    super(props);
  }
  _update() {
    if (this.value instanceof Object === false) return;
  }
}

window.customElements.define(IoInspector.is, IoInspector);
