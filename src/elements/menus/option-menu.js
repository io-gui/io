import {IoMenuItem} from "./menu-item.js";

// TODO: fix tab-out without collapse

export class IoOptionMenu extends IoMenuItem {
  static get Style() {
    return /* css */`
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
    `;
  }
  static get Properties() {
    return {
      value: {
        reflect: -1,
      },
      selectable: true,
      options: {
        type: Array,
        reflect: -1,
        observe: true,
      },
      role: 'button',
      lazy: false,
    };
  }
  get _options() {
    return this.options;
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

IoOptionMenu.Register();
