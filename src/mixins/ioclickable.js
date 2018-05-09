import {html} from "../iocore.js";

export const IoClickableMixin = (superclass) => class extends superclass {
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
      pressed: {
        type: Boolean,
        reflect: true
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
  clickAction() {
    console.log('asd');
  }
  _clickedHandler(event) {
    event.stopPropagation();
    if (event.which === 13 || event.which === 32 || event.type !== 'keyup') {
      event.preventDefault();
      this.pressed = false;
      this.clickAction();
    }
  }
  _downHandler(event) {
    event.stopPropagation();
    if (event.which !== 9) event.preventDefault();
    if (event.which === 13 || event.which === 32 || event.type !== 'keydown') {
      this.pressed = true;
      document.addEventListener('mouseup', this._upHandler);
      document.addEventListener('touchend', this._upHandler);
      this.addEventListener('keyup', this._clickedHandler);
      this.addEventListener('mouseup', this._clickedHandler);
      this.addEventListener('touchend', this._clickedHandler);
      this.addEventListener('mouseleave', this._leaveHandler);
    }
  }
  _upHandler(event) {
    event.stopPropagation();
    this.pressed = false;
    document.removeEventListener('mouseup', this._upHandler);
    document.removeEventListener('touchend', this._upHandler);
    this.removeEventListener('keyup', this._clickedHandler);
    this.removeEventListener('mouseup', this._clickedHandler);
    this.removeEventListener('touchend', this._clickedHandler);
    this.removeEventListener('mouseleave', this._leaveHandler);
  }
  _leaveHandler() {
    this.pressed = false;
  }
};
