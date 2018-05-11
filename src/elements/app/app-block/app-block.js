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
        :host[droptarget="top"] {
          border-top: 2px dashed #4f6;
        }
        :host[droptarget="left"] {
          border-left: 2px dashed #4f6;
        }
        :host[droptarget="right"] {
          border-right: 2px dashed #4f6;
        }
        :host[droptarget="bottom"] {
          border-bottom: 2px dashed #4f6;
        }
        :host[droptarget="this"] > :nth-child(2) {
          opacity: 0.25
        }
        :host[droptarget="this"] > app-block-tabs {
          border-bottom: 2px dashed #4f6;
          margin-bottom: -2px;
        }
        :host app-block-tab[highlightdrop = "before"] {
          margin-left: -1px;
          border-left: 2px dashed #4f6;
        }
        :host app-block-tab[highlightdrop = "after"] {
          border-right: 2px dashed #4f6;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      elements: Object,
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
    window.addEventListener('app-block-tab-drag', this._tabDragHandler);
    window.addEventListener('app-block-tab-drag-end', this._tabDragEndHandler);
    this._rect = this.getBoundingClientRect();
    let tabs = this.querySelectorAll('app-block-tab');
    this._tabRects = [];
    for (let i = 0; i < tabs.length; i++) {
      this._tabRects.push(tabs[i].getBoundingClientRect());
    }
  }
  _tabDragHandler(event) {
    let dx = event.detail.pointer.position.x;
    let dy = event.detail.pointer.position.y;
    let tabID = event.detail.tab.tabID;
    let x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
    let y = 2 * (((dy - this._rect.y) / this._rect.height) - 0.5);
    let ax = Math.abs(x);
    let ay = Math.abs(y);

    if (ay < 1 && ax < 1 && (ay > 0.9 || ax > 0.9)) {
      if (y < -ax) {
        // TODO: improve UX with tabs
        this.setDropTarget('top', tabID);
        return;
      } else if (y > +ax) {
        this.setDropTarget('bottom', tabID);
        return;
      } else if (x < -ay) {
        this.setDropTarget('left', tabID);
        return;
      } else if (x > +ay) {
        this.setDropTarget('right', tabID);
        return;
      }
    }

    if (ay < 0.75 && ax < 0.75) {
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
  _tabDragEndHandler(event) {
    window.removeEventListener('app-block-tab-drag', this._tabDragHandler);
    window.removeEventListener('app-block-tab-drag-end', this._tabDragEndHandler);
    let srcTabs = event.detail.tab.parentElement;
    let tabID = event.detail.tab.tabID;
    if (typeof this._droptarget === 'string') {
      let srcSplit = this;
      while (srcSplit.localName !== 'app-split' && srcSplit !== document) {
        srcSplit = srcSplit.parentElement;
      }
      srcTabs.removeTab(tabID);
      srcSplit.addSplit(tabID, this, this._droptarget);
      this.fire('app-block-changed');
    } else if (this._droptarget !== -1) {
      srcTabs.removeTab(tabID);
      this.$.tabs.addTab(tabID, this._droptarget);
      this.fire('app-block-changed');
    }
    this.setDropTarget(-1, null);
  }
  setDropTarget(target) {
    if (typeof target === 'string') {
      this.setAttribute('droptarget', target);
      this._droptarget = target;
    } else if (target !== -1) {
      this.setAttribute('droptarget', 'this');
      this._droptarget = target;
    } else {
      this._droptarget = -1;
      this.removeAttribute('droptarget');
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
}

AppBlock.Register();
