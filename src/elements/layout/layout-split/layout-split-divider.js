import {Io, html} from "../../../iocore.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";

export class LayoutSplitDivider extends IoPointerMixin(Io) {
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
        :host > .layout-divider-icon {
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
        reflect: true
      },
      index: {
        type: Number
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  // TODO: reproduce and fix sticky movement
  _pointerMoveHandler(event) {
    let rect = this.getBoundingClientRect();
    let movement;
    if (this.orientation === 'horizontal') {
      movement = event.detail.pointer[0].position.x - rect.width / 2;
    } else {
      movement = event.detail.pointer[0].position.y - rect.height / 2;
    }
    this.fire('layout-split-divider-move', {movement: movement, index: this.index});
  }
  update() {
    this.render([
      ['div', {class: 'layout-divider-icon'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}

LayoutSplitDivider.Register();
