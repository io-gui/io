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
      }
      :host[overflow] {
        flex-direction: column;
      }
      :host:not([overflow]) > io-sidebar {
        flex: 0 0 8em;
      }
      :host > .io-content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      left: true,
      minWidth: 410,
      overflow: {
        type: Boolean,
        reflect: 1,
      },
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
