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
          border: 1px outset #666;
        }
        :host[orientation=horizontal] {
          cursor: col-resize;
          width: 8px;
        }
        :host[orientation=vertical] {
          cursor: row-resize;
          height: 8px;
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
        reflect: true
      },
      index: Number,
      pointermode: 'relative',
      listeners: {
        'io-pointer-move': '_pointerMoveHandler'
      }
    };
  }
  _pointerMoveHandler(event) {
    let rect = this.getBoundingClientRect();
    let pos = event.detail.pointer[0].position;
    let d = this.orientation === 'horizontal' ? 'width' : 'height';
    this.fire('app-split-divider-move', {movement: pos.x - rect[d] / 2, index: this.index});
  }
  update() {
    this.render([
      ['div', {class: 'app-divider-icon'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}

AppSplitDivider.Register();
