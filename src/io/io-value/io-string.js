import {html} from "../ioutil.js"
import {Io} from "../io.js"

const editor = document.createElement('input');
editor.type = 'string';
editor.addEventListener('mousedown', function (event) { event.stopPropagation() });
editor.addEventListener('touchstart', function (event) { event.stopPropagation() });
editor.addEventListener('focus', function (event) { event.stopPropagation() });

export class IoString extends Io {
  static get template() {
    return html`
      <style>
        :host {
          cursor: text;
          display: inline-block;
        }
        :host(.invalid) {
          text-decoration: underline;
          text-decoration-style: dashed;
          text-decoration-color: red;
          opacity: 0.25;
        }
        :host(.edit) {
          position: relative;
          color: rgba(0,0,0,0) !important;
        }
        input {
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
      listeners: {
        'focus': '_focusHandler',
        'blur': '_blurHandler'
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
    this._setValue(editor.value);
    this._removeEditor();
  }
  _addEditor() {
    editor.value =  String(this.value);
    this.shadowRoot.appendChild(editor);
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
  _update() {
    this.classList.toggle('invalid', typeof this.value !== 'string');
    this.innerText = String(this.value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define('io-string', IoString);
