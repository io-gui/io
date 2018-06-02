import {IoElement}from "../../../io-element.js";
import "./app-block-tab.js";
import "../../io/io-option/io-option.js";
import "../../io/io-button/io-button.js";

export class AppBlockTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        flex: none;
        display: flex;
        flex-direction: row;
        background: #bbb;
        line-height: 1em;
        overflow: hidden;
      }
      :host > app-block-tab {
        flex-grow: 0;
        flex-shrink: 1;
        cursor: pointer;
        padding: 0.2em 1.6em;
        border-right: 1px solid #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :host > app-block-tab[selected] {
        background: #ccc;
      }
      :host > io-button {
        line-height: 1em;
        display: inline-block;
        padding: 0.2em 0.4em;
        margin-left: -1.5em;
      }
      :host > io-option {
        display: inline-block;
        padding: 0.2em 0.6em;
      }

      :host > io-option,
      :host > io-button {
        color: transparent;
      }
      :host > io-option:hover,
      :host > io-button:hover {
        color: inherit;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Object,
      tabs: Array,
      selected: Number
    };
  }
  update() {
    let tabs = [];
    for (let i = 0; i < this.tabs.length; i++) {
      tabs.push(['app-block-tab', {
        element: this.elements[this.selected],
        tabID: this.tabs[i],
        selected: this.selected === i}]);
      tabs.push(['io-button', {
        label: '⨯',
        action: this._onRemove,
        value: i}]);
    }
    tabs.push(
      ['io-option', {
        value: '+',
        // TODO: optimize - this runs on resize etc.
        options: Object.entries(this.elements).map((entry) => ({value: entry[0]})),
        action: this._onAddTab
      }]
    );
    this.render([tabs]);
  }
  _onRemove(index) {
    this.dispatchEvent('app-block-tabs-remove', {tabID: this.tabs[index]});
  }
  _onAddTab(tabID) {
    this.dispatchEvent('app-block-tabs-add', {tabID: tabID, index: this.tabs.length});
  }
}

AppBlockTabs.Register();
