import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import "./sidebar.js";

export class IoSelectorSidebar extends IoSelector {
  static get style() {
    return html`<style>
      :host {
        flex-direction: row;
      }
      :host[overflow] {
        flex-direction: column;
      }
      :host > io-sidebar {
        z-index: 1;
        margin: var(--io-spacing);
        margin-bottom: 0;
        flex-shrink: 0;
      }
    </style>`;
  }
  static get properties() {
    return {
      options:  Array,
      left: true,
      minWidth: 320,
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
  resized() {
    this.overflow = this.getBoundingClientRect().width < this.minWidth;
  }
  changed() {
    this.overflow = this.getBoundingClientRect().width < this.minWidth;
    let element = this.elements.find(element => {return element[1].name === this.selected;});
    if (!element) element = ['div', {}];
    const tabs = ['io-sidebar', {
      elements: this.elements,
      selected: this.selected,
      options: this.options,
      overflow: this.overflow,
      'on-value-set': this._onSelected,
    }];
    // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
    this.innerText = '';
    const explicitlyCache = (typeof element[1] === 'object' && element[1].cache === true);
    const explicitlyDontCache = (typeof element[1] === 'object' && element[1].cache === false);
    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[this.selected]) {
      if (this.left || this.overflow) {
        this.template([tabs, ['div', {id: 'content', className: 'io-content'}]]);
      } else {
        this.template([['div', {id: 'content', className: 'io-content'}], tabs]);
      }
      this.$.content.appendChild(this._caches[this.selected]);
    } else {
      if (this.left || this.overflow) {
        this.template([tabs, ['div', {id: 'content', className: 'io-content'}, [element]]]);
      } else {
        this.template([['div', {id: 'content', className: 'io-content'}, [element]], tabs]);
      }
      this._caches[this.selected] = this.$.content.childNodes[0];
    }
  }
}

IoSelectorSidebar.Register();
