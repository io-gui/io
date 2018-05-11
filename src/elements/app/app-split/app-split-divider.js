import {Io, html} from "../../../iocore.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";

export class AppSplitDivider extends IoPointerMixin(Io) {
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
          cursor: col-resize;
        }
        :host[orientation=vertical] {
          cursor: row-resize;
        }
        :host > .app-divider-icon {
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
      pointermode: {
        value: 'relative'
      },
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  _pointerMoveHandler(event) {
    let rect = this.getBoundingClientRect();
    let pos = event.detail.pointer[0].position;
    if (this.orientation === 'horizontal') {
      this.fire('app-split-divider-move', {movement: pos.x - rect.width / 2, index: this.index});
    } else {
      this.fire('app-split-divider-move', {movement: pos.y - rect.height / 2, index: this.index});
    }
  }
  update() {
    this.render([
      ['div', {class: 'app-divider-icon'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}

AppSplitDivider.Register();
