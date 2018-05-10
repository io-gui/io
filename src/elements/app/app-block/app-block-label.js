import {Io, html} from "../../../iocore.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";
import "../../io/io-button/io-button.js";

const _dragIcon = document.createElement('div');
_dragIcon.style = `pointer-events: none; position: fixed; padding: 0.2em 1.6em; background: rgba(0,0,0,0.5); z-index:2147483647`;

export class AppBlockLabel extends IoPointerMixin(Io) {
  static get style() {
    return html`
      <style>
        :host {
          flex: none;
          user-select: none;
          cursor: pointer;
          padding: 0.2em 0 0.2em 1.6em;
          border-right: 1px solid #999;
          background: #bbb;
        }
        :host[single] {
          border-right: none;
        }
        :host[selected] {
          background: #ccc;
        }
        :host > span {
          pointer-events: none;
        }
        :host > io-button {
          line-height: 1em;
          padding: 0 0.4em;
          margin-left: 0em;
          opacity: 0;
        }
        :host > io-button:hover {
          opacity: 1;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      element: {
        type: Object
      },
      label: {
        type: String
      },
      selected: {
        type: Boolean,
        reflect: true
      },
      listeners: {
        'io-pointer-end': '_pointerEndHandler',
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  update() {
    this.render([
      ['span', this.label],
      ['io-button', {label: '⨯', action: this._deleteButtonHandler}]
    ]);
  }
  _deleteButtonHandler() {
    this.fire('app-block-delete', this);
  }
  _pointerMoveHandler(event) {
    let dist = event.detail.pointer[0].distance.length();
    if (!this._dragging && dist > 16 && event.detail.path[0] === this) {
      this._dragging = true;
      this.appendChild(_dragIcon);
      this.fire('app-block-drag-start', this);
    }
    let rect = this.getBoundingClientRect();
    _dragIcon.innerHTML = this.label;
    _dragIcon.style.left = rect.left + event.detail.pointer[0].position.x - 12 + 'px';
    _dragIcon.style.top = rect.top + event.detail.pointer[0].position.y - 12 + 'px';
    if (this._dragging) {
      this.fire('app-block-drag', this);
    }
  }
  _pointerEndHandler(event) {
    if (this._dragging) {
      this.removeChild(_dragIcon);
      this._dragging = false;
      this.fire('app-block-drag-end', this);
    }
  }
}

AppBlockLabel.Register();
