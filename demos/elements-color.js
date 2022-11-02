import { IoElement, RegisterIoElement, Options, Item } from '../build/iogui.js';

// class Temp extends IoElement {
//   constructor(props) {
//     super(props);
//     this.template([
//       ['div', {class: 'io-table2 table'}, [
//         ['io-field', {label: 'Mode'}],
//         ['io-option-menu', {value: this.bind('mode'), options: new Options([
//           new Item({label: 'rgb', value: 0}),
//           new Item({label: 'hsv', value: 1}),
//           new Item({label: 'hsl', value: 2}),
//           new Item({label: 'cmyk', value: 3}),
//         ])}],
//       ]],
//     ]);
//   }
// }

export class IoDemoElementsColor extends IoElement {
  static get Style() {
    return /* css */`
      :host > div {
        display: flex;
        width: 460px;
        margin: var(--io-spacing) 0;
        padding: var(--io-spacing) 0;
        border: var(--io-border);
        border-color: rgba(128, 128, 128, .125);
      }
      :host > div.tall {
        height: calc(var(--io-field-height) * 4);
      }
      :host > div > :nth-child(1) {
        flex: 0 0 140px;
        text-align: right;
        margin-right: var(--io-spacing);
      }
      :host > div > * {
        margin-left: var(--io-spacing);
      }
      :host > div > io-label,
      :host > div > io-icon {
        margin-top: var(--io-spacing);
      }
    `;
  }
  static get Properties() {
    return {
      rgb: { value: {'r': 1, 'g': 0.5, 'b': 0}},
      rgba: { value: {'r': 1, 'g': 0.5, 'b': 0, 'a': 0.75}},
      cmyk: { value: {'c': 0, 'm': 0, 'y': 0, 'k': 0}},
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-label', {label: 'color-rgba'}],
        ['io-color-rgba', {value: this.rgba}],
      ]],
      ['div', [
        ['io-label', {label: 'color-rgba [rgb]'}],
        ['io-color-rgba', {value: this.rgb}],
      ]],
      // ['div', [
      //   ['io-label', {label: 'mode'}],
      //   ['io-option-menu', {value: this.bind('mode'), options: new Options([
      //     new Item({label: 'rgb', value: 0}),
      //     new Item({label: 'hsv', value: 1}),
      //     new Item({label: 'hsl', value: 2}),
      //     new Item({label: 'cmyk', value: 3}),
      //   ])}],
      // ]],

      // ['div', [
      //   ['io-label', {label: 'color-vector[3]'}],
      //   ['io-color-vector', {mode: this.bind('mode'), value: this.array3}]
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-vector', {mode: this.bind('mode'), value: this.array4}]
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-vector', {mode: 0, value: this.color}]
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-vector', {mode: 1, value: this.color}]
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-vector', {mode: 2, value: this.color}]
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-vector', {mode: 3, value: this.color}]
      // ]],

      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-red', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-green', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-blue', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-hue', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-saturation', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-value', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-level', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-cyan', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-magenta', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-yellow', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-key', {value: this.color, mode: this.bind('mode')}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-alpha', {value: this.color, mode: this.bind('mode')}],
      // ]],

      // ['div', {class: 'tall'}, [
      //   ['io-label', {label: '2D and vertical'}],
      //     ['io-color-slider-hs', {value: this.color, mode: this.bind('mode')}],
      //     ['io-color-slider-sv', {value: this.color, mode: this.bind('mode')}],
      //     ['io-color-slider-sl', {value: this.color, mode: this.bind('mode')}],
      //     ['io-color-slider-red', {value: this.color, mode: this.bind('mode'), vertical: true}],
      //     ['io-color-slider-green', {value: this.color, mode: this.bind('mode'), vertical: true}],
      //     ['io-color-slider-blue', {value: this.color, mode: this.bind('mode'), vertical: true}],
      //     ['io-color-slider-alpha', {value: this.color, mode: this.bind('mode'), vertical: true}],
      // ]],

      // ['div', {class: 'tall'}, [
      //   ['io-label', {label: 'color-panel'}],
      //   ['io-color-panel', {expanded: true, value: this.color, mode: this.bind('mode'), class: 'color-slider'}]
      // ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsColor);