import {Io, html} from "../../io/io.js"
import {UiTabSelector} from "./ui-tab-selector.js"
import {IoOption} from "../../io/io-option/io-option.js"

export class UiTabs extends Io {
  static get style() {
    return html`
      <style>
        :host  {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: #ffc;
        }
        :host > .ui-tabs-wrapper {
          border-bottom: 1px solid black;
          margin-top: 0.2em;
          white-space: nowrap;
        }
        :host > .ui-tabs-wrapper > io-option,
        :host > .ui-tabs-wrapper > ui-tab-selector {
          margin-left: 0.2em;
          padding: 0 0.5em 0 0.5em;
          border: 1px solid black;
          border-bottom: 0;
          background: #ddd;
        }
        :host > .ui-tabs-wrapper > ui-tab-selector[selected] {
          padding-bottom: 1px;
          margin-bottom: -1px;
        }
        :host > .ui-tab-content {
          background: #ddd;
          display: flex;
          flex: 1;
        }
        :host > .ui-tab-content > * {
          flex: 1;
        }
        :host > .ui-layout-drop-highlight {
          position: absolute;
          background: rgba(0, 0, 0, 0.25);
          width: 100%;
          height: 100%;
        }
        :host:not([dropzone]) > .ui-layout-drop-highlight {
          pointer-events: none;
          opacity: 0;
        }
        :host[dropzone=top] > .ui-layout-drop-highlight {
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=bottom] > .ui-layout-drop-highlight {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=left] > .ui-layout-drop-highlight {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
        :host[dropzone=right] > .ui-layout-drop-highlight {
          background: linear-gradient(to left, rgba(0, 0, 0, 0.5) 99.9px, transparent 100px);
        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: {
        type: Object,
        observer: 'update'
      },
      tabs: {
        type: Object,
        observer: 'update'
      },
      dropzone: {
        type: String,
        reflectToAttribute: true
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('ui-tab-drag-start', this._tabDragStartHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('ui-tab-drag-start', this._tabDragStartHandler);
  }
  _tabDragStartHandler(event) {
    this._rect = this.getBoundingClientRect();
    window.addEventListener('ui-tab-drag', this._tabDragHandler);
    window.addEventListener('ui-tab-drag-end', this._tabDragEndHandler);
  }
  _tabDragHandler(event) {
    let dx = event.detail.x;
    let dy = event.detail.y;
    let x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
    let y = 2 * (((dy - this._rect.y) / this._rect.height) - 0.5);
    if (Math.abs(y) < 1 && Math.abs(x) < 1) {
      if (Math.abs(y) < 0.5 && Math.abs(x) < 0.5) this.dropzone = 'center';
      else if (y < -Math.abs(x)) this.dropzone = 'top';
      else if (y > +Math.abs(x)) this.dropzone = 'bottom';
      else if (x < -Math.abs(y)) this.dropzone = 'left';
      else if (x > +Math.abs(y)) this.dropzone = 'right';
      else this.dropzone = 'center';
    } else {
      this.dropzone = ''
    }
  }
  _tabDragEndHandler(event) {
    window.removeEventListener('ui-tab-drag', this._tabDragHandler);
    window.removeEventListener('ui-tab-drag-end', this._tabDragEndHandler);
    if (this.dropzone) {
      if (this.dropzone === 'center' && event.detail.host !== this) {
        this.addTab(event.detail.tab);
        event.detail.host.removeTab(event.detail.tab);
      }
      this.dropzone = ''
    }
  }
  addTab(tab, index) {
    // TODO: implement indexed insertion on tab hover.
    let tabs = this.tabs.tabs.tabs;
    if (tabs.indexOf(tab) === -1) tabs.push(tab);
    this.fire('ui-tab-added', this.tabs);
    this._selectHandler(tab);
  }
  removeTab(tab) {
    let tabs = this.tabs.tabs.tabs;
    if (tabs.indexOf(tab) !== -1) tabs.splice(tabs.indexOf(tab), 1);
    let selected = this.tabs.tabs.selected || tabs[tabs.length - 1];
    if (selected === tab) selected = tabs[tabs.length - 1];
    this.fire('ui-tab-removed', this.tabs);
    this._selectHandler(selected);
  }
  _optionSelectHandler(tab) {
    this.addTab(tab);
  }
  _selectHandler(elem) {
    this.tabs.tabs.selected = elem;
    this.fire('ui-tab-selected', this.tabs);
    this.update();
  }
  update() {
    let tabs = this.tabs.tabs.tabs;
    let selected = this.tabs.tabs.selected || tabs[tabs.length - 1];
    const Elem = (entry) => ['ui-tab-selector', {
        value: entry,
        host: this,
        action: this._selectHandler,
        selected: entry === selected
      }, entry];
    this.render([
      ['div', {class: 'ui-tabs-wrapper'}, [
        tabs.map(Elem),
        ['io-option', {
          value: '+',
          options: Object.entries(this.elements).map((entry) => ({value: entry[0]})),
          action: this._optionSelectHandler
        }]
      ]],
      ['div', {class: 'ui-tab-content'}, [
        tabs.indexOf(selected) !== -1 ? this.elements[selected] : null
      ]],
      ['div', {class: 'ui-layout-drop-highlight'}]
    ]);
  }
}

window.customElements.define('ui-tabs', UiTabs);
