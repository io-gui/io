import {IoElement} from "../../io.js";
import {IoStorageFactory as $} from "../../io-core.js";

export class IoDemoObject extends IoElement {
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
    :host > :nth-child(2n) {
      margin-bottom: var(--io-spacing);
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
    :host > *,
    :host .io-row > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host .io-column > *:not(:last-child) {
      margin-bottom: var(--io-spacing);
    }
    `;
  }
  static get Properties() {
    return {
      mode: 0,
      color: [1, 1, 1, 1],
    };
  }
  constructor(props) {
    super(props);
    const objectBinding = $('demo:object');
    this.template([
      ['io-item', {label: 'io-properties (filtered)'}],
      ['div', {class: 'io-column'}, [
        ['io-properties', {value: objectBinding, properties: ['number', 'string', 'boolean']}],
      ]],
      ['io-item', {label: 'io-object (filtered)'}],
      ['io-object', {value: objectBinding, expanded: true, properties: ['number', 'string', 'boolean']}],
      ['io-item', {label: 'io-object (configured)'}],
      ['io-object', {value: objectBinding, expanded: true, properties: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
      ['io-item', {label: 'io-inspector'}],
      ['div', {class: 'io-column'}, [
        ['io-inspector', {
          value: objectBinding,
          expanded: ['properties'],
          groups: {
            'Object|properties': [],
            'Object|vectors and matrices': [/vector/i, /matrix/i],
          },
          config: {
            'vector2': ['io-vector', {linkable: true}],
            'vector3': ['io-vector', {linkable: true}],
            'vector4': ['io-vector', {linkable: true}],
            'matrix2': ['io-matrix'],
            'matrix3': ['io-matrix'],
            'matrix4': ['io-matrix'],
          },
        }],
      ]],
      // Colors
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

IoDemoObject.Register();
