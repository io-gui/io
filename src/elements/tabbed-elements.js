import {html, IoElement} from "../core/element.js";
import "./element-cache.js";

export class IoTabbedElements extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
        overflow: auto;
      }
      :host > io-tabs {
        z-index: 2;
        flex: 0 0 auto;
        margin: 0 var(--io-theme-spacing);
        margin-bottom: calc(-1.1 * var(--io-theme-border-width));
      }
      :host[editable] > .new-tab-selector {
        position: absolute;
        top: 0;
        right: var(--io-theme-spacing);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        z-index: 1;
        opacity: 0.4;
      }
      :host[editable] > io-tabs {
        margin-right: calc(2.2em + var(--io-theme-spacing)) !important;
      }
      :host > io-element-cache {
        flex: 1 1 auto;
        padding: var(--io-theme-padding);
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        background: var(--io-theme-content-bg);
        overflow: auto;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      filter: Array,
      selected: String,
      precache: false,
      cache: true,
      editable: {
        type: Boolean,
        reflect: true
      },
      role: {
        type: String,
        reflect: false
      }
    };
  }
  changed() {
    const _elements = this.elements.map(element => { return element[1].label; });
    const _filter = this.filter.length ? this.filter : _elements;

    // TODO: consider testing with large element collections and optimizing.
    const options = [];
    for (let i = 0; i < _elements.length; i++) {
      const added = this.filter.indexOf(_elements[i]) !== -1;
      options.push({
        icon: added ? '⌦' : '·',
        value: _elements[i],
        action: added ? this._onRemoveTab : this._onAddTab,
      });
    }

    this.template([
      this.editable ? ['io-option', {
        className: 'new-tab-selector',
        label: '🛠',
        options: options,
      }] : null,
      ['io-tabs', {
        id: 'tabs',
        selected: this.bind('selected'),
        tabs: _filter,
        role: 'navigation',
      }],
      ['io-element-cache', {
        elements: this.elements,
        selected: this.selected,
        cache: this.cache,
        precache: this.precache,
        role: this.role,
      }],
    ]);
  }
  _onAddTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    this.filter.push(tabID);
    this.selected = tabID;
    this.$.tabs.resized();
    this.changed();
  }
  _onRemoveTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    if (this.filter.indexOf(this.selected) == -1) {
      this.selected = this.filter[0];
    }
    this.$.tabs.resized();
    this.$.tabs.changed();
    this.changed();
  }
}

IoTabbedElements.Register();

export class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        font-style: italic;
        overflow: hidden;
        flex: 0 1 auto;
      }
      :host > * {
        flex: 0 0 auto;
        margin-right: var(--io-theme-spacing);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host > *.io-selected {
        border-bottom-color: var(--io-theme-content-bg);
        background-image: none;
      }
      :host[overflow] > :nth-child(n+3) {
        visibility: hidden;
      }
      :host > io-option {
        font-style: normal;
      }
      :host > io-button {
        letter-spacing: 0.145em;
        font-weight: 500;
      }
      :host > io-button:not(.io-selected) {
        color: rgba(0, 0, 0, 0.5);
      }
      :host > io-button.io-selected {
        background: var(--io-theme-content-bg);
        font-weight: 600;
        letter-spacing: 0.11em;
      }
    </style>`;
  }
  static get properties() {
    return {
      tabs: Array,
      selected: String,
      overflow: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  select(id) {
    this.selected = id;
  }
  resized() {
    const rect = this.getBoundingClientRect();
    const lastButton = this.children[this.children.length-1];
    const rectButton = lastButton.getBoundingClientRect();
    this.overflow = rect.right < rectButton.right;
  }
  changed() {
    const buttons = [];
    let selectedButton;
    for (let i = 0; i < this.tabs.length; i++) {
      const selected = this.selected === this.tabs[i];
      const button = ['io-button', {
        label: this.tabs[i],
        value: this.tabs[i],
        action: this.select,
        className: selected ? 'io-selected' : ''
      }];
      if (selected) selectedButton = button;
      buttons.push(button);
    }
    const elements = [
      this.overflow ? [['io-option', {
        label: '☰',
        title: 'select tab menu',
        value: this.bind('selected'),
        options: this.tabs
      }],
      selectedButton] : null,
      ...buttons
    ];
    this.template(elements);
  }
}

IoTabs.Register();
