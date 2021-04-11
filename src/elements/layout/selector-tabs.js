import {RegisterIoElement} from '../../../srcj/components/io-element.js';
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
      slotted: {
        type: Array,
        observe: true,
      },
      depth: Infinity,
    };
  }
  getSlotted() {
    return ['io-menu-options', {
      role: 'navigation',
      horizontal: true,
      // value: this.bind('selected'), // TODO: Does not exist
      options: this.options,
      depth: this.depth,
      slotted: this.slotted,
      // selectable: true, // TODO: Does not exist
    }];
  }
}

RegisterIoElement(IoSelectorTabs);
