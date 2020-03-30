import {IoElement} from '../../io/build/io.js';
import {IoStorageFactory as $} from '../../io/build/io-elements.js';
import '../../io/build/io-extras.js';

const boolean = $({key: 'demo:boolean', value: false});
const string = $({key: 'demo:string', value: 'Hello io!'});
const number = $({key: 'demo:number', value: 0});

const menuoptions = [
  {label: 'Long Menu', options: $('demo:longmenuoptions').value},
  ...$('demo:menuoptions').value,
];

export class IoDemoElementsCore extends IoElement {
  static get Style() {
    return /* css */`

    :host {
      @apply --io-table2;
      max-width: 42em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    :host > :nth-child(2n+1) {
      text-align: right;
    }
    :host > :nth-child(2n) {
      margin-bottom: var(--io-spacing);
      min-width: 0;
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


    :host {
      /* max-width: 32em; */
      padding: var(--io-spacing);
    }
    :host .io-table5 {
      /* max-width: 32em; */
    }
    :host .io-table5 > * {
      /* width: auto; */
    }
    :host > *,
    :host .io-row > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host > *,
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
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  setNumber(value) {
    number.value = value;
  }
  constructor(props) {
    super(props);
    this.setNumber = this.setNumber.bind(this);
    const menuValue = $({value: 'menu value'});
    const objectBinding = $('demo:object');

    this.template([
      ['io-item', {label: 'Basic Inputs'}],
      ['div', {class: 'io-table5 table'}, [
        ['io-string', {value: string}],
        ['io-number', {ladder: true, conversion: 2, value: number}],
        ['io-boolicon', {value: boolean}],
        ['io-switch', {value: boolean}],
        ['io-boolean', {value: boolean}],
      ]],
      ['io-item', {label: 'io-slider'}],
      ['div', {class: 'io-row'}, [
        ['io-slider', {value: number, horizontal: false, min: 0, max: 2, step: 0.25}],
        ['io-slider-range', {value: $('demo:vector2'), horizontal: false, min: -1, max: 2, step: 0.25}],
        ['div', {class: 'io-column'}, [
          ['io-slider', {value: number, min: -2, max: 2, step: 0.1, exponent: 3}],
          ['io-slider', {value: number, min: 0, max: 2, step: 1}],
          ['io-slider', {value: number, min: -1.33, max: 3.5, step: 0.8}],
          ['io-number-slider', {value: number, min: -0.25, max: 0.25, step: 0.01, exponent: 0.25}],
          ['io-slider-range', {value: $('demo:vector2'), min: -10, max: 10, step: 1, exponent: 0.5}],
          ['io-number-slider-range', {value: $('demo:vector2'), min: -10, max: 10, step: 1}],
        ]],
      ]],
      ['io-item', {label: 'io-option-menu'}],
      ['div', {class: 'io-table3 table'}, [
        ['io-option-menu', {options: [
          {label: 'negative one', value: -1},
          {label: 'zero', value: 0},
          {label: 'half', value: 0.5},
          {label: 'one', value: 1},
          {label: 'two', value: 2},
          {label: 'three', value: 3},
          {label: 'four', value: 4},
          {label: 'leet', value: 1337},
        ], value: number}],
        ['io-option-menu', {options: [ -1, 0, 1, 2, 3, 4, 1337], value: number}],
        ['io-button', {label: 'set 0.5', action: this.setNumber, value: 0.5}],
      ]],
      ['io-item', {label: 'io-menu'}],
      ['div', {class: 'io-column'}, [
        ['io-menu-options', {value: menuValue, options: menuoptions, horizontal: true, selectable: true}],
        ['div', {class: 'io-row'}, [
          ['io-menu-options', {value: menuValue, selectable: true, options: menuoptions, searchable: true}],
          ['div', {class: 'io-column'}, [
            ['div', [['span', {class: 'io-item'}, 'Selected:'], ['io-item', {value: menuValue}]]],
            ['io-menu-item', {label: 'menu item', value: menuValue, selectable: true, option: $('demo:menuoption')}],
            ['div', {class: 'io-content'}, [
              ['span', 'click for menu'],
              ['io-context-menu', {value: menuValue, selectable: true, options: menuoptions, position: 'pointer', button: 0}],
            ]],
            ['div', {class: 'io-content'}, [
              ['span', 'right-click for menu'],
              ['io-context-menu', {value: menuValue, selectable: true, options: menuoptions, position: 'pointer', button: 2}],
            ]],
          ]],
        ]],
      ]],
      ['io-item', {label: 'io-properties (filtered)'}],
      ['div', {class: 'io-column'}, [
        ['io-properties', {value: objectBinding, properties: ['number', 'string', 'boolean']}],
      ]],
      ['io-item', {label: 'io-object (filtered)'}],
      ['io-object', {
        value: objectBinding,
        expanded: true,
        slotted: ['io-item', {label: 'Slotted Element'}],
        properties: ['number', 'string', 'boolean']
      }],
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
            'number': ['io-slider', {step: 0.1}],
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

IoDemoElementsCore.Register();
