import { IoElement, RegisterIoElement } from '../../core/element.js';
import {IoLayerSingleton} from '../../core/layer.js';
import {IoColorMixin} from './color-base.js';

@RegisterIoElement
export class IoColorPanel extends IoColorMixin(IoElement) {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
      @apply --io-column;
      cursor: move;
      align-items: stretch;
      min-width: var(--io-line-height);
      min-height: var(--io-line-height);
    }
    :host:not([expanded]) {
      display: none;
    }
    :host[horizontal] {
      flex-direction: row;
    }
    :host > * {
      border-radius: calc(var(--io-border-radius) - var(--io-border-width));
    }
    :host > io-color-slider-sl,
    :host > io-color-slider-sv {
      flex: 1 1;
    }
    :host > *:not(:last-child) {
      margin: 0 0 var(--io-spacing) 0;
    }
    :host[horizontal] > *:not(:last-child) {
      margin: 0 var(--io-spacing) 0 0;
    }
    `;
  }
  static get Properties(): any {
    return {
      expanded: {
        type: Boolean,
        reflect: 'prop',
      },
      horizontal: {
        value: true,
        reflect: 'prop',
      },
    };
  }
  static get Listeners() {
    return {
      'keydown': '_onKeydown',
    };
  }
  _onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.expanded = false;
    }
  }
  onValueSet() {
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, true);
  }
  changed() {
    this.template([
      this.mode === 2 ?
        ['io-color-slider-sl', {value: this.value, mode: this.mode, 'on-value-input': this.onValueSet}] :
        ['io-color-slider-sv', {value: this.value, mode: this.mode, 'on-value-input': this.onValueSet}],
      ['io-color-slider-hue', {value: this.value, mode: this.mode, 'on-value-input': this.onValueSet, vertical: this.horizontal}],
      this.alpha !== undefined ?['io-color-slider-alpha', {value: this.value, 'on-value-input': this.onValueSet, vertical: !this.horizontal}] : null,
    ]);
  }
}

export const IoColorPanelSingleton = new IoColorPanel();
IoLayerSingleton.appendChild(IoColorPanelSingleton as unknown as HTMLElement);
