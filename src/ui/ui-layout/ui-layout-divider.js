import {Io} from "../../io/io.js"
import {html} from "../../io/ioutil.js"
import {IoPointerMixin} from "../../io/iopointer.js"

export class UiLayoutDivider extends IoPointerMixin(Io) {
  static get style() {
    return html`
      <style>
      :host {
          background: #333;
          color: #ccc;
          z-index: 1;
          display: flex;
          flex: none;
        }
        :host[orientation=horizontal] {
          cursor: ew-resize;
        }
        :host[orientation=vertical] {
          cursor: ns-resize;
        }
        :host > .io-divider-icon {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
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
      index: {
        type: Number
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    }
  }
  _pointerMoveHandler(event) {
    let rect = this.getBoundingClientRect();
    let movement
    if (this.orientation === 'horizontal') {
      movement = event.detail.pointer[0].position.x - (rect.x + rect.width / 2);
    } else {
      movement = event.detail.pointer[0].position.y - (rect.y + rect.height / 2);
    }
    this.dispatchEvent(new CustomEvent('ui-layout-divider-move', {
      detail: {movement: movement, index: this.index},
      bubbles: true,
      composed: true
    }));
  }
  update() {
    this.render([
      ['div', {class: 'io-divider-icon'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}


window.customElements.define('ui-layout-divider', UiLayoutDivider);
