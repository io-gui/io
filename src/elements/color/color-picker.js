import {IoItem} from "../core/item.js";
import {IoLayerSingleton} from "../core/layer.js";
import {IoColorMixin} from "./color.js";
import "./color-swatch.js";
import {IoColorPanelSingleton} from "./color-panel.js";

export class IoColorPicker extends IoColorMixin(IoItem) {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      box-sizing: border-box;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-item-height);
      min-height: var(--io-item-height);
      padding: 0;
    }
    :host > io-color-swatch {
      border: 0;
      flex: 1 1 auto;
      align-self: stretch;
      min-width: 0;
      min-height: 0;
      border-radius: 0;
    }
    `;
  }
  static get Properties() {
    return {
      value: [0.5, 0.5, 0.5, 0.5],
      horizontal: false,
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Listeners() {
    return {
      'click': '_onClick',
      'keydown': '_onKeydown',
    };
  }
  _onClick() {
    event.preventDefault();
    this.focus();
    this.toggle();
  }
  get expanded() {
    return IoColorPanelSingleton.expanded && IoColorPanelSingleton.value === this.value;
  }
  _onKeydown(event) {
    const rect = this.getBoundingClientRect();
    const pRect = IoColorPanelSingleton.getBoundingClientRect();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
      if (this.expanded) IoColorPanelSingleton.firstChild.focus();
    } else if (this.expanded && pRect.top >= rect.bottom && event.key === 'ArrowDown') {
      event.preventDefault();
      IoColorPanelSingleton.firstChild.focus();
    } else if (this.expanded && pRect.bottom <= rect.top && event.key === 'ArrowUp') {
      event.preventDefault();
      IoColorPanelSingleton.firstChild.focus();
    } else {
      this.collapse();
      super._onKeydown(event);
    }
  }
  toggle() {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }
  expand() {
    const hasAlpha = this.alpha !== undefined;
    IoColorPanelSingleton.value = this.value;
    IoColorPanelSingleton.mode = this.mode;
    IoColorPanelSingleton.style.width = hasAlpha ? '192px' : '160px';
    IoColorPanelSingleton.style.height = '128px';
    IoColorPanelSingleton.expanded = true;
    IoLayerSingleton.setElementPosition(IoColorPanelSingleton, 'bottom', this.getBoundingClientRect());
  }
  collapse() {
    IoColorPanelSingleton.expanded = false;
  }
  changed() {
    this.template([['io-color-swatch', {value: this.value, mode: this.mode}]]);
  }
}

IoColorPicker.Register();
