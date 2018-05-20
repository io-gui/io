import {Io} from "../../../iocore.js";

export class IoButton extends Io {
  static get style() {
    return html`<style>
      :host {
        cursor: pointer;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
      }
      :host:hover {
        background: rgba(255,255,255,0.1);
      }
      :host[pressed] {
        background: rgba(0,0,0,0.1);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: null,
      label: String,
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: Function,
      listeners: {
        'keydown': '_onDown',
        'mousedown': '_onDown',
        'touchstart': '_onDown'
      },
      attributes: {
        'tabindex': 0
      }
    };
  }
  _onAction(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      if (this.pressed && typeof this.action === 'function') this.action(this.value);
      this.pressed = false;
      this.fire('io-button-clicked', {value: this.value, action: this.action});
    }
  }
  _onDown(event) {
    event.stopPropagation();
    if (event.which !== 9) event.preventDefault();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      this.pressed = true;
      document.addEventListener('mouseup', this._onUp);
      document.addEventListener('touchend', this._onUp);
      this.addEventListener('keyup', this._onAction);
      this.addEventListener('mouseup', this._onAction);
      this.addEventListener('touchend', this._onAction);
      this.addEventListener('mouseleave', this._onLeave);
    }
  }
  _onUp(event) {
    event.stopPropagation();
    this.pressed = false;
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('touchend', this._onUp);
    this.removeEventListener('keyup', this._onAction);
    this.removeEventListener('mouseup', this._onAction);
    this.removeEventListener('touchend', this._onAction);
    this.removeEventListener('mouseleave', this._onLeave);
  }
  _onLeave() {
    this.pressed = false;
  }
  update() {
    this.render([['span', this.label]]);
  }
}

IoButton.Register();
