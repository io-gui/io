import {html} from "../../io/ioutil.js"
import {IoPointer} from "../../io/iopointer.js"

export class UiLayoutDivider extends IoPointer {
  static get style() {
    return html`
      <style>
        :host {
          z-index: 2;
          background: #333;
          position: relative;
          color: #ccc;
        }
        :host > div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :host[orientation=horizontal]  {
          width: 8px;
        }
        :host[orientation=vertical]  {
          height: 8px;
        }
        :host[orientation=horizontal] > div {
          height: 100%;
          width: 28px;
          margin-left: -10px;
          cursor: ew-resize;
        }
        :host[orientation=vertical] > div {
          width: 100%;
          height: 28px;
          margin-top: -10px;
          cursor: ns-resize;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      orientation: {
        value: 'horizontal',
        type: String,
        reflectToAttribute: true
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    }
  }
  _pointerMoveHandler(event) {
    let movement = this.orientation === 'horizontal' ?
        event.detail.event.movementX :
        event.detail.event.movementY;
    let prev = this.previousElementSibling;
    let next = this.nextElementSibling;
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    if (!next[d] && !prev[d]) {
      var c = [].slice.call(this.parentElement.children);
      let f = (c.length / 2 - c.indexOf(prev) > c.length / 2 - c.indexOf(next)) ? next : prev;
      f[d] = f.getBoundingClientRect()[d];
      // console.log(f, d)
    }
    if (next[d]) next[d] = Math.max(0, parseInt(next[d]) - movement);
    if (prev[d]) prev[d] = Math.max(0, parseInt(prev[d]) + movement);
  }
  _update() {
    this.render([['div', this.orientation === 'horizontal' ? '⋮' : '⋯']]);
  }
}


window.customElements.define('ui-layout-divider', UiLayoutDivider);
