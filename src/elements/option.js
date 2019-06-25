import {html} from "../core/element.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuItem} from "./menu-item.js";

export class IoOption extends IoMenuItem {
  static get style() {
    return html`<style>
      :host {
        white-space: pre;
        display: inline-block;
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-border-radius);
        padding: var(--io-spacing);
        padding-left: calc(3 * var(--io-spacing));
        padding-right: var(--io-spacing);
        transition: background-color 0.4s;
      }
      :host:not([label])::after {
        content: '▾';
        padding-left: var(--io-spacing);
      }
    </style>`;
  }
  static get properties() {
    return {
      role: 'button',
    };
  }
  static get listeners() {
    return {
      'io-menu-item-clicked': '_onMenuItemClicked',
    };
  }
  _onMenuItemClicked(event) {
    this.set('value', event.detail.value);
    IoMenuLayer.singleton.collapseAll();
  }
  changed() {
    const option = this.options.find(option => {return (typeof option === 'object' && option.value === this.value) || option === this.value;});
    let label = this.label || (typeof option === 'object' ? (option.label || option.value) : this.value);
    label = (label instanceof Object) ? label.__proto__.constructor.name : String(label);

    this.title = label;
    this.innerText = label;

    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

IoOption.Register();
