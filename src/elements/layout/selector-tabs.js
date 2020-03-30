import {IoSelector} from './selector.js';

export class IoSelectorTabs extends IoSelector {
  static get Style() {
    return /* css */`
    :host > io-menu-options {
      flex: 0 0 auto;
      border: none;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-width: 0 0 var(--io-border-width) 0;
    }
    `;
  }
  static get Properties() {
    return {
      options: {
        type: Array,
        observe: true,
      },
      slotted: {
        type: Array,
        observe: true,
      },
    };
  }
  getSlotted() {
    return ['io-menu-options', {
      role: 'navigation',
      horizontal: true,
      value: this.bind('selected'),
      options: this.options,
      slotted: this.slotted,
      selectable: true,
    }];
  }
}

IoSelectorTabs.Register();
