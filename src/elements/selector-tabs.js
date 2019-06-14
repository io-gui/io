import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import "./tabs.js";

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
  changed() {
    let element = this.elements.find(element => {return element[1].name === this.selected;});
    if (!element) element = ['div', {}];
    const tabs = ['io-tabs', {
      elements: this.elements,
      selected: this.selected,
      options: this.options.length ? this.options : this.elements.map(element => { return element[1].name; }),
      'on-value-set': this._onSelected,
    }];
    const explicitlyCache = (typeof element[1] === 'object' && element[1].cache === true);
    const explicitlyDontCache = (typeof element[1] === 'object' && element[1].cache === false);
    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[this.selected]) {
      // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
      if (this.$.content) this.$.content.innerText = '';
      this.template([tabs, ['div', {id: 'content', className: 'io-content'}]]);
      this.$.content.appendChild(this._caches[this.selected]);
    } else {
      this.template([tabs, ['div', {id: 'content', className: 'io-content'}, [element]]]);
      this._caches[this.selected] = this.$.content.childNodes[0];
    }
  }
}

IoSelectorTabs.Register();
