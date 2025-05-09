import { Register, IoElement, div, Storage as $, span } from 'io-gui';
import { ioInspector } from 'io-editors';
import { ioNumber, ioString, ioBoolean, ioSwitch, ioButton } from 'io-inputs';
import { ioSlider, ioSliderRange, ioSlider2d, ioNumberSlider, ioNumberSliderRange } from 'io-sliders';
import { ioIcon } from 'io-icons';
import { ioOptionMenu, MenuOptions } from 'io-menus';
import { ioColorRgba, ioColorSlider, ioColorSwatch, ioColorPicker } from 'io-colors';

// TODO: Implement IDs in menu options. use ID for selection
const options = new MenuOptions({
  last: $({key: 'element-demo', storage: 'local', value: ioSlider()})
}).fromJSON([{
  label: 'native',
  options: [
    {value: div('div content'), label: 'div'},
  ]
}, {
  label: 'io-icons',
  options: [
    {value: ioIcon({value: 'io:check'}), label: 'io-icon:check'},
    {value: ioIcon({value: 'io:close'}), label: 'io-icon:close'},
    {value: ioIcon({value: 'io:circle'}), label: 'io-icon:circle'},
  ]
}, {
  label: 'io-inputs',
  options: [
    {value: ioBoolean(), label: 'io-boolean'},
    {value: ioButton({label: 'Button'}), label: 'io-button'},
    {value: ioNumber(), label: 'io-number'},
    {value: ioString(), label: 'io-string'},
    {value: ioSwitch(), label: 'io-switch'},
  ]
}, {
  label: 'io-sliders',
  options: [
    {value: ioNumberSlider(), label: 'io-number-slider'},
    {value: ioNumberSliderRange(), label: 'io-number-slider-range'},
    {value: ioSlider(), label: 'io-slider'},
    {value: ioSlider2d(), label: 'io-slider-2d'},
    {value: ioSliderRange(), label: 'io-slider-range'},
  ]
}, {
  label: 'io-colors',
  options: [
    {value: ioColorRgba(), label: 'io-color-rgba'},
    {value: ioColorSlider({channel: 'r'}), label: 'io-color-slider:r'},
    {value: ioColorSlider({channel: 'g'}), label: 'io-color-slider:g'},
    {value: ioColorSlider({channel: 'b'}), label: 'io-color-slider:b'},
    {value: ioColorSlider({channel: 'sv'}), label: 'io-color-slider:sv'},
    {value: ioColorSwatch(), label: 'io-color-swatch'},
    {value: ioColorPicker(), label: 'io-color-picker'},
  ]
}]);

export class IoElementDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 1 auto;
      min-width: 450px;
      flex-direction: column;
      align-self: flex-start;
      background-color: var(--io_bgColorStrong);
      padding: var(--io_spacing3);
    }
    :host > .element-wrap {
      border: var(--io_border);
      border-color: var(--io_borderColorDark);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing3);
    }
    :host > io-property-editor {
      border: var(--io_border);
      border-color: var(--io_borderColorDark);
      background-color: var(--io_bgColorDimmed);
      border-top: none;
      padding: 0 var(--io_spacing2);
    }
    :host io-property-editor > div.row {
      border-bottom: var(--io_border);
      padding: var(--io_spacing2) 0;
    }
    :host io-property-editor > div.row:last-child {
      border-bottom: none;
    }
    :host io-property-editor > div.row > span {
      width: 130px;
      text-align: right;
    }
    :host io-property-editor > div.row > io-number {
      min-width: 60px;
    }
    :host io-property-editor > div.row > io-string {
      min-width: 120px;
    }
    `;
  }
  static get Properties() {
    return {
      element: options.bind('last'),
      reactivity: 'debounced'
    };
  }
  init() {
    this.changed();
  }
  optionsMutated() {
    this.changed();
  }
  elementMutated() {
    this.changed();
  }
  changed() {
    if (this.element) {
      this.template([
        ioOptionMenu({
          value: this.bind('element'),
          options: options
        }),
        div({class: 'element-wrap'}, [
          this.element
        ]),
        ioInspector({id: 'inspector'}),
      ]);
      const element = this.querySelector('.element-wrap').children[0];
      const inspector = this.$['inspector'];
      if (inspector.value !== element) {
        inspector.value = element;
      }
    } else {
      this.template([
        span('Element property not set.'),
      ]);
    }
  }
}
Register(IoElementDemo);

export const ioElementDemo = IoElementDemo.vConstructor;
