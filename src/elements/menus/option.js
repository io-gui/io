import {html} from "../../io.js";
import {IoLayerSingleton} from "../../io-elements-core.js";
import {IoMenuItem} from "./menu-item.js";

export class IoMenuOption extends IoMenuItem {
  static get Style() {
    return html`<style>
      :host {
        display: inline-block;
        text-align: center;
        border-radius: var(--io-border-radius);
        border: var(--io-border);
        border-color: var(--io-color-border-outset);
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        padding-left: calc(2 * var(--io-spacing));
        padding-right: calc(2 * var(--io-spacing));
      }
      :host {
        text-align: left;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'button',
    };
  }
  static get Properties() {
    return {
      value: {
        reflect: -1,
      },
      options: {
        type: Array,
        reflect: -1,
      },
    };
  }
  get _options() {
    if (this.options && this.options.length) {
      return this.options;
    }
    return undefined;
  }
  _onClick(event) {
    // TODO: unhack
    // TODO: fires twice on mouse?
    // TODO: on poiter up outside?
    if (event.pointerType === 'touch') this.expanded = true;
  }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      this.expanded = true;
      this._focusIn();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      // IoLayerSingleton.LastFocus = null;
      this.expanded = false;
      this.focusTo('left');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      // IoLayerSingleton.LastFocus = null;
      this.expanded = false;
      this.focusTo('up');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      // IoLayerSingleton.LastFocus = null;
      this.expanded = false;
      this.focusTo('right');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      // IoLayerSingleton.LastFocus = null;
      if (this.expanded) {
        this._focusIn();
      } else {
        this.focusTo('down');
      }
    }
  }
  changed() {
    let valueText;
    if (this.options) {
      const option = this.options.find(option => {return option.value === this.value;});
      if (option) {
        if (option.label) {
          valueText = option.label;
        } else if (typeof option.value === 'object') {
          valueText = `${option.value.constructor.name}` + (option.value instanceof Array ? `(${option.value.length})` : '');
        } else {
          valueText = String(option.value);
        }
      }
    }
    valueText = this.label || (valueText || String(this.value)) + ' ▾';
    this.textNode = valueText;
    this.title = valueText;
    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', String(this.expanded));
    this.$options.setProperties({
      value: this.value,
      options: this._options,
      selectable: this.selectable,
      position: this.direction,
    });
  }
}

IoMenuOption.Register();
