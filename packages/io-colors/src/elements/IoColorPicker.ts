import { Register, ReactiveProperty, IoElement, IoElementProps, VDOMElement, Property, WithBinding, nudge } from 'io-gui';
import { IoColorPanelSingleton as Panel } from './IoColorPanelSingleton.js';
import { ioColorSwatch } from './IoColorSwatch.js';

// TODO: focus picker on expand.
// TODO: collapse picker on blur.
// TODO: fix focus keybord navigation.

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
        @apply --io_focus;
      }
      :host > io-color-swatch {
        width: 100%;
        height: 100%;
      }
    `;
  }

  @ReactiveProperty({value: {r: 1, g: 1, b: 1, a: 1}})
  declare value: {r: number, g: number, b: number, a?: number};

  static get Listeners(): any {
    return {
      'click': 'onClick',
      'keydown': 'onKeydown',
    };
  }

  @Property(0)
  declare tabIndex: number;

  get expanded() {
    return Panel.expanded && Panel.value === this.value;
  }

  ready() {
    this.valueChanged();
  }

  onClick() {
    if (!this.expanded) this.expand();
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.expanded) this.expand();
        break;
      default:
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
          event.preventDefault();
          this.dispatch('io-focus-to', {source: this, command: event.key}, true);
        }
    }
  }
  onValueSet() {
    this.dispatch('value-input', {property: 'value', value: this.value}, true);
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
    nudge(Panel, this, 'right');
    (Panel.firstChild?.firstChild as HTMLElement)?.focus();
  }
  collapse() {
    Panel.expanded = false;
    Panel.value = {r: 1, g: 1, b: 1, a: 1};
  }
  valueChanged() {
    this.render([
      ioColorSwatch({value: this.value})
    ]);
  }
}
export const ioColorPicker = IoColorPicker.vConstructor;
