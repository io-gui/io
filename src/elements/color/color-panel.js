import {IoElement, RegisterIoElement} from '../../../srcj/components/io-element.js';
import {IoLayerSingleton} from '../core/layer.js';
import {IoColorMixin} from './color.js';

export class IoColorPanel extends IoColorMixin(IoElement) {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
      display: flex;
      cursor: move;
      align-items: stretch;
      min-width: var(--io-line-height);
      min-height: var(--io-line-height);
      flex-direction: column;
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
  static get Properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: 1,
      },
      horizontal: {
        value: true,
        reflect: 1,
      },
    };
  }
  static get Listeners() {
    return {
      'keydown': '_onKeydown',
    };
  }
  _onKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.expanded = false;
    }
  }
  changed() {
    this.template([
      this.mode === 2 ?
        ['io-color-slider-sl', {value: this.value, mode: this.mode}] :
        ['io-color-slider-sv', {value: this.value, mode: this.mode}],
      ['io-color-slider-hue', {value: this.value, mode: this.mode, horizontal: !this.horizontal}],
      this.alpha !== undefined ? ['io-color-slider-alpha', {value: this.value, horizontal: !this.horizontal}] : null,
    ]);
  }
}

RegisterIoElement(IoColorPanel);

export const IoColorPanelSingleton = new IoColorPanel();
IoLayerSingleton.appendChild(IoColorPanelSingleton);
