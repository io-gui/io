import {IoBase, html} from "./io-base.js"

const editor = document.createElement('input');
editor.addEventListener('mousedown', function (event) { event.stopPropagation() });
editor.addEventListener('touchstart', function (event) { event.stopPropagation() });
editor.addEventListener('focus', function (event) { event.stopPropagation() });

export class IoValue extends IoBase {
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
        :host([disabled]) {
          color: black;
          opacity: 0.25;
          cursor: not-allowed;
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
        :host input:focus{
          /* outline: none; */
        }
        :host input[type=number]::-webkit-inner-spin-button,
        :host input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
      </style><slot>undefined</slot>
    `;
  }
  static get properties() {
    return {
      /* Value to be edited with this element. */
      value: {
        notify: true, //TODO: remove?
        observer: '_updateJob'
      },
      /* Restricts value input to specified type such as string, number or boolean. */
      type: {
        type: String,
        observer: '_typeChanged',
        reflectToAttribute: true
      },
      /* Disables interactions with the element. Removes tabindex attribute. */
      disabled: {
        type: Boolean,
        observer: '_disabledChanged',
        reflectToAttribute: true
      },
      /* Automatically set to true if assigned value mismatches type. Reflects to attribute. */
      invalid: {
        type: Boolean,
        reflectToAttribute: true
      },
      /* Increment step for number type. */
      step: {
        type: Number,
        value: 0.001
      },
      /* Min value for number type. */
      min: {
        type: Number,
        value: -Infinity
      },
      /* Max value for number type. */
      max: {
        type: Number,
        value: Infinity
      }
    }
  }
  constructor(props) {
    super(props);
    this._focusListener = this._focusHandler.bind(this);
    this._blurListener = this._blurHandler.bind(this);
    this._toggleListener = this._toggleHandler.bind(this);
    this._preventDefault = this.preventDefault.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', 0);
    this.addEventListener('focus', this._focusListener);
    this._typeChanged();
    this._disabledChanged();
    this._updateJob();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._focusListener);
    this.removeEventListener('blur', this._blurListener);
    this.removeEventListener('click', this._toggleListener);
    this.removeEventListener('keydown', this._toggleListener);
    this.removeEventListener('mousedown', this._preventDefault);
  }
  _focusHandler(event) {
    this.addEventListener('blur', this._blurListener);
    this._removeEditor();
    if (this.type === 'boolean') {
      this.addEventListener('keydown', this._toggleListener);
    } else {
      this._addEditor();
    }
  }
  _blurHandler(event) {
    this.removeEventListener('keydown', this._toggleListener);
    this.removeEventListener('blur', this._blurListener);
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
    this._shadowRoot.appendChild(editor);
    setTimeout(function () {
      editor.focus();
      editor.select();
    })
    editor._host = this;
    this._edit = true;
  }
  _removeEditor() {
    this.classList.remove('edit');
    if (editor.parentNode && this._edit) {
      editor.type = '';
      editor.value = '';
      editor.parentNode.removeChild(editor);
    }
    editor._host = undefined;
    this._edit = false;
  }
  _typeChanged() {
    if (this.type === 'boolean') {
      this.addEventListener('click', this._toggleListener);
      this.addEventListener('mousedown', this._preventDefault);
    } else {
      this.removeEventListener('click', this._toggleListener);
      this.removeEventListener('mousedown', this._preventDefault);
    }
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
    let value = this.value;
    if (typeof this.value == 'number' && !isNaN(this.value)) {
      value = Math.round(value / this.step) * this.step;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this._updateText(value);
  }
  _updateText(value) {
    this.innerText = String(value).replace(new RegExp(' ', 'g'), '\u00A0');
  }
}

window.customElements.define(IoValue.is, IoValue);
