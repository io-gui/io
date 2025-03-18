import { Register } from '../../core/decorators/register.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/decorators/property.js';
import { IoColorPanelSingleton } from './io-color-panel.js';
import { IoOverlaySingleton } from '../../core/overlay.js';
import './io-color-swatch.js';

@Register
export class IoColorPicker extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        height: var(--io_fieldHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        border-radius: var(--io_borderRadius);
        overflow: hidden;
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
    IoOverlaySingleton.setElementPosition(IoColorPanelSingleton as unknown as HTMLElement, 'down', this.getBoundingClientRect());
    // hook up 'value-input' event dispatch
    IoColorPanelSingleton.addEventListener('value-input', this._onValueSet);
    IoColorPanelSingleton._targetValueSetHandler = this._onValueSet;
  }
  collapse() {
    IoColorPanelSingleton.removeEventListener('value-input', IoColorPanelSingleton._targetValueSetHandler);
    IoColorPanelSingleton.expanded = false;
  }
  changed() {
    this.template([['io-color-swatch', {$: 'swatch', value: this.value}]]);
  }
}
