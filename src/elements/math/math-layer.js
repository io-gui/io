import {IoElement, html} from "../../io.js";

export class IoMathLayer extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: block;
        visibility: hidden;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        user-select: none;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
      }
      :host[expanded] {
        visibility: visible;
        pointer-events: all;
      }
      :host > io-color-picker {
        width: 160px;
        height: 128px;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      expanded: {
        value: false,
        notify: true,
      },
    };
  }
  static get Listeners() {
    return {
      'mousedown': '_onMousedown',
      'touchstart': '_onTouchstart',
      'contextmenu': '_onContextmenu',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowScroll);
    window.addEventListener('wheel', this._onWindowScroll);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowScroll);
    window.removeEventListener('wheel', this._onWindowScroll);
  }
  _onWindowScroll() {
    this.expanded = false;
  }
  _onMousedown(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  _onTouchstart(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  _onContextmenu(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  _onChildExpanded() {
    let expanded = false;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].expanded === true) expanded = true;
    }
    this.expanded = expanded;
  }
  expandedChanged() {
    if (!this.expanded) {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].expanded = false;
      }
    }
  }
}

IoMathLayer.Register();

IoMathLayer.singleton = new IoMathLayer();
document.body.appendChild(IoMathLayer.singleton);
