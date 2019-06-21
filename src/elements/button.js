import {html, IoElement} from "../core/element.js";

export class IoButton extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background-color: var(--io-background-color-dark);
        background-image: var(--io-button-gradient);
        color: var(--io-color);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-border-radius);
        display: inline-block;
        cursor: pointer;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        padding: var(--io-spacing);
        padding-left: calc(3 * var(--io-spacing));
        padding-right: calc(3 * var(--io-spacing));
        transition: background-color 0.4s;
      }
      :host:focus {
        outline: 1px solid var(--io-focus-color);
        outline-offset: -1px;
      }
      :host:hover {
        background-color: var(--io-hover-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      label: 'Button',
      action: Function,
      value: undefined,
      role: 'button',
      tabindex: 0,
    };
  }
  static get listeners() {
    return {
      'click': '_onClick',
      'keydown': '_onKeydown',
    };
  }

  _onClick() {
    if (this.action) this.action(this.value);
    this.dispatchEvent('button-clicked', {value: this.value, action: this.action});
  }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      if (this.action) this.action(this.value);
      this.dispatchEvent('button-clicked', {value: this.value, action: this.action});
    } else if (event.which == 37) {
      event.preventDefault();
      this.focusTo('left');
    } else if (event.which == 38) {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.which == 39) {
      event.preventDefault();
      this.focusTo('right');
    } else if (event.which == 40) {
      event.preventDefault();
      this.focusTo('down');
    }
  }
  changed() {
    this.title = this.label;
    this.innerText = this.label;
  }
}

IoButton.Register();
