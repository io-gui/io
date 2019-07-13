import {html, IoElement} from "../io.js";
import "./selector.js";

const _dragicon = document.createElement('io-tab-dragicon');
const _dropzone = document.createElement('io-tab-dropzone');

function xyInRect(x, y, r) {
  return x > r.left && x < r.right && y < r.bottom && y > r.top;
}

const splitDirections = {
  '-2': 'up',
  '-3': 'right',
  '-4': 'down',
  '-5': 'left',
};

// TODO: Reconsider!
// NOTE: Editable io-selector-tabs cannot contain other editable io-selector-tabs or io-layout

export class IoSelectorTabs extends IoElement {
  static get Style() {
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
      :host > io-selector {
        color: var(--io-color);
        background: var(--io-background-color);
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        overflow: auto;
        padding: var(--io-spacing);
        border: var(--io-border);
        border-radius: var(--io-border-radius);
      }
    </style>`;
  }
  static get Properties() {
    return {
      elements: Array,
      filter: null,
      selected: String,
      precache: false,
      cache: true,
      editable: Boolean,
      role: {
        reflect: 0,
      },
    };
  }
  elementsChanged() {
    if (this.filter === null) {
      this.__properties.filter.value = this.elements.map(element => { return element[1].name; });
    }
  }
  editableChanged() {
    if (this.editable && this.__connected) this.connectDragListeners();
    else this.disconnectDragListeners();
  }
  selectedChanged() {
    if (this.filter.indexOf(this.selected) === -1) {
      this.selected = this.filter[0];
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.editable) this.connectDragListeners();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectDragListeners();
  }
  connectDragListeners() {
    if (!this.__listening) {
      window.addEventListener('io-layout-tab-drag', this._onDrag);
      window.addEventListener('io-layout-tab-drag-end', this._onDragEnd);
    }
    this.__listening = true;
  }
  disconnectDragListeners() {
    window.removeEventListener('io-layout-tab-drag', this._onDrag);
    window.removeEventListener('io-layout-tab-drag-end', this._onDragEnd);
    this.__listening = false;
  }
  _onDrag(event) {
    const x = event.detail.clientX;
    const y = event.detail.clientY;
    const rect = this.getBoundingClientRect();

    let index = -1;

    if (xyInRect(x, y, rect)) {

      const vX = 2 * (x - rect.x) / rect.width - 1;
      const vY = 2 * (y - rect.y) / rect.height - 1;

      const rectTabs = this.$.tabs.getBoundingClientRect();
      const rectContent = this.$.content.getBoundingClientRect();
      const isInLayout = this.parentNode.localName === 'io-layout';

      // TODO: unhack
      _dropzone.__hovered = true;

      index = this.filter.length;

      if (isInLayout && y < rect.top + 10) {
        index = -2;
        _dropzone.style.transform = 'translate3d(' + rect.left + 'px,' +  rect.top + 'px,0)';
        _dropzone.style.width = rect.width - 8 + 'px';
        _dropzone.style.height = '0px';
       } else if (xyInRect(x, y, rectTabs) || xyInRect(x, y - rectTabs.height, rectTabs)) {
        _dropzone.style.transform = 'translate3d(' + rectContent.left + 'px,' +  rectContent.top + 'px,0)';
        _dropzone.style.width = rectContent.width - 8 + 'px';
        _dropzone.style.height = rectContent.height - 8 + 'px';
        // Find exact tab index
        if (!this.$.tabs.overflow) {
          const tabButtons = this.$.tabs.querySelectorAll('.io-tab');
          for (let i = 0; i < tabButtons.length; i++) {
            const tabRect = tabButtons[i].getBoundingClientRect();
            if (x > tabRect.left - 5 && x < tabRect.right + 5) {
              index = x > tabRect.left + tabRect.width / 2 ? (i + 1) : i;
              continue;
            }
          }
        }
      } else if (isInLayout) {
        if (Math.abs(vX) < 0.5 && vY < 0.5) {
          index = this.filter.length;
          _dropzone.style.transform = 'translate3d(' + rectContent.left + 'px,' +  rectContent.top + 'px,0)';
          _dropzone.style.width = rectContent.width - 8 + 'px';
          _dropzone.style.height = rectContent.height - 8 + 'px';
        } else if (vX > Math.abs(vY)) {
          index = -3;
          _dropzone.style.transform = 'translate3d(' + (rect.right - 8) + 'px,' +  rect.top + 'px,0)';
          _dropzone.style.width = '0px';
          _dropzone.style.height = (rect.height - 8 ) + 'px';
        } else if (vX < -Math.abs(vY)) {
          index = -5;
          _dropzone.style.transform = 'translate3d(' + rect.left + 'px,' +  rect.top + 'px,0)';
          _dropzone.style.width = '0px';
          _dropzone.style.height = (rect.height - 8) + 'px';
        } else if (vY > Math.abs(vX)) {
          index = -4;
          _dropzone.style.transform = 'translate3d(' + rectContent.left + 'px,' +  (rectContent.bottom - 8) + 'px,0)';
          _dropzone.style.width = rectContent.width - 8 + 'px';
          _dropzone.style.height = '0px';
        }
      }
    }

    _dropzone.style.opacity = _dropzone.__hovered ? 1 : 0;
    this.$.tabs.dropIndex = index;
  }
  _onDragEnd(event) {
    const srcTabs = event.detail.source;
    const destTabs = this.$.tabs;
    const tab = event.detail.tab;
    const index = destTabs.dropIndex;
    if (index > -1) {
      destTabs.filter.splice(index, 0, tab);
      if (destTabs !== srcTabs) {
        for (let i = srcTabs.filter.length; i--;) {
          if (srcTabs.filter[i] === tab) {
            srcTabs.filter.splice(i, 1);
            srcTabs.selected = srcTabs.filter[srcTabs.filter.length - 1];
          }
        }
      }
      for (let i = destTabs.filter.length; i--;) {
        if (destTabs.filter[i] === tab && i !== index) {
          destTabs.filter.splice(i, 1);
        }
      }
      // TODO: clean up code
      destTabs.dropIndex = -1;
      setTimeout(()=>{
        destTabs.selected = tab;
        destTabs.querySelector('.io-selected-tab').focus();
      });
    } else if (index < -1) {
      this.dispatchEvent('io-layout-tab-insert', {
        source: srcTabs,
        destination: this,
        tab: tab,
        direction: splitDirections[index],
      }, true);
    }
  }
  changed() {
    this.template([
      ['io-tabs', {
        id: 'tabs',
        elements: this.elements,
        filter: this.filter,
        selected: this.bind('selected'),
        editable: this.editable,
      }],
      ['io-selector', {
        id: 'content',
        elements: this.elements,
        selected: this.selected,
        precache: this.precache,
        cache: this.cache,
        role: this.role,
      }],
    ]);
  }
}

IoSelectorTabs.Register();

export class IoTabs extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow: visible;
        flex: 0 1 auto;
        position: relative;
      }
      :host > * {
        flex: 0 0 auto;
        margin-right: var(--io-spacing);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
      }
      :host[overflow] > :nth-child(n+3):not(.edit-option) {
        /* visibility: hidden; */
        /* left: 0; */
        /* position: absolute; */
      }
      :host[editable] > io-button {
        touch-action: none;
      }
      :host > io-button:focus {
        border-style: solid;
        border-bottom: none;
      }
      :host > io-button.io-selected-tab {
        border-bottom-color: var(--io-background-color);
        border-bottom-style: solid;
        background: var(--io-background-color);
        color: var(--io-color-link);
        margin-bottom: -1px;
        background-image: none;
      }
      :host > io-button.io-tab-insert-before {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em),
                          linear-gradient(90deg, var(--io-color-focus) 0.3em, transparent 0.31em);
      }
      :host > io-button.io-tab-insert-after {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em),
                          linear-gradient(270deg, var(--io-color-focus) 0.3em, transparent 0.31em);
      }
      :host > io-button.io-selected-tab.io-tab-insert-before {
        background-image: linear-gradient(90deg, var(--io-color-focus) 0.3em, transparent 0.31em);
      }
      :host > io-button.io-selected-tab.io-tab-insert-after {
        background-image: linear-gradient(270deg, var(--io-color-focus) 0.3em, transparent 0.31em);
      }
      :host > io-option {
        background: none !important;
        border: none;
        padding-left: calc(3 * var(--io-spacing));
        padding-right: calc(3 * var(--io-spacing));
      }
      :host > .edit-spacer {
        flex: 0 0 3.5em;
        background: none;
      }
      :host > .edit-option {
        border: none;
        background: none;
        position: absolute;
        right: 0;
      }
      :host > .edit-option:not(:hover) {
        opacity: 0.3;
      }
    </style>`;
  }
  static get Properties() {
    return {
      elements: Array,
      filter: null,
      selected: String,
      editable: {
        type: Boolean,
        reflect: 1,
      },
      overflow: {
        type: Boolean,
        reflect: 1,
      },
      dropIndex: -1,
      role: 'navigation',
    };
  }
  select(id) {
    this.selected = id;
  }
  onResized() {
    let right = this.getBoundingClientRect().right;
    const lastButton = this.children[this.children.length - 2];
    if (this.overflow) {
      // const hamburgerButton = this.children[0];
      // const firstButton = this.children[1];
      // right += hamburgerButton.getBoundingClientRect().width + firstButton.getBoundingClientRect().width;
    }
    this.overflow = lastButton && right < lastButton.getBoundingClientRect().right;
  }
  _onAddTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    this.filter.push(tabID);
    this.selected = tabID;
    this.onResized();
    this.changed();
  }
  _onRemoveTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    if (this.filter.indexOf(this.selected) == -1) {
      this.selected = this.filter[0];
    }
    this.onResized();
    this.changed();
  }
  _onPointerdown(event) {
    event.target.setPointerCapture(event.pointerId);
    event.target.addEventListener('pointermove', this._onPointermove);
    event.target.addEventListener('pointerup', this._onPointerup);
    this._X = event.clientX;
    this._Y = event.clientY;
  }
  _onPointermove(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const dist = Math.sqrt(Math.pow(this._X - event.clientX, 2) + Math.pow(this._Y - event.clientY, 2));
    if (dist > 8) {
      const rect = event.target.getBoundingClientRect();
      const x = Math.min(event.clientX - rect.width / 2, window.innerWidth - rect.width);
      const y = Math.min(event.clientY - rect.height / 2, window.innerHeight- rect.height);
      if (_dragicon.parentNode !== document.body) {
        document.body.appendChild(_dragicon);
        _dragicon.innerText = event.target.label;
      }
      _dragicon.style.transform = 'translate3d(' + x + 'px,'+ y + 'px,0)';
      if (_dropzone.parentNode !== document.body) {
        document.body.appendChild(_dropzone);
        _dropzone.style.transform = 'translate3d(' + rect.left + 'px,' +  rect.top + 'px,0)';
        _dropzone.style.width = rect.width - 8 + 'px';
        _dropzone.style.height = rect.height - 8 + 'px';
        _dropzone.style.opacity = 0;
      }
      this.dispatchEvent('io-layout-tab-drag', {
        clientX: event.clientX,
        clientY: event.clientY,
        source: this,
        tab: event.target.label
      }, false, window);
      this.selected = event.target.label;
      event.target.focus();
    } else {
      if (_dragicon.parentNode === document.body) {
        document.body.removeChild(_dragicon);
      }
      if (_dropzone.parentNode === document.body) {
        _dropzone.style.width = '0px';
        _dropzone.style.height = '0px';
        _dropzone.style.opacity = 0;
        document.body.removeChild(_dropzone);
      }
    }
    // TODO: unhack
    _dropzone.__hovered = false;
  }
  _onPointerup(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.target.releasePointerCapture(event.pointerId);
    event.target.removeEventListener('pointermove', this._onPointermove);
    event.target.removeEventListener('pointerup', this._onPointerup);
    if (_dragicon.parentNode === document.body) document.body.removeChild(_dragicon);
    if (_dropzone.parentNode === document.body) document.body.removeChild(_dropzone);
    const dist = Math.sqrt(Math.pow(this._X - event.clientX, 2) + Math.pow(this._Y - event.clientY, 2));
    if (dist > 8) {
      this.dispatchEvent('io-layout-tab-drag-end', {
        clientX: event.clientX,
        clientY: event.clientY,
        source: this,
        tab: event.target.label,
      }, false, window);
    }
  }
  changed() {
    // TODO: consider testing with large element collections and optimizing.
    const options = [];
    const _elements = this.elements.map(element => { return element[1].name; });
    for (let i = 0; i < _elements.length; i++) {
      const added = this.filter && this.filter.indexOf(_elements[i]) !== -1;
      options.push({
        icon: added ? '⌦' : '·',
        value: _elements[i],
        action: added ? this._onRemoveTab : this._onAddTab, // TODO: make toggle on options
      });
    }
    const buttons = [];
    let selectedButton;
    // const currentIndex = this.filter.indexOf(this.selected);
    for (let i = 0; i < this.filter.length; i++) {
      const selected = this.selected === this.filter[i];
      let _class = 'io-tab';
      if (selected) _class += ' io-selected-tab';
      if (this.dropIndex !== -1) {// && this.dropIndex !== currentIndex && this.dropIndex !== currentIndex + 1) {
        if (this.dropIndex === i) _class += ' io-tab-insert-before';
        if (this.dropIndex === i + 1) _class += ' io-tab-insert-after';
      }
      const button = ['io-button', {
        label: this.filter[i],
        value: this.filter[i],
        action: this.select,
        class: _class,
      }];
      if (this.editable) button[1]['on-pointerdown'] = this._onPointerdown;
      if (selected) selectedButton = button;
      buttons.push(button);
    }
    const elements = [];
    if (this.overflow) {
      elements.push(['io-option', {
        label: '☰',
        title: 'select tab menu',
        value: this.bind('selected'),
        options: this.filter
      }]);
      if (selectedButton) {
        elements.push(selectedButton);
      }
    }
    elements.push(...buttons);

    if (this.editable) {
      elements.push(['div', {
        class: 'edit-spacer'
      }], ['io-option', {
        class: 'edit-option',
        label: '⚙️',
        options: options,
      }]);
    }

    this.template(elements);
  }
}

IoTabs.Register();

export class IoTabDragicon extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: inline-block;
        cursor: pointer;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        border: var(--io-outset-border);
        border-radius: var(--io-border-radius);
        padding: var(--io-spacing);
        padding-left: calc(3 * var(--io-spacing));
        padding-right: calc(3 * var(--io-spacing));
        background: var(--io-background-color);
        color: var(--io-color);
        transform: translateZ(0);
        position: absolute;
        top: 0;
        left: 0;
        z-index:2147483647;
      }
    </style>`;
  }
}

IoTabDragicon.Register();

export class IoTabDropzone extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        width: 100px;
        height: 100px;
        display: inline-block;
        pointer-events: none;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        border: 4px solid var(--io-color-focus);
        border-radius: var(--io-border-radius);
        transform: translateZ(0);
        position: fixed;
        top: 0;
        left: 0;
        z-index:2147483647;
        transition: opacity ease-in-out 0.3s,
                    transform ease-in-out 0.3s,
                    width ease-in-out 0.3s,
                    height ease-in-out 0.3s;
      }
    </style>`;
  }
}

IoTabDropzone.Register();
