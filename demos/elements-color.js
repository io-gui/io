import { IoElement, RegisterIoElement } from '../build/iogui.js';

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
      ['div', [
        ['io-label', {label: 'color-slider [red]'}],
        ['io-color-slider', {value: this.rgba, channel: 'r'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [green]'}],
        ['io-color-slider', {value: this.rgba, channel: 'g'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [blue]'}],
        ['io-color-slider', {value: this.rgba, channel: 'b'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [alpha]'}],
        ['io-color-slider', {value: this.rgba, channel: 'a'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [h]'}],
        ['io-color-slider', {value: this.rgba, channel: 'h'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [s]'}],
        ['io-color-slider', {value: this.rgba, channel: 's'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [v]'}],
        ['io-color-slider', {value: this.rgba, channel: 'v'}],
      ]],
      ['div', [
        ['io-label', {label: 'color-slider [l]'}],
        ['io-color-slider', {value: this.rgba, channel: 'v'}],
      ]],
      // ['div', [
      //   ['io-label', {label: 'color-slider-green]'}],
      //   ['io-color-slider-green', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-blue', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-hue', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-saturation', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-value', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-level', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-cyan', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-magenta', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-yellow', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-key', {value: this.color}],
      // ]],
      // ['div', [
      //   ['io-label', {label: 'color-vector[4]'}],
      //   ['io-color-slider-alpha', {value: this.color}],
      // ]],

      // ['div', {class: 'tall'}, [
      //   ['io-label', {label: '2D and vertical'}],
      //     ['io-color-slider-hs', {value: this.color}],
      //     ['io-color-slider-sv', {value: this.color}],
      //     ['io-color-slider-sl', {value: this.color}],
      //     ['io-color-slider-red', {value: this.color, vertical: true}],
      //     ['io-color-slider-green', {value: this.color, vertical: true}],
      //     ['io-color-slider-blue', {value: this.color, vertical: true}],
      //     ['io-color-slider-alpha', {value: this.color, vertical: true}],
      // ]],

      // ['div', {class: 'tall'}, [
      //   ['io-label', {label: 'color-panel'}],
      //   ['io-color-panel', {expanded: true, value: this.color, class: 'color-slider'}]
      // ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsColor);