import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import {filterObject} from "../utils/utility-functions.js";

export class IoSelectorTabs extends IoSelector {
  static get style() {
    return html`<style>
      :host {
        flex-direction: column;
        align-self: stretch;
      }
      :host > io-menu-options {
        border-radius: 0;
        border: none;
        font-size: 1.2em;
      }
      :host > .io-content {
        -webkit-overflow-scrolling: touch;
      }
    </style>`;
  }
  static get attributes() {
    return {
    };
  }
  static get properties() {
    return {
      options:  Array,
    };
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
    const tabs = ['io-menu-options', {
      id: 'tabs',
      role: 'navigation',
      horizontal: true,
      value: this.bind('selected'),
      options: this.options.length ? this.options : this.elements.map(element => { return element[1].name; }),
    }];
    this.template([tabs, ['div', {id: 'content', class: 'io-content', 'on-scroll': this._onScroll}]]);
  }
}

IoSelectorTabs.Register();
