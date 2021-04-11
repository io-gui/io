import {IoElement, RegisterIoElement} from '../../../srcj/components/io-element.js';
// import "./_layout-tab.js";
// import "./layout-tabs.js";

export class IoLayoutBlock extends IoElement {
  static get Style() {
    return /* css */`
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
    :host[droptarget="this"] > layout-tabs {
      border-bottom: 4px dashed #4f6;
      margin-bottom: -4px;
    }
    :host layout-tab[highlightdrop = "before"] {
      border-left: 4px dashed #4f6;
    }
    :host layout-tab[highlightdrop = "after"] {
      border-right: 4px dashed #4f6;
    }
    `;
  }
  static get Properties() {
    return {
      elements: Object,
      tabs: Array,
      selected: String
    };
  }
  static get Listeners() {
    return {
      'layout-tabs-add': '_onAddTab',
      'layout-tabs-remove': '_onRemoveTab',
      'layout-tab-select': '_onTabSelect'
    };
  }
  changed() {
    this.template([
      ['io-layout-tabs', {id: 'tabs', elements: this.elements, tabs: this.tabs, selected: this.bind('selected')}],
      this.elements[this.tabs[this.selected]]
    ]);
  }

  _onTabSelect(event) {
    this.selected = this.tabs.indexOf(event.detail.tabID);
    this.dispatchEvent('layout-changed', {tabs: this.tabs, selected: this.selected});
    this.changed();
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('layout-tab-drag-start', this._onTabDragStart);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('layout-tab-drag-start', this._onTabDragStart);
    window.removeEventListener('layout-tab-drag', this._onTabDrag);
    window.removeEventListener('layout-tab-drag-end', this._onTabDragEnd);
  }
  _onTabDragStart() {
    window.addEventListener('layout-tab-drag', this._onTabDrag);
    window.addEventListener('layout-tab-drag-end', this._onTabDragEnd);
    this._rect = this.getBoundingClientRect();
    let tabs = this.querySelectorAll('layout-tab');
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
    }
    for (let i = 0; i < this._tabRects.length; i++) {
      x = 2 * (((dx - this._tabRects[i].x) / this._tabRects[i].width) - 0.5);
      y = 2 * (((dy - this._tabRects[i].y) / this._tabRects[i].height) - 0.5);
      if (Math.abs(y) < 1 && Math.abs(x) < 1) {
        this.setDropTarget(i, tabID);
        return;
      }
    }
    {
      x = 2 * (((dx - this._rect.x) / this._rect.width) - 0.5);
      y = 2 * (((dy - this._rect.y) / 24) - 0.5);
      if (Math.abs(y) < 1 && Math.abs(x) < 1) {
        this.setDropTarget(this._tabRects.length, tabID);
        return;
      }
    }
    this.setDropTarget(-1,  null);
  }
  _onTabDragEnd(event) {
    window.removeEventListener('layout-tab-drag', this._onTabDrag);
    window.removeEventListener('layout-tab-drag-end', this._onTabDragEnd);
    let srcTab = event.detail.tab;
    let tabID = event.detail.tab.tabID;
    if (typeof this._droptarget === 'string') {
      srcTab.dispatchEvent('layout-tabs-remove', {tabID: tabID});
      this.parentElement.addSplit(tabID, this, this._droptarget);
    } else if (this._droptarget !== -1) {
      srcTab.dispatchEvent('layout-tabs-remove', {tabID: tabID});
      this.dispatchEvent('layout-tabs-add', {tabID: tabID, index: this._droptarget});
    }
    this.setDropTarget(-1, null);
  }
  setDropTarget(target) {
    if (typeof target === 'string' && this.parentElement.localName === 'layout') {
      this.setAttribute('droptarget', target);
      this._droptarget = target;
    } else if (target !== -1) {
      this.setAttribute('droptarget', 'this');
      this._droptarget = target;
    } else {
      this._droptarget = -1;
      this.removeAttribute('droptarget');
    }
    let tabs = this.$.tabs.querySelectorAll('layout-tab');
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

RegisterIoElement(IoLayoutBlock);
