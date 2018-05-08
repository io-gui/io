import {Io, html} from "../../../iocore.js";

export class IoButton extends Io {
  static get style() {
    return html`
      <style>
        :host {
          cursor: pointer;
          white-space: nowrap;
          -webkit-tap-highlight-color: transparent;
        }
        :host:hover {
          background: rgba(255,255,255,0.05);
        }
        :host[pressed] {
          background: rgba(0,0,0,0.05);
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
      },
      label: {
        type: String
      },
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: {
        type: Function
      },
      listeners: {
        'keydown': '_downHandler',
        'mousedown': '_downHandler',
        'touchstart': '_downHandler',
        'mouseenter': '_enterHandler',
      },
      attributes: {
        'tabindex': 0
      }
    };
  }
  _actionHandler(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      if (this.pressed && typeof this.action === 'function') this.action(this.value);
      this.pressed = false;
    }
  }
  _downHandler(event) {
    event.stopPropagation();
    if (event.which !== 9) event.preventDefault();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      this.pressed = true;
      document.addEventListener('mouseup', this._upHandler);
      document.addEventListener('touchend', this._upHandler);
      this.addEventListener('keyup', this._actionHandler);
      this.addEventListener('mouseup', this._actionHandler);
      this.addEventListener('touchend', this._actionHandler);
      this.addEventListener('mouseleave', this._leaveHandler);
    }
  }
  _upHandler(event) {
    event.stopPropagation();
    this.pressed = false;
    document.removeEventListener('mouseup', this._upHandler);
    document.removeEventListener('touchend', this._upHandler);
    this.removeEventListener('keyup', this._actionHandler);
    this.removeEventListener('mouseup', this._actionHandler);
    this.removeEventListener('touchend', this._actionHandler);
    this.removeEventListener('mouseleave', this._leaveHandler);
  }
  _leaveHandler() {
    this.pressed = false;
  }
  update() {
    this.render([['span', this.label]]);
  }
}

IoButton.Register();
