import {IoBase, html} from "./io-base.js"
import {IoMenu} from "./io-menu.js"

const menu = new IoMenu({position: 'bottom'});

export class IoOption extends IoBase {
  static get is() { return 'io-option'; }
  static get template() {
    return html`
      <style>
        :host {
          cursor: text;
          display: inline-block;
        }
        :host([invalid]) {
          text-decoration: underline;
          text-decoration-style: dashed;
          text-decoration-color: red;
          opacity: 0.25;
        }
        :host([disabled]) {
          color: black;
          opacity: 0.25;
          cursor: not-allowed;
        }
      </style><slot>undefined</slot>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: '_updateJob'
      },
      options: {
        type: Array,
        observer: '_updateJob'
      },
      type: {
        type: String,
        observer: '_updateJob',
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        observer: '_disabledChanged',
        reflectToAttribute: true
      },
      invalid: {
        type: Boolean,
        reflectToAttribute: true
      }
    }
  }
  constructor(props) {
    super(props);
    this._focusListener = this._focusHandler.bind(this);
    this._blurListener = this._blurHandler.bind(this);
    this._expandListener = this._expandHandler.bind(this);
    this._menuListener = this._menuHandler.bind(this);
    this._preventDefault = this.preventDefault.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', 0);
    this.addEventListener('focus', this._focusListener);
    this.addEventListener('mousedown', this._expandListener);
    this._disabledChanged();
    this._update();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._focusListener);
    this.removeEventListener('blur', this._blurListener);
    this.removeEventListener('keydown', this._expandListener);
    this.removeEventListener('mousedown', this._preventDefault);
  }
  _focusHandler(event) {
    this.addEventListener('blur', this._blurListener);
    this.addEventListener('keydown', this._expandListener);
  }
  _blurHandler(event) {
    this.removeEventListener('keydown', this._expandListener);
    this.removeEventListener('blur', this._blurListener);
  }
  _expandHandler(event) {
    if (this.disabled) return;
    if (event.which == 13 || event.which == 32 || event.type == 'mousedown') {
      event.preventDefault();
      this.appendChild(menu);
      menu.options = this.options;
      menu.expanded = true;
      menu.addEventListener('io-menu-option-clicked', this._menuListener);
    }
  }
  _menuHandler(event) {
    if (event.detail.option.value !== undefined) {
      this._setValue(event.detail.option.value);
    }
    menu.expanded = false;
    menu.removeEventListener('io-menu-option-clicked', this._menuListener);
  }
  _disabledChanged() {
    if (this.disabled) {
      this.removeAttribute('tabindex');
    } else {
      this.setAttribute('tabindex', 0);
    }
  }
  _update() {
    this.invalid = (typeof this.value !== this.type && this.type) ? true : false;
    if (this.options) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.value) {
          this.innerText = this.options[i].label || this.options[i].value;
          return;
        }
      }
    }
    this.innerText = this.value;
  }
}

window.customElements.define(IoOption.is, IoOption);
