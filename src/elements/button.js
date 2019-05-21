import {html, IoElement} from "../core/element.js";

export class IoButton extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background: var(--io-button-bg);
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

        padding: var(--io-padding);
        padding-left: calc(3 * var(--io-padding));
        padding-right: calc(3 * var(--io-padding));
        transition: background-color 0.4s;
      }
      :host:focus {
        outline: none;
        border-color: var(--io-focus-color);
      }
      :host:hover {
        background: var(--io-hover-bg);
      }
      :host[pressed] {
        background: var(--io-active-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: undefined,
      label: 'Button',
      pressed: {
        type: Boolean,
        reflect: true
      },
      action: Function,
      tabindex: 0
    };
  }
  static get listeners() {
    return {
      'keydown': 'onKeydown',
      'click': 'onClick',
    };
  }
  onKeydown(event) {
    if (!this.pressed && (event.which === 13 || event.which === 32)) {
      event.preventDefault();
      event.stopPropagation();
      this.pressed = true;
      this.addEventListener('keyup', this.onKeyup);
    }
  }
  onKeyup() {
    this.removeEventListener('keyup', this.onKeyup);
    this.pressed = false;
    if (this.action) this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action}, true);
  }
  onClick() {
    this.pressed = false;
    this.focus();
    if (this.action) this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value, action: this.action}, true);
  }
  changed() {
    this.title = this.label;
    this.innerText = this.label;
  }
}

IoButton.Register();
