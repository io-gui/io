import {Io, html} from "../../../iocore.js";
import "./app-block-tab.js";
import "../../io/io-option/io-option.js";
import "../../io/io-button/io-button.js";

export class AppBlockTabs extends Io {
  static get style() {
    return html`
      <style>
        :host {
          flex: none;
          display: flex;
          flex-direction: row;
          background: #bbb;
          line-height: 1em;
          white-space: nowrap;
        }
        :host > app-block-tab {
          cursor: pointer;
          padding: 0.2em 1.6em;
          border-right: 1px solid #999;
          background: #bbb;
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
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object
      },
      tabs: {
        type: Array
      },
      selected: {
        type: Number
      }
    };
  }
  update() {
    let tabs = [];
    for (let i = 0; i < this.tabs.length; i++) {
      tabs.push(['app-block-tab', {
        element: this.elements[this.selected],
        tabID: this.tabs[i],
        listeners: {'app-block-tab-select': this._tabSelectHandler},
        selected: this.selected === i}]);
      tabs.push(['io-button', {
        label: '⨯',
        action: this._deleteButtonHandler,
        value: i}]);
    }
    tabs.push(
      ['io-option', {
        value: '+',
        options: Object.entries(this.elements).map((entry) => ({value: entry[0]})),
        action: this._newTabSelectHandler
      }]
    );
    this.render([tabs]);
  }
  removeTab(tab) {
    let index = this.tabs.indexOf(tab);
    this.tabs.splice(index, 1);
    this.selected = Math.min(this.selected, this.tabs.length - 1);
    this.fire('app-block-updated', this);
    this.update();
  }
  addTab(tab, index) {
    if (this.tabs.indexOf(tab) !== -1) {
      this.tabs.splice(this.tabs.indexOf(tab), 1);
    }
    this.tabs.splice(index, 0, tab);
    this.selected = this.tabs.indexOf(tab);
    this.update();
    this.fire('app-block-updated', this);
  }
  _deleteButtonHandler(index) {
    this.removeTab(this.tabs[index]);
  }
  _tabSelectHandler(event) {
    this.selected = this.tabs.indexOf(event.detail.tab);
    this.fire('app-block-updated', this.tabs);
  }
  _newTabSelectHandler(tab) {
    this.addTab(tab, this.tabs.length);
  }
}

AppBlockTabs.Register();
