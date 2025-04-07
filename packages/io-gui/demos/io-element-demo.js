import { Register, IoElement, div, IoStorage as $, ioText } from 'io-gui';
import { ioPropertyEditor } from 'io-editors';
import { ioInputBase, ioNumber, ioString, ioBoolean, ioSwitch } from 'io-inputs';
import { ioOptionMenu, MenuOptions, MenuItem } from 'io-menus';
import { ioSlider, ioSliderRange, ioSlider2d } from 'io-sliders';

// TODO: Implement IDs in menu options. use ID for selection
const options = new MenuOptions({
  last: $({key: 'element-demo', storage: 'local', value: ioInputBase()})
}).fromJSON([{
  label: 'io-inputs',
  options: [
    {value: ioInputBase(), label: `io-input-base`},
    {value: ioNumber(), label: `io-number`},
    {value: ioString(), label: `io-string`},
    {value: ioBoolean(), label: `io-boolean`},
    {value: ioSwitch(), label: `io-switch`},
  ]
}, {
  label: 'io-sliders',
  options: [
    {value: ioSlider(), label: `io-slider`},
    {value: ioSliderRange(), label: `io-slider-range`},
    {value: ioSlider2d(), label: `io-slider-2d`},
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
    :host io-property-editor > div.io-row {
      border-bottom: var(--io_border);
      padding: var(--io_spacing2) 0;
    }
    :host io-property-editor > div.io-row:last-child {
      border-bottom: none;
    }
    :host io-property-editor > div.io-row > io-text {
      width: 130px;
      text-align: right;
    }
    :host io-property-editor > div.io-row > io-number {
      min-width: 60px;
    }
    :host io-property-editor > div.io-row > io-string {
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
        ioPropertyEditor({$: 'properties'}),
        ioPropertyEditor({$: 'attributes', config: new Map([
          [Object, [
            [String, ioString({disabled: true})],
          ]]
        ])})
      ]);
      const element = this.querySelector('.element-wrap').children[0];
      
      const properties = this.$['properties'];
      properties.value = element;

      const attributes = {};
      for (let i = 0; i < element.attributes.length; i++) {
        attributes[element.attributes[i].name] = element.getAttribute(element.attributes[i].name);
      }
      this.$['attributes'].value = attributes;
    } else {
      this.template([
        ioText('Element property not set.'),
      ]);
    }
  }
}
Register(IoElementDemo);

export const ioElementDemo = IoElementDemo.vConstructor;
