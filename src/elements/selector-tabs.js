import {html} from "../core/element.js";
import {IoSelector} from "./selector.js";
import "./tabs.js";

export class IoSelectorTabs extends IoSelector {
  static get style() {
    return html`<style>
      :host > io-tabs {
        z-index: 1;
        margin: var(--io-spacing);
        margin-bottom: 0;
        flex-shrink: 0;
      }
    </style>`;
  }
  _onSelected(event) {
    if (event.detail.property === 'selected') {
      this.set('selected', event.detail.value);
    }
  }
  changed() {
    let element = this.elements.find(element => {return element[1].name === this.selected;});
    if (!element) {
      this.selected = this.elements.length ? this.elements[0].name : '';
      return;
    }
    const tabs = ['io-tabs', {
      elements: this.elements,
      selected: this.selected,
      'on-value-set': this._onSelected,
    }];
    // NOTE: Cached elements shound't be removed with `template()` to avoid `dispose()`
    this.innerText = '';
    const explicitlyCache = (typeof element[1] === 'object' && element[1].cache === true);
    const explicitlyDontCache = (typeof element[1] === 'object' && element[1].cache === false);
    if (!explicitlyDontCache && (this.precache || this.cache || explicitlyCache) && this._caches[this.selected]) {
      this.template([tabs, ['div', {id: 'content', className: 'io-content'}]]);
      this.$.content.appendChild(this._caches[this.selected]);
    } else {
      this.template([tabs, ['div', {id: 'content', className: 'io-content'}, [element]]]);
      this._caches[this.selected] = this.$.content.childNodes[0];
    }
  }
}

IoSelectorTabs.Register();
