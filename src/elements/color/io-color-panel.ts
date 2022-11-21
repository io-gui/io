import { RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoLayerSingleton } from '../../core/layer.js';
import { IoColorBase } from './io-color-base.js';
import './io-color-sliders.js';

/**
 * Input element for color displayed as a set of sliders.
 *
 * <io-element-demo element="io-color-panel"
 * width= "192px"
 * height= "128px"
 * properties='{"mode": 0, "value": [1, 0.5, 0, 1], "horizontal": true}'
 * config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
 * '></io-element-demo>
 *
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
@RegisterIoElement
export class IoColorPanel extends IoColorBase {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      @apply --io-panel;
      cursor: move;
      align-items: stretch;
      flex-grow: 0;
      min-width: var(--io-line-height);
      min-height: calc(var(--io-line-height) * 5.5);
      flex-direction: row;
    }
    :host:not([expanded]) {
      display: none;
    }
    :host[vertical] {
      flex-direction: column;
    }
    :host > * {
      border-radius: calc(var(--io-border-radius) - var(--io-border-width));
    }
    :host > :first-child {
      flex: 1 0 auto;
    }
    :host > *:not(:first-child) {
      flex: 0 0 auto;
    }
    :host > *:not(:last-child) {
      margin: 0 0 var(--io-spacing) 0;
    }
    :host:not([vertical]) > * {
      margin: 0 var(--io-spacing) 0 0;
    }
    `;
  }

  @Property({value: false, reflect: 'prop'})
  declare expanded: boolean;

  @Property({value: false, reflect: 'prop'})
  declare vertical: boolean;

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
    // TODO: fix nudge
    // TODO: fix initial change with empty channel
    this.template([
      ['io-color-slider', {value: this.value, channel: 'sv', vertical: this.vertical, 'on-value-input': this.onValueSet}],
      ['io-color-slider', {value: this.value, channel: 'h', vertical: !this.vertical, 'on-value-input': this.onValueSet}],
      this.value.a !== undefined ?['io-color-slider', {value: this.value, channel: 'a', 'on-value-input': this.onValueSet, vertical: !this.vertical}] : null,
    ]);
  }
}

export const IoColorPanelSingleton = new IoColorPanel();
IoLayerSingleton.appendChild(IoColorPanelSingleton as unknown as HTMLElement);
