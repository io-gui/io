import {IoElement} from '../build/iogui.js';
import '../build/iogui.js';

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
        ['io-item', {label: 'vector3'}], ['io-color-vector', {mode: this.bind('mode'), value: this.vector3}],
        ['io-item', {label: 'vector4'}], ['io-color-vector', {mode: this.bind('mode'), value: this.vector4}],
        ['io-item', {label: 'Mode'}],
        ['io-option-menu', {value: this.bind('mode'), options: [
          {label: 'rgb', value: 0},
          {label: 'hsv', value: 1},
          {label: 'hsl', value: 2},
          {label: 'cmyk', value: 3},
        ]}],
        ['io-item', {label: 'io-color-panel'}],
        ['io-color-panel', {expanded: true, value: this.color, mode: this.bind('mode'), class: 'color-slider'}],
        ['io-item', {label: 'red'}], ['io-color-slider-red', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'green'}], ['io-color-slider-green', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'blue'}], ['io-color-slider-blue', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'hue'}], ['io-color-slider-hue', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'saturation'}], ['io-color-slider-saturation', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'value'}], ['io-color-slider-value', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'level'}], ['io-color-slider-level', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'cyan'}], ['io-color-slider-cyan', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'magenta'}], ['io-color-slider-magenta', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'yellow'}], ['io-color-slider-yellow', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'key'}], ['io-color-slider-key', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: 'alpha'}], ['io-color-slider-alpha', {value: this.color, mode: this.bind('mode')}],
        ['io-item', {label: '2D & Vertical'}],
        ['div', {class: 'io-row vertical-sliders'}, [
          ['io-color-slider-hs', {value: this.color, mode: this.bind('mode'), class: 'sliders-2d'}],
          ['io-color-slider-sv', {value: this.color, mode: this.bind('mode'), class: 'sliders-2d'}],
          ['io-color-slider-sl', {value: this.color, mode: this.bind('mode'), class: 'sliders-2d'}],
          ['io-color-slider-red', {value: this.color, mode: this.bind('mode'), horizontal: false}],
          ['io-color-slider-green', {value: this.color, mode: this.bind('mode'), horizontal: false}],
          ['io-color-slider-blue', {value: this.color, mode: this.bind('mode'), horizontal: false}],
          ['io-color-slider-alpha', {value: this.color, mode: this.bind('mode'), horizontal: false}],
        ]],

        // ['io-color', {value: this.bind('color')}],
        // ['io-color', {value: this.bind('color')}],
        // ['io-color', {value: this.bind('color')}],
        ['io-item', {label: 'mode: rgba'}], ['io-color-vector', {mode: 0, value: this.color}],
        ['io-item', {label: 'mode: hsva'}], ['io-color-vector', {mode: 1, value: this.color}],
        ['io-item', {label: 'mode: hsla'}], ['io-color-vector', {mode: 2, value: this.color}],
        ['io-item', {label: 'mode: cmyka'}], ['io-color-vector', {mode: 3, value: this.color}],
      ]],
    ]);
  }
}

IoDemoElementsColor.Register();
