import {IoMenuItem} from './menu-item.js';
import {Options} from './options.js';

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
      select: 'pick',
      options: {
        type: Options,
        reflect: -1,
        observe: true,
        strict: true,
      },
      icon: '\u25BE',
      role: 'button',
      lazy: false,
    };
  }
  get compose() {
    return {
      options: {selected: this.bind('value')}
    };
  }
  get _label() {
    const valueText = (this.value !== undefined) ? String(this.value) : '';
    return this.label || valueText || '';
  }
  changed() {
    let valueText = '';
    if (this.options.__options.length) {
      const option = this.options.__options.find(option => {return option.value === this.value;});      
      if (option) {
        if (option.label) {
          valueText = option.label;
        } else if (typeof option.value === 'object') {
          valueText = `${option.value.constructor.name}` + (option.value instanceof Array ? `(${option.value.length})` : '');
        } else {
          valueText = String(option.value);
        }
      }
      // TODO: clean up - make reactive or composed
      for (let i = 0; i < this.options.__options.length; i++) {
        this.options.__options[i].select = this.select;
      }
    }
    if (!valueText) valueText = this._label;
    if (this.icon) {
      valueText = this.icon + '  ' + valueText;
    }

    this.title = valueText;
    this.textNode = valueText;

    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', String(this.expanded));
    // this.setAttribute('hasmore', this.hasmore);

    if (this.expanded) {
      this.$options.setProperties({
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.options,
        select: this.select,
        position: this.direction,
      });
    }
  }
}

IoOptionMenu.Register();
