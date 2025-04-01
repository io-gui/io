import { Register, Property, IoOverlaySingleton } from 'io-gui';
import { IoColorBase } from './io-color-base.js';
import { ioColorSlider } from './io-color-sliders.js';

/**
 * Input element for color displayed as a set of sliders.
 *
 * <io-element-demo element="io-color-panel"
 * width= "192px"
 * height= "128px"
 * properties='{"mode": 0, "value": [1, 0.5, 0, 1], "horizontal": true}'
 * config='{"value": ["io-property-editor"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}]}]}
 * '></io-element-demo>
 *
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
@Register
export class IoColorPanel extends IoColorBase {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      /* Panel */
      flex: 1 1 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      color: var(--io_colorField);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing);
      /*  */
      cursor: move;
      align-items: stretch;
      flex-grow: 0;
      min-width: var(--io_lineHeight);
      min-height: calc(var(--io_lineHeight) * 5.5);
      flex-direction: row;
    }
    :host:not([expanded]) {
      display: none;
    }
    :host[vertical] {
      flex-direction: column;
    }
    :host > * {
      border-radius: calc(var(--io_borderRadius) - var(--io_borderWidth));
    }
    :host > :first-child {
      flex: 1 0 auto;
    }
    :host > *:not(:first-child) {
      flex: 0 0 auto;
    }
    :host > *:not(:last-child) {
      margin: 0 0 var(--io_spacing) 0;
    }
    :host:not([vertical]) > * {
      margin: 0 var(--io_spacing) 0 0;
    }
    `;
  }

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property({value: false, reflect: true})
  declare vertical: boolean;

  @Property({value: false, reflect: true})
  declare inlayer: boolean;

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
      ioColorSlider({value: this.value, channel: 'sv', vertical: this.vertical, '@value-input': this.onValueSet}),
      ioColorSlider({value: this.value, channel: 'h', vertical: !this.vertical, '@value-input': this.onValueSet}),
      this.value.a !== undefined ? ioColorSlider({value: this.value, channel: 'a', '@value-input': this.onValueSet, vertical: !this.vertical}) : null,
    ]);
  }
}

export const IoColorPanelSingleton = new IoColorPanel({inlayer: true});
IoOverlaySingleton.appendChild(IoColorPanelSingleton as unknown as HTMLElement);
