import {html, IoElement} from "../core/element.js";

export class IoLayoutDivider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background: var(--io-background-color);
        color: var(--io-color);
        z-index: 1;
        display: flex;
        flex: none;
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        user-select: none;
        transition: background-color 0.4s;
      }
      :host:hover {
        background-color: var(--io-focus-color);
      }
      :host[orientation=horizontal] {
        cursor: col-resize;
        width: var(--io-padding);
        border-top: 0;
        border-bottom: 0;
      }
      :host[orientation=vertical] {
        cursor: row-resize;
        height: var(--io-padding);
        border-left: 0;
        border-right: 0;
      }
      :host > .app-divider {
        flex: 1;
        display: flex;
        margin-left: -0.03em;
        margin-top: -0.06em;
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
