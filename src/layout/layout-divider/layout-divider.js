import {html} from "../../io/ioutil.js"
import {IoPointer} from "../../io/iopointer.js"

export class LayoutDivider extends IoPointer {
  static get style() {
    return html`
      <style>
        :host  {
          color: #ccc;
          width: 8px;
          position: relative;
          z-index: 2;
          background: #333;
        }
        :host > div {
          height: 100%;
          width: 28px;
          margin-left: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: ew-resize;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    }
  }
  _pointerMoveHandler(event) {
    let movement = event.detail.event.movementX;
    let prev = this.previousElementSibling;
    let next = this.nextElementSibling;
    next.width = Math.max(0, next.width - movement);
    prev.width = Math.max(0, prev.width + movement);
  }
  _update() {
    this.render([['div', '⋮']]);
  }
}


window.customElements.define('layout-divider', LayoutDivider);
