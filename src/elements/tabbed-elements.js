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
      :host[vertical] {
        flex-direction: row;
      }
      :host > io-tabs {
        z-index: 2;
        flex: 0 0 auto;
      }
      :host:not([vertical]) > io-tabs {
        margin: 0 var(--io-theme-spacing);
        margin-bottom: calc(-1.1 * var(--io-theme-border-width));
      }
      :host[vertical] > io-tabs {
        flex: 0 0 auto;
        margin: var(--io-theme-spacing) 0;
        margin-right: calc(-1.1 * var(--io-theme-border-width));
      }
      :host[vertical] > io-tabs > io-button,
      :host[vertical] > io-tabs > io-button.io-selected {
        align-self: flex-end;
        color: var(--io-theme-link-color);
        border: none;
        background: none;
        background-image: none !important;
      }
      :host[vertical] > io-tabs > io-button:hover {
        text-decoration: underline;
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
      collapseWidth: 500,
      vertical: {
        type: Boolean,
        reflect: true
      },
      collapsed: {
        type: Boolean,
        reflect: true
      },
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
  resized() {
    const rect = this.getBoundingClientRect();
    this.collapsed = this.vertical && rect.width < this.collapseWidth;
  }
  changed() {
    const _elements = this.elements.map(element => { return element[1].label; });
    const _filter = this.filter.length ? this.filter : _elements;

    if (_filter.indexOf(this.selected) == -1) {
      this.__properties.selected.value = _filter[0];
    }

    // TODO: consider testing with large element collections and optimizing.
    const options = [];
    for (let i = 0; i < _elements.length; i++) {
      const added = this.filter.indexOf(_elements[i]) !== -1;
      options.push({
        icon: added ? '⌦' : ' ',
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
        vertical: this.vertical,
        collapsed: this.collapsed,
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
    this.__properties.selected.value = tabID;
    this.$.tabs.resized();
    this.filter = [...this.filter];
  }
  _onRemoveTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    this.$.tabs.resized();
    this.filter = [...this.filter];
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
      }
      :host > * {
        flex: 0 0 auto;
        display: none;
      }
      :host:not([vertical]) > * {
        margin-right: var(--io-theme-spacing);
      }
      :host[vertical] > * {
        margin-bottom: var(--io-theme-spacing);
      }
      :host[vertical] > io-option {
        padding: calc(var(--io-theme-padding) * 9) var(--io-theme-padding);
      }
      :host[vertical] {
        flex-direction: column;
      }
      :host[vertical][collapsed] > io-option {
        display: inherit;
      }
      :host[vertical]:not([collapsed]) > :nth-child(n+3) {
        display: inherit;
      }
      :host:not([vertical])[overflow] > :nth-child(-n+2) {
        display: inherit;
      }
      :host:not([vertical]):not([overflow]) > :nth-child(n+3) {
        display: inherit;
      }
      :host:not([vertical])[overflow] > :nth-child(n+3) {
        display: inherit;
        visibility: hidden;
      }
      :host:not([vertical]) > * {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host:not([vertical]) > *.io-selected {
        border-bottom-color: var(--io-theme-content-bg);
        background-image: none;
      }
      :host[vertical] > * {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(270deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host[vertical] > *.io-selected {
        border-right-color: var(--io-theme-content-bg);
        background-image: none;
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
      vertical: {
        type: Boolean,
        reflect: true,
      },
      overflow: {
        type: Boolean,
        reflect: true,
      },
      collapsed: {
        type: Boolean,
        reflect: true
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
    this.overflow = (!this.vertical && this.collapsed) || rect.right < rectButton.right;
  }
  changed() {
    const buttons = [];
    const hamburger = ['io-option', {
      label: '☰',
      title: 'select tab menu',
      value: this.bind('selected'),
      options: this.tabs
    }];
    for (let i = 0; i < this.tabs.length; i++) {
      buttons.push(['io-button', {
        label: this.tabs[i],
        value: this.tabs[i],
        action: this.select,
        className: this.selected === this.tabs[i] ? 'io-selected' : ''
      }]);
    }
    this.template([hamburger, buttons[this.selected] || ['span'], ...buttons]);
  }
}

IoTabs.Register();
