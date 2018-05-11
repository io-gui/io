import {Io, html} from "../../../iocore.js";
import "./app-block-tab.js";
import "./app-block-tabs.js";

export class AppBlock extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: #ddd;
        }
        :host[isdroptarget] > :nth-child(2) {
          opacity: 0.25
        }
        :host app-block-tab[highlightdrop = "before"] {
          margin-left: -1px;
          border-left: 2px solid;
        }
        :host app-block-tab[highlightdrop = "after"] {
          border-right: 2px solid;
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
        type: Array,
        observer: '_update'
      },
      selected: {
        type: Number,
        observer: '_update'
      }
    };
  }
  _update() {
    this.render([
      ['app-block-tabs', {id: 'tabs', elements: this.elements, tabs: this.tabs, selected: this.bind('selected')}],
      this.elements[this.tabs[this.selected]]
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('app-block-tab-drag-start', this._tabDragStartHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('app-block-tab-drag-start', this._tabDragStartHandler);
    window.removeEventListener('app-block-tab-drag', this._tabDragHandler);
    window.removeEventListener('app-block-tab-drag-end', this._tabDragEndHandler);
  }
  _tabDragStartHandler() {
    this._rect = this.getBoundingClientRect();
    let tabs = this.querySelectorAll('app-block-tab');
    this._tabRects = [];
    for (let i = 0; i < tabs.length; i++) {
      this._tabRects.push(tabs[i].getBoundingClientRect());
    }
    window.addEventListener('app-block-tab-drag', this._tabDragHandler);
    window.addEventListener('app-block-tab-drag-end', this._tabDragEndHandler);
  }
  _tabDragHandler(event) {
    let dx = event.detail.pointer.position.x;
    let dy = event.detail.pointer.position.y;
    let tabID = event.detail.tab.tabID;
    let x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
    let y = 2 * (((dy - this._rect.y) / this._rect.height) - 0.5);
    if (Math.abs(y) < 0.5 && Math.abs(x) < 0.5) {
      this.setDropTarget(this.tabs.length, tabID);
      return;
    };
    for (let i = 0; i < this._tabRects.length; i++) {
      x = 2 * (((dx - this._tabRects[i].x) / this._tabRects[i].width) - 0.5);
      y = 2 * (((dy - this._tabRects[i].y) / this._tabRects[i].height) - 0.5);
      if (Math.abs(y) < 1 && Math.abs(x) < 1) {
        this.setDropTarget(i, tabID);
        return;
      };
    }
    {
      x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
      y = 2 * (((dy - this._rect.y) / 24) - 0.5);
      if (Math.abs(y) < 1 && Math.abs(x) < 1) {
        this.setDropTarget(this._tabRects.length, tabID);
        return;
      };
    }
    this.setDropTarget(-1,  null);
  }
  setDropTarget(index) {
    this._droptarget = index;
    if (this._droptarget !== -1) {
      this.setAttribute('isdroptarget', '');
    } else {
      this.removeAttribute('isdroptarget');
    }
    let tabs = this.$.tabs.querySelectorAll('app-block-tab');
    for (let i = 0; i < tabs.length; i++) {
      if (this._droptarget === i) {
        tabs[i].setAttribute('highlightdrop', 'before');
      } else {
        tabs[i].removeAttribute('highlightdrop');
      }
    }
    if (tabs.length && this._droptarget === tabs.length) {
      tabs[tabs.length - 1].setAttribute('highlightdrop', 'after');
    }
  }
  _tabDragEndHandler(event) {
    if (this._droptarget !== -1) {
      let parent = event.detail.tab.parentElement;
      parent.removeTab(event.detail.tab.tabID);
      this.$.tabs.addTab(event.detail.tab.tabID, this._droptarget);
    }
    this.setDropTarget(-1, null);
  }
}

AppBlock.Register();
