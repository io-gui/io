import {html, IoElement} from "../core/element.js";
import "./element-selector.js";
import {IoTabs} from "./tabs.js";

export class IoTabbedElements extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
        position: relative;
      }
      :host > io-tabs {
        z-index: 1;
        margin: var(--io-spacing);
        margin-bottom: 0;
        flex-shrink: 0;
      }
      :host > io-element-selector {
        color: var(--io-color);
        background: var(--io-background-color);
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
        padding: var(--io-padding);
        border: var(--io-border);
        border-radius: var(--io-border-radius);
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      filter: null,
      selected: String,
      precache: false,
      cache: true,
      role: {
        reflect: false,
      },
    };
  }
  elementsChanged() {
    if (this.filter === null) {
      this.__properties.filter.value = this.elements.map(element => { return element[1].name; });
    }
  }
  selectedChanged() {
    if (this.filter.indexOf(this.selected) === -1) {
      this.selected = this.filter[0];
    }
  }
  changed() {
    this.template([
      ['io-tabs', {
        id: 'tabs',
        elements: this.elements,
        filter: this.filter,
        selected: this.bind('selected'),
      }],
      ['io-element-selector', {
        id: 'content',
        elements: this.elements,
        selected: this.selected,
        precache: this.precache,
        cache: this.cache,
        role: this.role,
      }],
    ]);
  }
}

IoTabbedElements.Register();
