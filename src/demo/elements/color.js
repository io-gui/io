import {IoElement} from "../../io.js";

export class IoDemoColor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-table2;
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    :host > :nth-child(2n+1) {
      text-align: right;
    }
    :host io-color-panel,
    :host .vertical-sliders > * {
      height: 5em;
    }
    :host .sliders-2d {
      flex: 1 1;
    }
    @media only screen and (max-width: 400px) {
      :host {
        grid-template-columns: 0 1fr !important;
      }
      :host > :nth-child(2n+1) {
        visibility: hidden;
      }
    }
    `;
  }
  static get Properties() {
    return {
      mode: 0,
      color: [1, 1, 1, 1],
    };
  }
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  constructor(props) {
    super(props);
    this.template([
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
      ['io-item', {label: 'io-color-vector (rgba)'}], ['io-color-vector', {mode: 0, value: this.color}],
      ['io-item', {label: 'io-color-vector (hsva)'}], ['io-color-vector', {mode: 1, value: this.color}],
      ['io-item', {label: 'io-color-vector (hsla)'}], ['io-color-vector', {mode: 2, value: this.color}],
      ['io-item', {label: 'io-color-vector (cmyka)'}], ['io-color-vector', {mode: 3, value: this.color}],
    ]);
  }
}

IoDemoColor.Register();
