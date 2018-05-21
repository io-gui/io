import {Io} from "../../../iocore.js";
import "./app-block-tab.js";
import "./app-block-tabs.js";

export class AppBlock extends Io {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
      }
      :host[droptarget="top"] {
        border-top: 4px dashed #4f6;
      }
      :host[droptarget="left"] {
        border-left: 4px dashed #4f6;
      }
      :host[droptarget="right"] {
        border-right: 4px dashed #4f6;
      }
      :host[droptarget="bottom"] {
        border-bottom: 4px dashed #4f6;
      }
      :host > :nth-child(2) {
        flex: 1;
      }
      :host[droptarget="this"] > :nth-child(2) {
        opacity: 0.25;
      }
      :host[droptarget="this"] > app-block-tabs {
        border-bottom: 4px dashed #4f6;
        margin-bottom: -4px;
      }
      :host app-block-tab[highlightdrop = "before"] {
        border-left: 4px dashed #4f6;
      }
      :host app-block-tab[highlightdrop = "after"] {
        border-right: 4px dashed #4f6;
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
  static get listeners() {
    return {
      'app-block-tabs-add': '_onAddTab',
      'app-block-tabs-remove': '_onRemoveTab',
      'app-block-tab-select': '_onTabSelect'
    }
  }
  update() {
    this.render([
      ['app-block-tabs', {id: 'tabs', elements: this.elements, tabs: this.tabs, selected: this.bind('selected')}],
      this.elements[this.tabs[this.selected]]
    ]);
  }

  _onAddTab(event) {
    if (this.tabs.indexOf(event.detail.tabID) !== -1) {
      this.tabs.splice(this.tabs.indexOf(event.detail.tabID), 1);
    }
    this.tabs.splice(event.detail.index, 0, event.detail.tabID);
    this.selected = this.tabs.indexOf(event.detail.tabID);
    this.fire('app-block-changed', {tabs: this.tabs, selected: this.selected});
    this.update();
  }
  _onRemoveTab(event) {
    let index = this.tabs.indexOf(event.detail.tabID);
    this.tabs.splice(index, 1);
    this.selected = Math.min(this.selected, this.tabs.length - 1);
    this.fire('app-block-changed', {tabs: this.tabs, selected: this.selected});
    this.update();
  }
  _onTabSelect(event) {
    this.selected = this.tabs.indexOf(event.detail.tabID);
    this.fire('app-block-changed', {tabs: this.tabs, selected: this.selected});
    this.update();
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('app-block-tab-drag-start', this._onTabDragStart);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('app-block-tab-drag-start', this._onTabDragStart);
    window.removeEventListener('app-block-tab-drag', this._onTabDrag);
    window.removeEventListener('app-block-tab-drag-end', this._onTabDragEnd);
  }
  _onTabDragStart() {
    window.addEventListener('app-block-tab-drag', this._onTabDrag);
    window.addEventListener('app-block-tab-drag-end', this._onTabDragEnd);
    this._rect = this.getBoundingClientRect();
    let tabs = this.querySelectorAll('app-block-tab');
    this._tabRects = [];
    for (let i = 0; i < tabs.length; i++) {
      this._tabRects.push(tabs[i].getBoundingClientRect());
    }
  }
  _onTabDrag(event) {
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
        // this.setDropTarget('top', tabID);
        // return;
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

    if (ay < 0.85 && ax < 0.85) {
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
  _onTabDragEnd(event) {
    window.removeEventListener('app-block-tab-drag', this._onTabDrag);
    window.removeEventListener('app-block-tab-drag-end', this._onTabDragEnd);
    let srcTab = event.detail.tab;
    let tabID = event.detail.tab.tabID;
    if (typeof this._droptarget === 'string') {
      srcTab.fire('app-block-tabs-remove', {tabID: tabID});
      this.parentElement.addSplit(tabID, this, this._droptarget);
    } else if (this._droptarget !== -1) {
      srcTab.fire('app-block-tabs-remove', {tabID: tabID});
      this.fire('app-block-tabs-add', {tabID: tabID, index: this._droptarget});
    }
    this.setDropTarget(-1, null);
  }
  setDropTarget(target) {
    if (typeof target === 'string' && this.parentElement.localName === 'app-split') {
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
