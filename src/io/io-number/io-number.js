import {Io} from "../io.js"
import {html} from "../ioutil.js"

const editor = document.createElement('input');
editor.type = 'number';
editor.addEventListener('mousedown', function (event) { event.stopPropagation() });
editor.addEventListener('touchstart', function (event) { event.stopPropagation() });
editor.addEventListener('focus', function (event) { event.stopPropagation() });

export class IoNumber extends Io {
  static get style() {
    return html`
      <style>
        :host.edit {
          position: relative;
        }
        :host > input {
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
          -moz-appearance: textfield;
          color: inherit;
        }
        :host > input::-webkit-inner-spin-button,
        :host > input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: 'update'
      },
      step: {
        type: Number,
        value: 0.1
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
        'focus': '_focusHandler'
      },
      attributes: {
        'tabindex': 0
      }
    }
  }
  _focusHandler(event) {
    this._addEditor();
  }
  _blurHandler(event) {
    this._setValue(Math.round(Number(editor.value) / this.step) * this.step);
    this._removeEditor();
    editor.removeEventListener('blur', this._blurHandler);
  }
  _addEditor() {
    editor.value = (typeof this.value !== 'number' || isNaN(this.value)) ? 0 : String(this.value);
    editor.step = this.step;
    editor.min = Math.min(this.min, this.value);
    editor.max = Math.max(this.max, this.value);
    editor.addEventListener('blur', this._blurHandler);
    this.appendChild(editor);
    setTimeout(function () {
      editor.focus();
      editor.select();
    });
    this.classList.add('edit');
  }
  _removeEditor() {
    if (editor.parentNode) editor.parentNode.removeChild(editor);
    this.classList.remove('edit');
  }
  update() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = Math.round(value / this.step) * this.step;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

window.customElements.define('io-number', IoNumber);
