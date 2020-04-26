import {IoElement, Options, OptionItem} from '../../io.js';
import './menu-item.js';

// TODO: fix tab-out without collapse

export class IoOptionMenu extends IoElement {
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
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--io-border-width));
    }
    `;
  }
  static get Properties() {
    return {
      value: {
        reflect: -1,
      },
      options: {
        type: Options,
        reflect: -1,
        observe: true,
        strict: true,
      },
      role: 'button',
    };
  }
  // get compose() {
  //   return {
  //     options: {selected: this.bind('value')}
  //   };
  // }
  get _label() {
    const valueText = (this.value !== undefined) ? String(this.value) : '';
    return this.label || valueText || '';
  }
  changed() {
    let valueText = '';
    if (this.options.length) {
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
    if (!valueText) valueText = this._label;
    if (this.icon) {
      valueText = this.icon + '  ' + valueText;
    }

    const option = new OptionItem({
      label: valueText,
      options: this.options,
    });
    // TODO: clean up - make reactive or composed
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].select = 'pick'; // TODO: reconsider
    }
    this.options.selected = this.bind('value'); // TODO: consider conpose()

    this.template([
      ['io-menu-item', {
        option: option,
        position: 'bottom',
      }]
    ]);
  }
}

IoOptionMenu.Register();
