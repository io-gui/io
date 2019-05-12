import {html, IoElement} from "../core/element.js";

export class IoLayoutDivider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background: #333;
        color: #ccc;
        z-index: 1;
        display: flex;
        flex: none;
        border: 1px outset #666;
        user-select: none;
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
      pointermode: 'relative'
    };
  }
  static get listeners() {
    return {
      'pointermove': '_onPointerMove'
    };
  }
  _onPointerMove(event) {
    if (event.buttons) {
      event.preventDefault();
      this.setPointerCapture(event.pointerId);
      this.dispatchEvent('io-layout-divider-move', {
        movement: this.orientation === 'horizontal' ? event.movementX : event.movementY,
        index: this.index
      }, true);
    }
  }
  changed() {
    this.template([
      ['div', {className: 'app-divider'}, this.orientation === 'horizontal' ? '⋮' : '⋯']
    ]);
  }
}

IoLayoutDivider.Register();
