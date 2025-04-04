import { Register, Property, IoOverlaySingleton } from 'io-gui';
import { IoColorBase } from './color-base.js';
import { ioColorSlider } from '../io-color-sliders.js';

/**
 * Input element for color displayed as a set of sliders.
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
@Register
class IoColorPanel extends IoColorBase {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: row;
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host:not([expanded]) {
      display: none;
    }
    :host > *:not(:last-child) {
      margin: 0 var(--io_spacing) 0 0;
    }
    `;
  }

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  static get Listeners() {
    return {
      'keydown': 'onKeydown',
    };
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.expanded = false;
    }
  }
  onValueInput() {
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, true);
  }
  changed() {
    // TODO: fix nudge
    // TODO: fix initial change with empty channel
    this.template([
      ioColorSlider({value: this.value, channel: 'sv', '@value-input': this.onValueInput}),
      ioColorSlider({value: this.value, channel: 'h', vertical: true, '@value-input': this.onValueInput}),
      this.value.a !== undefined ? ioColorSlider({value: this.value, channel: 'a', '@value-input': this.onValueInput, vertical: true}) : null,
    ]);
  }
}

export const IoColorPanelSingleton = new IoColorPanel();
IoOverlaySingleton.appendChild(IoColorPanelSingleton as unknown as HTMLElement);
