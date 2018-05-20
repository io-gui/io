import {Io} from "../../../iocore.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";

export class AppSplitDivider extends IoPointerMixin(Io) {
  static get style() {
    return html`<style>
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
        width: 4px;
      }
      :host[orientation=vertical] {
        cursor: row-resize;
        height: 4px;
      }
      :host > .app-divider {
        flex: 1;
        margin: -0.4em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>`;
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
        'io-pointer-move': '_onPointerMove'
      }
    };
  }
  _onPointerMove(event) {
    let rect = this.getBoundingClientRect();
    let pos = event.detail.pointer[0].position;
    let mov = this.orientation === 'horizontal' ? pos.x : pos.y;
    let dim = this.orientation === 'horizontal' ? 'width' : 'height';
    this.fire('app-split-divider-move', {movement: mov - rect[dim] / 2, index: this.index});
  }
  update() {
    this.render([
      ['div', {class: 'app-divider'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}

AppSplitDivider.Register();
