import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import "./sidebar.js";
import {filterObject} from "../utils/utility-functions.js";

export class IoSelectorSidebar extends IoSelector {
  static get style() {
    return html`<style>
      :host {
        flex-direction: row;
        align-self: stretch;
        flex: 1 1 auto;
      }
      :host[overflow] {
        flex-direction: column;
      }
      :host > io-sidebar {
        background-color: var(--io-background-color-dark);
      }
      :host:not([overflow]) > io-sidebar {
        flex: 0 0 8em;
      }
      :host > .io-content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        border: var(--io-border);
        border-width: 0 0 0 var(--io-border-width);
      }
      :host[overflow] > .io-content {
        border-width: var(--io-border-width) 0 0 0;
      }
    </style>`;
  }
  static get attributes() {
    return {
      role: 'navigation',
      label: {
        type: String,
        notify: true,
      },
      overflow: {
        type: Boolean,
        notify: true,
      }
    };
  }
  static get properties() {
    return {
      options: Array,
      left: true,
      minWidth: 410,
    };
  }
  _onScroll() {
    super._onScroll();
    if (this.$.sidebar.selected !== this.selected) {
      let hasOption = !!filterObject(this.options, (option) => {
        return option === this.selected || option.value === this.selected;
      });
      if (hasOption) this.$.sidebar.selected = this.selected;
    }
  }
  minWidthChanged() {
    this.resized();
  }
  resized() {
    this.overflow = this.getBoundingClientRect().width < this.minWidth;
  }
  leftChanged() { this.renderShadow(); }
  overflowChanged() { this.renderShadow(); }
  renderShadow() {
    const tabs = ['io-sidebar', {
      id: 'sidebar',
      elements: this.elements,
      selected: this.bind('selected'),
      options: this.options.length ? this.options : this.elements.map(element => { return element[1].name; }),
      overflow: this.overflow,
    }];
    if (this.left) {
      this.template([tabs, ['div', {id: 'content', class: 'io-content', 'on-scroll': this._onScroll}]]);
    } else {
      this.template([['div', {id: 'content', class: 'io-content', 'on-scroll': this._onScroll}], tabs]);
    }
  }
}

IoSelectorSidebar.Register();
