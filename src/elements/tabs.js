import {html, IoElement} from "../core/element.js";

export class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow: visible;
        flex: 0 1 auto;
        position: relative;
      }
      :host > * {
        flex: 0 0 auto;
        margin-right: var(--io-spacing);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
      }
      :host[overflow] > :nth-child(n+3):not(.edit-option) {
        /* visibility: hidden; */
        /* left: 0; */
        /* position: absolute; */
      }
      :host > io-button:focus {
        border-style: solid;
        border-bottom: none;
      }
      :host > io-button.io-selected-tab {
        border-bottom-color: var(--io-background-color);
        border-bottom-style: solid;
        background: var(--io-background-color);
        color: var(--io-link-color);
        margin-bottom: -1px;
        background-image: none;
      }
      :host > io-button.io-tab-insert-before {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em),
                          linear-gradient(90deg, var(--io-focus-color) 0.3em, transparent 0.31em);
      }
      :host > io-button.io-tab-insert-after {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em),
                          linear-gradient(270deg, var(--io-focus-color) 0.3em, transparent 0.31em);
      }
      :host > io-button.io-selected-tab.io-tab-insert-before {
        background-image: linear-gradient(90deg, var(--io-focus-color) 0.3em, transparent 0.31em);
      }
      :host > io-button.io-selected-tab.io-tab-insert-after {
        background-image: linear-gradient(270deg, var(--io-focus-color) 0.3em, transparent 0.31em);
      }
      :host > io-option {
        background: none !important;
        border: none;
        padding-left: calc(3 * var(--io-padding));
        padding-right: calc(3 * var(--io-padding));
      }
      :host > .edit-spacer {
        flex: 0 0 3.5em;
        background: none;
      }
      :host > .edit-option {
        border: none;
        background: none;
        position: absolute;
        right: 0;
      }
      :host > .edit-option:not(:hover) {
        opacity: 0.3;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      filter: null,
      selected: String,
      overflow: {
        type: Boolean,
        reflect: true,
      },
      dropIndex: -1,
      role: 'navigation',
    };
  }
  select(id) {
    this.selected = id;
  }
  resized() {
    let right = this.getBoundingClientRect().right;
    const lastButton = this.children[this.children.length - 2];
    if (this.overflow) {
      // const hamburgerButton = this.children[0];
      // const firstButton = this.children[1];
      // right += hamburgerButton.getBoundingClientRect().width + firstButton.getBoundingClientRect().width;
    }
    this.overflow = lastButton && right < lastButton.getBoundingClientRect().right;
  }
  changed() {
    // TODO: consider testing with large element collections and optimizing.
    const options = [];
    const _elements = this.elements.map(element => { return element[1].name; });
    for (let i = 0; i < _elements.length; i++) {
      const added = this.filter && this.filter.indexOf(_elements[i]) !== -1;
      options.push({
        icon: added ? '⌦' : '·',
        value: _elements[i],
        action: added ? this._onRemoveTab : this._onAddTab, // TODO: make toggle on options
      });
    }
    const buttons = [];
    let selectedButton;
    // const currentIndex = this.filter.indexOf(this.selected);
    for (let i = 0; i < this.filter.length; i++) {
      const selected = this.selected === this.filter[i];
      let className = 'io-tab';
      if (selected) className += ' io-selected-tab';
      if (this.dropIndex !== -1) {// && this.dropIndex !== currentIndex && this.dropIndex !== currentIndex + 1) {
        if (this.dropIndex === i) className += ' io-tab-insert-before';
        if (this.dropIndex === i + 1) className += ' io-tab-insert-after';
      }
      const button = ['io-button', {
        label: this.filter[i],
        value: this.filter[i],
        action: this.select,
        className: className,
      }];
      if (selected) selectedButton = button;
      buttons.push(button);
    }
    const elements = [];
    if (this.overflow) {
      elements.push(['io-option', {
        label: '☰',
        title: 'select tab menu',
        value: this.bind('selected'),
        options: this.filter
      }]);
      if (selectedButton) {
        elements.push(selectedButton);
      }
    }
    elements.push(...buttons);
    this.template(elements);
  }
}

IoTabs.Register();
