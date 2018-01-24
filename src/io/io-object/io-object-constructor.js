import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoObjectConstructor extends Io {
  static get is() { return 'io-object-constructor'; }
  static get template() {
    return html`
      <style>
      :host {
        display: inline-block;
        cursor: pointer;
        line-height: 1em;
      }
      ::slotted(.io-constructor) {
        color: rgb(23, 128, 41);
      }
      ::slotted(.io-label):after {
        content: ":";
      }
      </style>
    `;
  }
  static get properties() {
    return {
      object: {
        type: Object,
        observer: '_update',
      },
      label: {
        type: String,
        observer: '_update'
      },
      expanded: {
        type: Boolean,
        observer: '_update',
        reflectToAttribute: true
      }
    }
  }
  constructor(props) {
    super(props);
    this.setAttribute('tabindex', 0);
    this._update();
  }
  connectedCallback() {
    this.addEventListener('click', this._toggleHandler);
    this.addEventListener('keydown', this._toggleHandler);
    this.addEventListener('mousedown', this._preventHandler);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this._toggleHandler);
    this.removeEventListener('keydown', this._toggleHandler);
    this.removeEventListener('mousedown', this._preventHandler);
  }
  _preventHandler(event) {
    event.preventDefault();
  }
  _toggleHandler(event) {
    if (event.which == 13 || event.which == 32 || event.type == 'click') {
      event.preventDefault();
      let ioObject = this.parentElement;
      ioObject.expanded = !ioObject.expanded;
      setTimeout(() => {
        ioObject.querySelector('io-object-constructor').focus();
      });
    }
  }
  _update() {
    if (this.object instanceof Object === false) return;
    let _name = this.object.constructor.name || 'Object';
    this.render([
      this.label ? ['span', {className: 'io-label'} , this.label] : null,
      ['span', {className: 'io-constructor'}, this.expanded ? '▾' + _name : '▸' + _name + '(' + Object.keys(this.object).length + ')' ]
    ]);
  }
}

window.customElements.define(IoObjectConstructor.is, IoObjectConstructor);
