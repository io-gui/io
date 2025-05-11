import { Register, Property, IoElement, IoOverlaySingleton, IoElementProps, VDOMElement, Default, WithBinding } from 'io-gui';
import { IoColorPanelSingleton as Panel } from './IoColorPanelSingleton';
import { ioColorSwatch } from './IoColorSwatch';

export type IoColorPickerProps = IoElementProps &{
  value?: WithBinding<{ r: number, g: number, b: number, a?: number }>,
};

@Register
export class IoColorPicker extends IoElement {
  static vConstructor: (arg0?: IoColorPickerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        height: var(--io_fieldHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        border-radius: var(--io_borderRadius);
        overflow: hidden;
      }
      :host:focus {
        border-color: var(--io_colorBlue);
        outline: 1px auto var(--io_colorBlue);
      }
      :host > io-color-swatch {
        width: 100%;
        height: 100%;
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

  @Default('0')
  declare tabIndex: string;

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
  init() {
    this.valueChanged();
  }
  valueChanged() {
    this.template([
      ioColorSwatch({value: this.value})
    ]);
  }
}
export const ioColorPicker = IoColorPicker.vConstructor;
