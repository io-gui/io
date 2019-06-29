import {html} from "../core/element.js";
import {IoMenuItem} from "./menu.js";
import {IoMenuLayer} from "./menu-layer.js";

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
    event.stopImmediatePropagation();
    this.set('value', event.detail.value);
  }
  _onClick() {
    this._toggleExpanded(true);
  }
  // optionsChanged() {
  //   console.log('asd', this);
  //   this._connectOptions();
  //   // this.setAttribute('hasmore', !!this.options.length && this.direction === 'right');
  // }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      this._toggleExpanded(true);
      this._focusIn();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus === null;
      this.expanded = false;
      this.focusTo('left');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus === null;
      this.expanded = false;
      this.focusTo('up');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus === null;
      this.expanded = false;
      this.focusTo('right');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus === null;
      if (this.expanded) {
        this._focusIn();
      } else {
        this.focusTo('down');
      }
    }
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
