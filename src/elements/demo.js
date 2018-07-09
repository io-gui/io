import {html, IoElement} from "../core/element.js";

export class IoDemo extends IoElement {
  static get style() {
    return html`<style>
      :host .demo {
        margin: 1em;
        padding: 0.5em;
        background: #eee;
      }
      :host .demoLabel {
        padding: 0.25em;
        margin: -0.5em -0.5em 0.5em -0.5em;
        background: #ccc;
      }
      :host .row > *  {
        flex: 1;
      }
      :host .row {
        display: flex;
        width: 22em;
      }
      :host .label {
        color: rgba(128, 122, 255, 0.75);
      }
      :host .padded {
        padding: 1em;
      }
      :host io-menu-group {
        background: #fff;
      }

      :host io-string,
      :host io-boolean,
      :host io-number,
      :host io-option,
      :host io-color-picker,
      :host io-slider-slider {
        background-color: #ddd;
        margin: 1px;
      }
      :host io-object {
        border: 1px solid #bbb;
      }
    </style>`;
  }
  static get properties() {
    return {
      number: 0,
      string: "hello",
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      array: Array,
      vec2: Object,
      vec3: Object,
      vec4: Object,
      colorRGBA: Object,
      colorHEX: Object,
    };
  }
  static get listeners() {
    return {
      'value-set': '_onValueSet'
    };
  }
  _onValueSet() {
    this.dispatchEvent('io-object-mutated', {object: this, key: '*'}, false, window);
  }
  constructor() {
    super();
    this.array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.vec2 = {x:0, y:1};
    this.vec3 = {x:0, y:0, z:1};
    this.vec4 = {x:0, y:0, z:0, w:1};
    this.colorRGBA = {r:0, g:1, b:0, a:1};
    this.colorHEX = 0xff0000;
    let suboptions1 = [
      {label: 'sub_sub_one', value: 1, action: console.log},
      {label: 'sub_sub_two', value: 2, action: console.log},
      {label: 'sub_sub_three', value: 3, action: console.log},
      {label: 'sub_sub_four', value: 4, action: console.log},
      {label: 'sub_sub_five', value: 5, action: console.log}
    ];
    let suboptions0 = [
      {label: 'sub_one', options: suboptions1},
      {label: 'sub_two', options: suboptions1},
      {label: 'sub_three', options: suboptions1},
      {label: 'sub_four', options: suboptions1},
      {label: 'sub_five', options: suboptions1}
    ];
    let longOptions = [];
    for (let i = 0; i < 1000; i++) {
      let r = Math.random();
      longOptions[i] = {label: String(r), value: r, action: console.log, icon: 'ξ', hint: 'log'};
    }
    this.menuoptions = [
      {label: 'one', options: suboptions0},
      {label: 'two', value: 2, action: console.log},
      {label: 'three', value: 3, action: console.log},
      {label: 'four', value: 4, action: console.log},
      {label: 'five', options: suboptions0},
      {label: 'long', options: longOptions, hint: 'list', icon: '⚠'}
    ];
    this.options = [
      {label: 'negative one', value: -1},
      {label: 'zero', value: 0},
      {label: 'one', value: 1},
      {label: 'two', value: 2},
      {label: 'three', value: 3},
      {label: 'four', value: 4},
      {label: 'leet', value: 1337},
    ];
    this.render([
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-string / io-number / io-boolean'],
        ['div', {className: 'row label'}, [
          ['span'],
          ['span', 'io-string'],
          ['span', 'io-number'],
          ['span', 'io-boolean'],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'string'],
          ['io-string', {id: 'string', value: this.bind('string')}],
          ['io-number', {value: this.bind('string')}],
          ['io-boolean', {type: 'boolean', value: this.bind('string')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'number'],
          ['io-string', {value: this.bind('number')}],
          ['io-number', {id: 'number', value: this.bind('number')}],
          ['io-boolean', {type: 'boolean', value: this.bind('number')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'boolean'],
          ['io-string', {value: this.bind('boolean')}],
          ['io-number', {value: this.bind('boolean')}],
          ['io-boolean', {id: 'boolean', type: 'boolean', value: this.bind('boolean')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'NaN'],
          ['io-string', {value: this.bind('NaN')}],
          ['io-number', {value: this.bind('NaN')}],
          ['io-boolean', {type: 'boolean', value: this.bind('NaN')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'null'],
          ['io-string', {value: this.bind('null')}],
          ['io-number', {value: this.bind('null')}],
          ['io-boolean', {type: 'boolean', value: this.bind('null')}],
        ]],
        ['div', {className: 'row'}, [
          ['div', {className: 'label'}, 'undefined'],
          ['io-string', {value: this.bind('undefined')}],
          ['io-number', {value: this.bind('undefined')}],
          ['io-boolean', {type: 'boolean', value: this.bind('undefined')}],
        ]],
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-color'],
        ['io-color', {value: this.bind('colorRGBA')}],
        ['io-color', {value: this.bind('colorHEX')}]
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-option'],
        ['io-option', {options: this.options, value: this.bind('number')}],
      ]],
      ['div', {className: 'demo sliders'}, [
        ['div', {className: 'demoLabel'}, 'io-slider'],
        ['io-slider', {value: this.bind('number')}],
        ['io-slider', {value: this.bind('number'), step: 0.5, min: -2, max: 3}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 8}]
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-vector'],
        ['io-vector', {value: this.vec2}],
        ['io-vector', {value: this.vec3}],
        ['io-vector', {value: this.vec4}]
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-array'],
        ['io-array', {value: this.array, columns: 4}],
        ['io-array', {value: this.array, columns: 2}]
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-object'],
        ['io-object', {value: this, expanded: true, labeled: true}]
      ]],
      ['div', {className: 'demo'}, [
        ['div', {className: 'demoLabel'}, 'io-menu / io-menu-group'],
        ['io-menu-group', {className: 'menubar', options: this.menuoptions, horizontal: true}],
        ['div', {className: 'label padded'}, 'io-menu (click / contextmenu)'],
        ['io-menu', {options: this.menuoptions, position: 'pointer'}],
        ['io-menu', {options: this.menuoptions, position: 'pointer', listener: 'contextmenu'}]
      ]]
    ]);
  }
}

IoDemo.Register();
