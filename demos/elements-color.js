import {IoElement, RegisterIoElement} from '../build/iogui.js';
import {Options, Item} from '../build/iogui.js';

export class IoDemoElementsColor extends IoElement {
  static get Style() {
    return /* css */`
      :host > .io-table2 {
        grid-template-columns: auto 1fr !important;
      }
      :host io-color-panel,
      :host .vertical-sliders > * {
        height: 5em;
      }
      :host .sliders-2d {
        flex: 1 1;
      }
    `;
  }
  static get Properties() {
    return {
      mode: 0,
      vector3: [0, 1, 2],
      vector4: [0, 1, 2, 3],
      color: [1, 1, 1, 1],
      rgba: { value: {'r': 1, 'g': 0.5, 'b': 0, 'a': 1}},
      cmyk: { value: {'c': 0, 'm': 0, 'y': 0, 'k': 0}},
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', {class: 'io-table2 table'}, [
        ['io-field', {label: 'vector3'}], ['io-color-vector', {mode: this.bind('mode'), value: this.vector3}],
        ['io-field', {label: 'vector4'}], ['io-color-vector', {mode: this.bind('mode'), value: this.vector4}],
        ['io-field', {label: 'mode: rgba'}], ['io-color-vector', {mode: 0, value: this.color}],
        ['io-field', {label: 'mode: hsva'}], ['io-color-vector', {mode: 1, value: this.color}],
        ['io-field', {label: 'mode: hsla'}], ['io-color-vector', {mode: 2, value: this.color}],
        ['io-field', {label: 'mode: cmyka'}], ['io-color-vector', {mode: 3, value: this.color}],
        ['io-field', {label: 'Mode'}],
        ['io-option-menu', {value: this.bind('mode'), options: new Options([
          new Item({label: 'rgb', value: 0}),
          new Item({label: 'hsv', value: 1}),
          new Item({label: 'hsl', value: 2}),
          new Item({label: 'cmyk', value: 3}),
        ])}],
        ['io-field', {label: 'io-color-panel'}],
        ['io-color-panel', {expanded: true, value: this.color, mode: this.bind('mode'), class: 'color-slider'}],
        ['io-field', {label: 'red'}], ['io-color-slider-red', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'green'}], ['io-color-slider-green', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'blue'}], ['io-color-slider-blue', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'hue'}], ['io-color-slider-hue', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'saturation'}], ['io-color-slider-saturation', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'value'}], ['io-color-slider-value', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'level'}], ['io-color-slider-level', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'cyan'}], ['io-color-slider-cyan', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'magenta'}], ['io-color-slider-magenta', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'yellow'}], ['io-color-slider-yellow', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'key'}], ['io-color-slider-key', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: 'alpha'}], ['io-color-slider-alpha', {value: this.color, mode: this.bind('mode')}],
        ['io-field', {label: '2D & Vertical'}],
        ['div', {class: 'io-row vertical-sliders'}, [
          ['io-color-slider-hs', {value: this.color, mode: this.bind('mode'), class: 'sliders-2d'}],
          ['io-color-slider-sv', {value: this.color, mode: this.bind('mode'), class: 'sliders-2d'}],
          ['io-color-slider-sl', {value: this.color, mode: this.bind('mode'), class: 'sliders-2d'}],
          ['io-color-slider-red', {value: this.color, mode: this.bind('mode'), horizontal: false}],
          ['io-color-slider-green', {value: this.color, mode: this.bind('mode'), horizontal: false}],
          ['io-color-slider-blue', {value: this.color, mode: this.bind('mode'), horizontal: false}],
          ['io-color-slider-alpha', {value: this.color, mode: this.bind('mode'), horizontal: false}],
        ]],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsColor);
