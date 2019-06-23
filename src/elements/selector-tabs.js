import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import "./tabs.js";
import {filterObject} from "../utils/utility-functions.js";

export class IoSelectorTabs extends IoSelector {
  static get style() {
    return html`<style>
      :host {
        flex-direction: column;
        align-self: stretch;
      }
      :host > io-tabs {
        z-index: 1;
        margin: var(--io-spacing);
        margin-bottom: 0;
        flex-shrink: 0;
      }
      :host > .io-content {
        -webkit-overflow-scrolling: touch;
      }
    </style>`;
  }
  static get properties() {
    return {
      options:  Array,
    };
  }
  _onSelected(event) {
    if (event.detail.property === 'selected') {
      this.set('selected', event.detail.value);
    }
  }
  _onScroll() {
    super._onScroll();
    if (this.$.tabs.selected !== this.selected) {
      let hasOption = !!filterObject(this.options, (property) => {
        return property === this.selected || property.value === this.selected;
      });
      if (hasOption) this.$.tabs.selected = this.selected;
    }
  }
  renderShadow() {
    const tabs = ['io-tabs', {
      id: 'tabs',
      elements: this.elements,
      selected: this.selected,
      options: this.options.length ? this.options : this.elements.map(element => { return element[1].name; }),
      'on-value-set': this._onSelected,
    }];
    this.template([tabs, ['div', {id: 'content', class: 'io-content', 'on-scroll': this._onScroll}]]);
  }
}

IoSelectorTabs.Register();
