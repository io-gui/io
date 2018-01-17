import {IoBase, html} from "./io-base.js"

class IoObjectConstructor extends IoBase {
  static get is() { return 'io-object-constructor'; }
  static get template() {
    return html`
      <style>
      :host {
        display: inline-block;
        cursor: pointer;
        background: rgba(0,255,0,0.1);
      }
      :host:before {
        content: "\\00a0▷\\00a0";
        font-size: 0.8em;
        line-height: 1em;
      }
      :host([expanded]):before {
        content: "\\00a0▽\\00a0";
        font-size: 0.8em;
        line-height: 1em;
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
  constructor(object, expanded, label) {
    super();
    this.expanded = expanded;
    this._object = object;
    this._label = label;
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
    let constructor = '';
    this.setAttribute('tabindex', 0);
    if (this._label) {
      constructor += this._label + ': ';
    }
    if (this.expanded) {
      constructor += this._object.constructor.name || 'Object';
    } else {
      constructor += this._object.constructor.name || 'Object';
      constructor += '(' + Object.keys(this._object).length + ')'
    }
    this.innerHTML = constructor;
  }
}

window.customElements.define(IoObjectConstructor.is, IoObjectConstructor);

export { IoObjectConstructor }
