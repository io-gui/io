import {html} from "../ioutil.js"
import {Io} from "../io.js"

const editor = document.createElement('input');
editor.addEventListener('mousedown', function (event) { event.stopPropagation() });
editor.addEventListener('touchstart', function (event) { event.stopPropagation() });
editor.addEventListener('focus', function (event) { event.stopPropagation() });

export class IoValue extends Io {
  static get is() { return 'io-value'; }
  static get template() {
    return html`
      <style>
        :host {
          cursor: text;
          display: inline-block;
        }
        :host([type="boolean"]) {
          cursor: pointer;
        }
        :host([invalid]) {
          text-decoration: underline;
          text-decoration-style: dashed;
          text-decoration-color: red;
          opacity: 0.25;
        }
        :host(.edit) {
          position: relative;
          color: rgba(0,0,0,0) !important;
        }
        :host input {
          position: absolute;
          display: block;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: transparent;
          background: rgba(125,0,0,0.1);
          padding: 0;
          border: 0px solid;
          font-size: inherit;
          font-style: inherit;
          font-family: inherit;
        }
        :host input[type=number]::-webkit-inner-spin-button,
        :host input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: '_update'
      },
      type: {
        type: String,
        reflectToAttribute: true
      },
      invalid: {
        type: Boolean,
        reflectToAttribute: true
      },
      step: {
        type: Number,
        value: 0.001
      },
      min: {
        type: Number,
        value: -Infinity
      },
      max: {
        type: Number,
        value: Infinity
      },
      listeners: {
        'focus': '_focusHandler',
        'click': '_toggleHandler'
      }
    }
  }
  constructor(props) {
    super(props);
    this.setAttribute('tabindex', 0);
  }
  _focusHandler(event) {
    this.addEventListener('blur', this._blurHandler);
    this._removeEditor();
    if (this.type === 'boolean') {
      this.addEventListener('keydown', this._toggleHandler);
    } else {
      this._addEditor();
    }
  }
  _blurHandler(event) {
    this.removeEventListener('keydown', this._toggleHandler);
    this.removeEventListener('blur', this._blurHandler);
    if (this.type === 'number') {
      if (editor.value !== '') {
        this._setValue(Math.round(Number(editor.value) / this.step) * this.step);
      }
    } else if (this._edit) {
      this._setValue(editor.value);
    }
    this._removeEditor();
  }
  _toggleHandler(event) {
    if (this.type !== 'boolean') return;
    if (event.which == 13 || event.which == 32) {
      event.preventDefault();
      this._setValue(!this.value);
    } else if (event.type == 'click') {
      this._setValue(!this.value);
    }
  }
  _addEditor() {
    this.classList.add('edit');
    editor.type = this.type || 'string';
    editor.value =  String(this.value);
    if (this.type === 'number') {
      if (typeof this.value !== 'number' || this.value === null || isNaN(this.value)) {
        editor.value = 0;
      }
    }
    editor.step = this.step;
    editor.min = Math.min(this.min, this.value);
    editor.max = Math.max(this.max, this.value);
    this.shadowRoot.appendChild(editor);
    setTimeout(function () {
      editor.focus();
      editor.select();
    })
    this._edit = true;
  }
  _removeEditor() {
    this.classList.remove('edit');
    if (editor.parentNode && this._edit) {
      editor.type = '';
      editor.value = '';
      editor.parentNode.removeChild(editor);
    }
    this._edit = false;
  }
  _update() {
    this.invalid = (typeof this.value !== this.type && this.type) ? true : false;
    let value = this.value;
    if (typeof this.value == 'number' && !isNaN(this.value)) {
      value = Math.round(value / this.step) * this.step;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define(IoValue.is, IoValue);
