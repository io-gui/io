import {Io, html} from "../../../iocore.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";

const _dragIcon = document.createElement('div');
_dragIcon.style = `pointer-events: none; position: fixed; padding: 0.2em 1.6em; background: rgba(0,0,0,0.5); z-index:2147483647`;

export class AppBlockTab extends IoPointerMixin(Io) {
  static get properties() {
    return {
      element: Object,
      tabID: String,
      selected: {
        type: Boolean,
        reflect: true
      },
      pointermode: 'absolute',
      listeners: {
        'io-pointer-end': '_pointerEndHandler',
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  update() {
    this.innerHTML = this.tabID;
  }
  _pointerMoveHandler(event) {
    let pointer = event.detail.pointer[0];
    let dist = pointer.distance.length();
    if (!this._dragging && dist > 16 && event.detail.path[0] === this) {
      this._dragging = true;
      this.appendChild(_dragIcon);
      this.fire('app-block-tab-drag-start', {pointer: pointer, tab: this});
    }
    let rect = this.getBoundingClientRect();
    _dragIcon.innerHTML = this.tabID;
    _dragIcon.style.left = pointer.position.x - 12 + 'px';
    _dragIcon.style.top = pointer.position.y - 12 + 'px';
    if (this._dragging) {
      this.fire('app-block-tab-drag', {pointer: pointer, tab: this});
    }
  }
  _pointerEndHandler(event) {
    if (this._dragging) {
      this.removeChild(_dragIcon);
      this._dragging = false;
      this.fire('app-block-tab-drag-end', {tab: this});
    } else {
      this.fire('app-block-tab-select', {tabID: this.tabID});
    }
  }
}

AppBlockTab.Register();
