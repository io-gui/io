import {html} from "../core/element.js";
import {IoElementSelector} from "./element-selector.js";
import "./tabs.js";

export class IoElementSelectorTabs extends IoElementSelector {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
        position: relative;
      }
      :host > io-tabs {
        z-index: 1;
        margin: var(--io-spacing);
        margin-bottom: 0;
        flex-shrink: 0;
      }
      :host > .io-content {
        color: var(--io-color);
        background: var(--io-background-color);
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
        padding: var(--io-padding);
        border: var(--io-border);
        border-radius: var(--io-border-radius);
      }
    </style>`;
  }
  _onSelected(event) {
    this.set('selected', event.detail.value);
  }
  changed() {
    const element = this.elements.find(element => {return element[1].name === this.selected;});
    const tabs = ['io-tabs', {
      elements: this.elements,
      selected: this.selected,
      'on-selected-set': this._onSelected,
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

IoElementSelectorTabs.Register();
