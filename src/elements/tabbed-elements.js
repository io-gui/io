import {html, IoElement} from "../core/element.js";
import "./element-cache.js";

const _dragIcon = document.createElement('div');
_dragIcon.style = `pointer-events: none; position: fixed; padding: 0.2em 1.6em; background: rgba(0,0,0,0.5); z-index:2147483647`;

export class IoTabbedElements extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
      }
      :host > io-tabs {
        z-index: 1;
        margin: 0 var(--io-theme-spacing);
        margin-bottom: calc(-1.1 * var(--io-theme-border-width));
      }
      :host > io-element-cache {
        flex: 1 1 auto;
        overflow: auto;
        padding: var(--io-theme-padding);
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        background: var(--io-theme-content-bg);
      }
      :host > io-tabs {
        flex-shrink: 0;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      filter: null,
      selected: String,
      precache: false,
      cache: true,
      editable: Boolean,
    };
  }
  changed() {
    this.template([
      ['io-tabs', {
        id: 'tabs',
        selected: this.bind('selected'),
        elements: this.elements,
        filter: this.filter,
        editable: this.editable,
        role: 'navigation',
      }],
      ['io-element-cache', {
        elements: this.elements,
        selected: this.selected,
        cache: this.cache,
        precache: this.precache,
        role: this.role,
      }],
    ]);
  }
}

IoTabbedElements.Register();

export class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow: hidden;
        flex: 0 1 auto;
        position: relative;
      }
      :host > * {
        flex: 0 0 auto;
        margin-right: var(--io-theme-spacing);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host > *.io-selected {
        border-bottom-color: var(--io-theme-content-bg);
        background-image: none;
      }
      :host[overflow] > :nth-child(n+3):not(.edit-option) {
        visibility: hidden;
      }
      :host > io-button {
        font-style: italic;
      }
      :host > io-button:focus {
        border: var(--io-theme-button-border);
        border-bottom-color: var(--io-theme-content-bg);
      }
      :host > io-button:not(.io-selected) {
        color: rgba(0, 0, 0, 0.5);
      }
      :host > io-button.io-selected {
        background: var(--io-theme-content-bg);
        font-weight: 600;
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
  static get properties() {
    return {
      elements: Array,
      filter: null,
      selected: String,
      editable: Boolean,
      overflow: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  select(id) {
    this.selected = id;
  }
  resized() {
    let right = this.getBoundingClientRect().right;
    const lastButton = this.children[this.children.length - 2];
    if (this.overflow) {
      const hamburgerButton = this.children[0];
      const firstButton = this.children[1];
      right += hamburgerButton.getBoundingClientRect().width + firstButton.getBoundingClientRect().width;
    }
    this.overflow = lastButton && right < lastButton.getBoundingClientRect().right;
  }
  _onAddTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    this.filter.push(tabID);
    this.selected = tabID;
    this.resized();
    this.changed();
  }
  _onRemoveTab(tabID) {
    if (this.filter.indexOf(tabID) !== -1) {
      this.filter.splice(this.filter.indexOf(tabID), 1);
    }
    if (this.filter.indexOf(this.selected) == -1) {
      this.selected = this.filter[0];
    }
    this.resized();
    this.changed();
    this.changed();
  }
  _onPointerdown(event) {
    // console.log(event);
    event.target.setPointerCapture(event.pointerId);
    event.target.addEventListener('pointermove', this._onPointermove);
    event.target.addEventListener('pointerup', this._onPointerup);
    event.preventDefault();
    event.stopPropagation();
    this._dragStartX = event.clientX;
    this._dragStartY = event.clientY;
  }
  _onPointermove(event) {
    event.target.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
    // console.log(event);

    let dist = Math.sqrt(
      Math.pow(this._dragStartX - event.clientX, 2) +
      Math.pow(this._dragStartY - event.clientY, 2)
    );
    if (dist > 8) {
      document.body.appendChild(_dragIcon);
      _dragIcon.innerText = event.target.label;
      _dragIcon.style.left = event.clientX - 12 + 'px';
      _dragIcon.style.top = event.clientY - 12 + 'px';
      //   this.dispatchEvent('layout-tab-drag', {pointer: pointer, tab: this});
    } else {
      if (_dragIcon.parentNode === document.body) document.body.removeChild(_dragIcon);
    }
  }
  _onPointerup(event) {
    // console.log(event);
    event.preventDefault();
    event.stopPropagation();
    event.target.releasePointerCapture(event.pointerId);
    event.target.removeEventListener('pointermove', this._onPointermove);
    event.target.removeEventListener('pointerup', this._onPointerup);
    if (_dragIcon.parentNode === document.body) document.body.removeChild(_dragIcon);

    let dist = Math.sqrt(
      Math.pow(this._dragStartX - event.clientX, 2) +
      Math.pow(this._dragStartY - event.clientY, 2)
    );
    if (dist > 8) {
      // this.dispatchEvent('layout-tab-drag-end', {tab: this});
    }
  }
  changed() {

    const _elements = this.elements.map(element => { return element[1].label; });
    const _filter = this.filter ? this.filter : _elements;

    // TODO: consider testing with large element collections and optimizing.
    const options = [];
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
    for (let i = 0; i < _filter.length; i++) {
      const selected = this.selected === _filter[i];
      const button = ['io-button', {
        label: _filter[i],
        value: _filter[i],
        action: this.select,
        className: selected ? 'io-selected' : '',
        'on-pointerdown': this._onPointerdown,
      }];
      if (selected) selectedButton = button;
      buttons.push(button);
    }
    const elements = [];
    if (this.overflow) {
      elements.push(['io-option', {
        label: '🍔',
        title: 'select tab menu',
        value: this.bind('selected'),
        options: _filter
      }]);
      if (selectedButton) {
        elements.push(selectedButton);
      }
    }
    elements.push(...buttons);

    if (this.editable) {
      elements.push(['div', {
        className: 'edit-spacer'
      }], ['io-option', {
        className: 'edit-option',
        label: '⚙️',
        options: options,
      }]);
    }

    this.template(elements);
  }
}

IoTabs.Register();
