import {IoBase, html} from "./io-base.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-property.js"

class IoObject extends IoBase {
  static get is() { return 'io-object'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          background: rgba(255,0,0,0.1);
          position: relative;
        }
        ::slotted(io-object-property):before {
          content: "\\00a0\\00a0─\\00a0";
        }
        :host #tree-line {
          display: none;
        }
        :host([expanded]) > #tree-line {
          display: inline-block;
          position: absolute;
          pointer-events: none;
          width: 0.5em;
          border-right: 1px solid black;
          top: 1.5em;
          bottom: 0.5em;
        }
      </style><div id="tree-line"></div><slot></slot>
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
      },
      label: {
        value: '',
        type: String,
        observer: '_updateJob'
      }
    }
  }
  _update() {
    this.innerHTML = '';
    if (typeof this.value == 'object' && this.value !== null) {
      let _keys = this.expanded ? Object.keys(this.value) : [];
      this.appendChild(new IoObjectConstructor(this.value, this.expanded, this.label));
      for (let i = 0; i < _keys.length; i++) {
        this.appendChild(new IoObjectProperty(_keys[i], this.value, this.labeled));
      }
    }
  }
}

window.customElements.define(IoObject.is, IoObject);

export { IoObject }
