import {IoBase, html} from "./io-base.js"

class IoObjectConstructor extends IoBase {
  static get is() { return 'io-object-constructor'; }
  static get template() {
    return html`
      <style>
      :host {
        display: inline;
        cursor: pointer;
      }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      expanded: {
        value: false,
        type: Boolean,
        observer: '_updateJob',
        reflectToAttribute: true
      }
    }
  }
  constructor(object, expanded) {
    super();
    this.expanded = expanded;
    this._object = object;
    this._toggleListener = this._toggleHandler.bind(this);
    this._update();
  }
  connectedCallback() {
    this.addEventListener('click', this._toggleListener);
    this.addEventListener('keydown', this._toggleListener);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this._toggleListener);
    this.removeEventListener('keydown', this._toggleListener);
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
    this.innerHTML = '';
    let constructor = '';
    this.setAttribute('tabindex', 0);
    if (this.expanded) {
      constructor = '▾' + this._object.constructor.name || 'Object';
    } else {
      constructor = '▸' + this._object.constructor.name || 'Object';
      constructor += '(' + Object.keys(this._object).length + ')'
    }
    this.innerHTML = constructor;
  }
}

window.customElements.define(IoObjectConstructor.is, IoObjectConstructor);

export { IoObjectConstructor }
