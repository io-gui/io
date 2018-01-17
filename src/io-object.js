import {IoBase, html} from "./io-base.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-property.js"

class IoObject extends IoBase {
  static get is() { return 'io-object'; }
  static get template() {
    return html`
      <style>
        io-object {
          display: inline-block;
        }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      /* Value to be displayed/edited. */
      value: {
        type: Object,
        observer: '_updateJob'
      },
      /* This attribute expands property editors. */
      expanded: {
        value: false,
        type: Boolean,
        observer: '_updateJob',
        reflectToAttribute: true
      },
      /* This attribute reveals property labels. */
      labeled: {
        value: false,
        type: Boolean,
        observer: '_updateJob',
        reflectToAttribute: true
      }
    }
  }
  _update() {
    this.innerHTML = '';
    if (typeof this.value == 'object' && this.value !== null) {
      let _keys = this.expanded ? Object.keys(this.value) : [];
      this.appendChild(new IoObjectConstructor(this.value, this.expanded));
      for (let i = 0; i < _keys.length; i++) {
        this.appendChild(new IoObjectProperty(_keys[i], this.value, this.labeled));
      }
    }
  }
}

window.customElements.define(IoObject.is, IoObject);

export { IoObject }
