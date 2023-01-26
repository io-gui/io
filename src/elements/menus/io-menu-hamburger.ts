import { RegisterIoElement } from '../../core/element.js';
import { IoMenuItem } from './io-menu-item.js';

@RegisterIoElement
export class IoMenuHamburger extends IoMenuItem {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        user-select: none;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
    `;
  }

  changed() {
    if (this.$options !== undefined && this.item.options) {
      this.$options.options = this.item.options;
    }
    this.setAttribute('selected', this.item.selected);
    this.setAttribute('hidden', this.item.hidden);
    this.disabled = this.item.disabled; // TODO: reconsider this
    this.template([['io-icon', {icon: 'icons:hamburger'}]]);
  }
}

