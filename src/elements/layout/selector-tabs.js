import {html} from "../../io.js";
import {IoSelector} from "./selector.js";
// TODO: remove io-menu-options dependency.

export function filterObject(object, predicate) {
  if (predicate(object)) return object;
  for (let key in object) {
    if (predicate(object[key])) {
        return object[key];
    } else if (typeof object[key] === 'object') {
      const prop = filterObject(object[key], predicate);
      if (prop) return prop;
    }
  }
}

export class IoSelectorTabs extends IoSelector {
  static get Style() {
    return html`<style>
      :host {
        flex-direction: column;
        align-self: stretch;
        justify-self: stretch;
        flex: 1 1 auto;
      }
      :host > io-menu-options {
        flex: 0 0 auto;
        border: none;
        border-radius: 0;
        background-color: var(--io-background-color-dark);
      }
      :host > .io-content {
        border: var(--io-border);
        border-width: var(--io-border-width) 0 0 0;
      }
    </style>`;
  }
  static get Properties() {
    return {
      options:  Array,
      slotted: Array,
    };
  }
  _onValueSet(event) {
    this.set('selected', event.detail.value.toLowerCase());
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
    const tabs = [
      ['io-menu-options', {
        id: 'tabs',
        role: 'navigation',
        horizontal: true,
        value: this.selected,
        options: this.options.length ? this.options : this.elements.map(element => { return element[1].name; }),
        slotted: this.slotted,
        selectable: true,
        'on-value-set': this._onValueSet,
      }],
    ];
    this.template([tabs, ['div', {id: 'content', class: 'io-content'}]]);
  }
}

IoSelectorTabs.Register();
