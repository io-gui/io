import { RegisterIoElement } from '../../core/element.js';
import {IoField} from '../basic/field.js';
import {IoLayerSingleton} from '../../core/layer.js';
import {IoColorMixin} from './color.js';
import './color-swatch.js';
import {IoColorPanelSingleton} from './color-panel.js';

/*
 * Extends `IoColorMixin(IoField)`.
 *
 * Implements `IoColorSwatch`, `IoColorPanelSingleton` and `IoLayerSingleton`.
 *
 * Input element for color picking. Expands a floating color panel when clicked or activated by keyboard.
 *
 * <io-element-demo element="io-color-picker"
 *   properties='{"value": [1, 0.5, 0, 1]}'
 *   config='{"value": ["io-color-vector"]}
 * '></io-element-demo>
 **/
@RegisterIoElement
export class IoColorPicker extends IoColorMixin(IoField) {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-field-height);
      min-height: var(--io-field-height);
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
  static get Properties(): any {
    return {
      value: [0.5, 0.5, 0.5, 0.5],
      horizontal: false,
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Listeners(): any {
    return {
      'click': '_onClick',
      'keydown': '_onKeydown',
    };
  }
  _onClick() {
    this.focus();
    this.toggle();
  }
  get expanded() {
    return IoColorPanelSingleton.expanded && IoColorPanelSingleton.value === this.value;
  }
  _onKeydown(event: KeyboardEvent) {
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
  _onValueSet() {
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, true);
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
    IoLayerSingleton.setElementPosition(IoColorPanelSingleton as unknown as HTMLElement, 'bottom', this.getBoundingClientRect());
    // hook up 'value-input' event dispatch
    IoColorPanelSingleton.addEventListener('value-input', this._onValueSet);
    IoColorPanelSingleton._targetValueSetHandler = this._onValueSet;
  }
  collapse() {
    IoColorPanelSingleton.removeEventListener('value-input', IoColorPanelSingleton._targetValueSetHandler);
    IoColorPanelSingleton.expanded = false;
  }
  changed() {
    this.template([['io-color-swatch', {value: this.value, mode: this.mode}]]);
  }
}
