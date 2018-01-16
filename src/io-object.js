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
        io-object[expanded]::slotted(io-object-constructor):after {
          /* display: inline-block; */
          content: "\\A\\00a0\\00a0\\00a0\\00a0";
        }
        /* ::slotted(.io-label):before {
          white-space: pre;
        }
        ::slotted(.io-label):after {
          content: ":";
        } */
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
        if (this.labeled) {
          let label = document.createElement('span');
          label.className = 'io-label';
          label.innerText = _keys[i];
          this.appendChild(label);
        }
        this.appendChild(new IoObjectProperty(_keys[i], this.value));
      }
    }
  }
}

window.customElements.define(IoObject.is, IoObject);

export { IoObject }
