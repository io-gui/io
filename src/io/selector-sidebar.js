import {html} from "./core/element.js";
import {IoSelector} from "./selector.js";
import "./sidebar.js";
import {filterObject} from "./core/utils.js";

export class IoSelectorSidebar extends IoSelector {
  static get Style() {
    return html`<style>
      :host {
        flex-direction: row-reverse;
        align-self: stretch;
        flex: 1 1 auto;
      }
      :host[left] {
        flex-direction: row;
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
        -webkit-overflow-scrolling: touch;
        border: var(--io-border);
        border-width: 0 var(--io-border-width) 0 0
      }
      :host[left] > .io-content {
        border-width: 0 0 0 var(--io-border-width);
      }
      :host[overflow] > .io-content {
        border-width: var(--io-border-width) 0 0 0;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'navigation',
      label: {
        type: String,
        notify: true,
      },
      overflow: {
        type: Boolean,
        notify: true,
      },
      left: {
        value: true,
      },
    };
  }
  static get Properties() {
    return {
      options: Array,
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
    this.template([tabs, ['div', {id: 'content', class: 'io-content', 'on-scroll': this._onScroll}]]);
  }
}

IoSelectorSidebar.Register();
