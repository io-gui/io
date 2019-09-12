import {IoElement} from "../../io.js";

export class IoCollapsable extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-boolean {
      text-align: left;
      align-self: stretch;
      width: auto;
      border-radius: 0;
      background-color: var(--io-background-color-dark);
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 1.125em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > io-boolean[value]:not(:focus) {
      border-bottom-color: var(--io-color-border);
    }
    `;
  }
  static get Properties() {
    return {
      elements: Array,
      label: {
        reflect: 1,
      },
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      role: 'region',
    };
  }
  changed() {
    this.template([
      ['io-boolean', {true: this.label, false: this.label, value: this.bind('expanded')}],
      ['io-content', {elements: this.elements, expanded: this.expanded}],
    ]);
  }
}

IoCollapsable.Register();
