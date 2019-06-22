import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import "./sidebar.js";

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
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      left: true,
      minWidth: 460,
      overflow: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  _onSelected(event) {
    if (event.detail.property === 'selected') {
      this.set('selected', event.detail.value);
    }
  }
  minWidthChanged() {
    this.resized();
  }
  resized() {
    this.overflow = this.getBoundingClientRect().width < this.minWidth;
  }
  renderShadow() {
    const tabs = ['io-sidebar', {
      elements: this.elements,
      selected: this.selected,
      options: this.options.length ? this.options : this.elements.map(element => { return element[1].name; }),
      overflow: this.overflow,
      'on-value-set': this._onSelected,
    }];
    if (this.left || this.overflow) {
      this.template([tabs, ['div', {id: 'content', className: 'io-content'}]]);
    } else {
      this.template([['div', {id: 'content', className: 'io-content'}], tabs]);
    }
  }
}

IoSelectorSidebar.Register();
