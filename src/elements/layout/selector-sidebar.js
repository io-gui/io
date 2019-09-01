import {html} from "../../io.js";
import {IoSelector} from "./selector.js";
import "./sidebar.js";

export class IoSelectorSidebar extends IoSelector {
  static get Style() {
    return html`<style>
    :host {
      flex-direction: row-reverse;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
    }
    :host[left] {
      flex-direction: row;
    }
    :host[overflow] {
      flex-direction: column;
    }
    :host > io-sidebar {
      flex: 0 0 auto;
      background-color: var(--io-background-color-dark);
    }
    :host:not([overflow]) > io-sidebar {
      flex: 0 0 8em;
    }
    :host > .io-content {
      border: var(--io-border);
      border-width: 0 var(--io-border-width) 0 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
    :host[left] > .io-content {
      border-width: 0 0 0 var(--io-border-width);
    }
    :host[overflow] > .io-content {
      border-width: var(--io-border-width) 0 0 0;
    }
    </style>`;
  }
  static get Properties() {
    return {
      options: {
        type: Array,
        observe: true,
      },
      minWidth: 410,
      label: {
        reflect: 1,
      },
      overflow: {
        type: Boolean,
        reflect: 1,
      },
      left: {
        value: true,
        reflect: 1,
      },
    };
  }
  get _options() {
    return this.options.length ? this.options : this.elements.map(element => { return element[1].name; })
  }
  minWidthChanged() {
    this.onResized();
  }
  onResized() {
    this.overflow = this.getBoundingClientRect().width < this.minWidth;
  }
  leftChanged() { this.renderShadow(); }
  overflowChanged() { this.renderShadow(); }
  getSlotted() {
    return ['io-sidebar', {
      id: 'sidebar',
      role: 'navigation',
      elements: this.elements,
      selected: this.bind('selected'),
      options: this._options,
      overflow: this.overflow,
    }];
  }
}

IoSelectorSidebar.Register();
