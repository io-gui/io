import { Register, Property, IoElement, IoOverlaySingleton, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
import { IoColorPanelSingleton as Panel } from './elements/color-panel-singleton.js';
import { ioColorSwatch } from './io-color-swatch.js';

export type IoColorPickerArgs = IoElementArgs & ArgsWithBinding<{
  value?: {
    r: number;
    g: number;
    b: number;
    a?: number;
  }
}>;

@Register
export class IoColorPicker extends IoElement {
  static vConstructor: (arg0?: IoColorPickerArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
      'click': 'onClick',
      'keydown': 'onKeydown',
    };
  }

  @Property({value: '0', type: String, reflect: true})
  declare tabindex: string;

  onClick() {
    this.toggle();
  }
  get expanded() {
    return Panel.expanded && Panel.value === this.value;
  }
  onKeydown(event: KeyboardEvent) {
    const rect = this.getBoundingClientRect();
    const pRect = Panel.getBoundingClientRect();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
      if (this.expanded) Panel.firstChild.focus();
    } else if (this.expanded && pRect.top >= rect.bottom && event.key === 'ArrowDown') {
      event.preventDefault();
      Panel.firstChild.focus();
    } else if (this.expanded && pRect.bottom <= rect.top && event.key === 'ArrowUp') {
      event.preventDefault();
      Panel.firstChild.focus();
    } else {
      this.collapse();
      // TODO: inherit from input-base
      // super.onKeydown(event);
    }
  }
  onValueSet() {
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, true);
  }
  toggle() {
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }
  onPanelCollapse() {
    Panel.removeEventListener('value-input', this.onValueSet);
    Panel.removeEventListener('expanded-changed', this.onPanelCollapse);
  }
  expand() {
    Panel.value = this.value;
    Panel.expanded = true;
    Panel.addEventListener('value-input', this.onValueSet);
    Panel.addEventListener('expanded-changed', this.onPanelCollapse);
    IoOverlaySingleton.setElementPosition(Panel as unknown as HTMLElement, 'down', this.getBoundingClientRect());
  }
  collapse() {
    Panel.expanded = false;
    Panel.value = {r: 1, g: 1, b: 1, a: 1};
  }
  valueChanged() {
    this.template([
      ioColorSwatch({value: this.value})
    ]);
  }
}
export const ioColorPicker = IoColorPicker.vConstructor;
