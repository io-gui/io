import {html} from "./core/element.js";
import {IoSelector} from "./selector.js";
import {filterObject} from "./core/utils.js";

export class IoSelectorTabs extends IoSelector {
  static get Style() {
    return html`<style>
      :host {
        flex-direction: column;
        align-self: stretch;
        flex: 1 1 auto;
      }
      :host > io-menu-options {
        border-radius: 0;
        border: none;
        font-size: 1.2em;
        background-color: var(--io-background-color-dark);
      }
      :host > .io-content {
        -webkit-overflow-scrolling: touch;
        border: var(--io-border);
        border-width: var(--io-border-width) 0 0 0;
      }
    </style>`;
  }
  static get Attributes() {
    return {
    };
  }
  static get Properties() {
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
