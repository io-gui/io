import {html, IoElement} from "../../../../io/src/io.js";

const _dragIcon = document.createElement('div');
_dragIcon.style = `pointer-events: none; position: fixed; padding: 0.2em 1.6em; background: rgba(0,0,0,0.5); z-index:2147483647`;

export class IoLayoutTab extends IoElement {
  static get properties() {
    return {
      element: Object,
      tabID: String,
      selected: {
        type: Boolean,
        reflect: true
      },
      pointermode: 'absolute'
    };
  }
  static get listeners() {
    return {
      'io-pointer-end': '_onPointerEnd',
      'io-pointer-move': '_onPointerMove'
    };
  }
  changed() {
    this.innerText = this.tabID;
  }
  _onPointerMove(event) {
    let pointer = event.detail.pointer[0];
    let dist = pointer.distance.length();
    if (!this._dragging && dist > 16 && event.detail.path[0] === this) {
      this._dragging = true;
      this.appendChild(_dragIcon);
      this.dispatchEvent('layout-tab-drag-start', {pointer: pointer, tab: this});
    }
    _dragIcon.innerText = this.tabID;
    _dragIcon.style.left = pointer.position.x - 12 + 'px';
    _dragIcon.style.top = pointer.position.y - 12 + 'px';
    if (this._dragging) {
      this.dispatchEvent('layout-tab-drag', {pointer: pointer, tab: this});
    }
  }
  _onPointerEnd() {
    if (this._dragging) {
      this.removeChild(_dragIcon);
      this._dragging = false;
      this.dispatchEvent('layout-tab-drag-end', {tab: this});
    } else {
      this.dispatchEvent('layout-tab-select', {tabID: this.tabID});
    }
  }
}

IoLayoutTab.Register();
