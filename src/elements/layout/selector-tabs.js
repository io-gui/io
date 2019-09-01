import {html} from "../../io.js";
import {IoSelector} from "./selector.js";
// TODO: remove io-menu-options dependency.

export class IoSelectorTabs extends IoSelector {
  static get Style() {
    return html`<style>
    :host {
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
    }
    :host > io-menu-options {
      flex: 0 0 auto;
      border: none;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
    }
    :host > .io-content {
      border: var(--io-border);
      border-width: var(--io-border-width) 0 0 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
    </style>`;
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
  get _options() {
    return this.options.length ? this.options : this.elements.map(element => { return element[1].name; });
  }
  getSlotted() {
    return ['io-menu-options', {
      role: 'navigation',
      horizontal: true,
      value: this.bind('selected'),
      options: this._options,
      slotted: this.slotted,
      selectable: true,
    }];
  }
}

IoSelectorTabs.Register();
