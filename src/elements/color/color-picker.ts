import { RegisterIoElement, IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoColorPanelSingleton } from './color-panel.js';
import { IoLayerSingleton } from '../../core/layer.js';
import './color-swatch.js';

@RegisterIoElement
export class IoColorPicker extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        height: var(--io-field-height);
        border: var(--io-border);
        border-radius: var(--io-border-radius);
        overflow: hidden;
      }
      :host:focus {
        outline: 1px solid var(--io-color-focus);
        border-color: var(--io-color-focus);
      }
    `;
  }

  @Property({value: {r: 1, g: 1, b: 1, a: 1}})
  declare value: {r: number, g: number, b: number, a?: number};

  static get Listeners(): any {
    return {
      'click': '_onClick',
      'keydown': '_onKeydown',
    };
  }

  @Property('0')
  declare tabindex: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onClick(event: FocusEvent) {
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
    IoColorPanelSingleton.value = this.value;
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
    this.template([['io-color-swatch', {id: 'swatch', value: this.value}]]);
  }
}
