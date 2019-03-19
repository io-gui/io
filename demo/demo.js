import {html, IoElement, IoStorage as $, IoInspector} from "../build/io.js";

let suboptions2 = [
  {label: 'log one', value: 1, action: console.log},
  {label: 'log two', value: 2, action: console.log},
  {label: 'log three', value: 3, action: console.log},
  {label: 'log four', value: 4, action: console.log},
  {label: 'log five', value: 5, action: console.log}
];
let suboptions1 = [
  {label: 'one more', options: suboptions2},
  {label: 'two more', options: suboptions2},
  {label: 'three more', options: suboptions2},
  {label: 'four more', options: suboptions2},
  {label: 'five more', options: suboptions2}
];
let suboptions0 = [
  {label: 'one', options: suboptions1},
  {label: 'two', options: suboptions1},
  {label: 'three', options: suboptions1},
  {label: 'four', options: suboptions1},
  {label: 'five', options: suboptions1}
];
let longOptions = [];
for (let i = 0; i < 100; i++) {
  let r = Math.random();
  longOptions[i] = {label: String(r), value: r, action: console.log, icon: 'ξ', hint: 'log'};
}

const data = {
  menuoptions: [
    {label: 'file', options: suboptions0},
    {label: 'view', options: suboptions0},
    {label: 'long menu', options: longOptions, hint: 'list', icon: '⚠'}
  ],
  options: [
    {label: 'negative one', value: -1},
    {label: 'zero', value: 0},
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'leet', value: 1337},
  ],
}

IoInspector.RegisterConfig({
  'IoDemo|variables': ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'menuoptions', 'options', 'numbers'],
});

export class IoDemo extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
      }
      :host > io-collapsable {
        margin: var(--io-theme-spacing);
      }
      :host > io-collapsable:not([expanded]) {
        opacity: 0.5;
      }
      :host .table > div {
        display: grid;
        grid-template-columns: 100px 6em 6em 6em;
      }
      :host .label {
        color: rgba(128, 122, 255, 0.75);
        padding: var(--io-theme-padding);
      }
      :host .sidebar {
        display: inline-block;
      }
      :host io-object:not(:last-of-type),
      :host io-slider:not(:last-of-type) {
        margin-bottom: var(--io-theme-spacing);
      }
    </style>`;
  }
  static get properties() {
    return {
      title: 'demo',
      number: 0.5,
      string: 'hello',
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      menuoptions: function() { return data.menuoptions },
      options: function() { return data.options },
    };
  }
  changed(event) {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  setNumber(value) {
    this.number = value;
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-collapsable', {label: 'io-string / io-number / io-boolean', className: 'table', expanded: $('table'), elements: [
        ['span'],
        ['span', 'io-string'],
        ['span', 'io-number'],
        ['span', 'io-boolean'],
        ['div', {className: 'label'}, 'string'],
        ['io-string', {id: 'string', value: this.bind('string')}],
        ['io-number', {value: this.bind('string')}],
        ['io-boolean', {type: 'boolean', value: this.bind('string')}],
        ['div', {className: 'label'}, 'number'],
        ['io-string', {value: this.bind('number')}],
        ['io-number', {id: 'number', value: this.bind('number')}],
        ['io-boolean', {type: 'boolean', value: this.bind('number')}],
        ['div', {className: 'label'}, 'boolean'],
        ['io-string', {value: this.bind('boolean')}],
        ['io-number', {value: this.bind('boolean')}],
        ['io-boolean', {id: 'boolean', type: 'boolean', value: this.bind('boolean')}],
        ['div', {className: 'label'}, 'NaN'],
        ['io-string', {value: this.bind('NaN')}],
        ['io-number', {value: this.bind('NaN')}],
        ['io-boolean', {type: 'boolean', value: this.bind('NaN')}],
        ['div', {className: 'label'}, 'null'],
        ['io-string', {value: this.bind('null')}],
        ['io-number', {value: this.bind('null')}],
        ['io-boolean', {type: 'boolean', value: this.bind('null')}],
        ['div', {className: 'label'}, 'undefined'],
        ['io-string', {value: this.bind('undefined')}],
        ['io-number', {value: this.bind('undefined')}],
        ['io-boolean', {type: 'boolean', value: this.bind('undefined')}],
      ]}],
      ['io-collapsable', {label: 'io-slider', expanded: $('io-slider'), elements: [
        ['div', {className: 'label'}, 'number'],
        ['io-slider', {value: this.bind('number')}],
        ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
        ['io-slider', {value: this.bind('number'), min: -2, max: 3, step: 1}],
        ['io-slider', {value: this.bind('number'), min: -1, max: 1, step: 0.1}],
        ['div', {className: 'label'}, 'NaN'],
        ['io-slider', {value: this.bind('NaN'), step: 0.1}],
      ]}],
      ['io-collapsable', {label: 'io-option', expanded: $('io-option'), elements: [
        ['div', {className: 'label'}, 'number'],
        ['io-option', {options: this.options, value: this.bind('number')}],
      ]}],
      ['io-collapsable', {label: 'io-button', expanded: $('io-button'), className: 'table', elements: [
        ['io-button', {label: 'set .5', action: this.setNumber, value: 0.5}],
        ['io-button', {label: 'set 1', action: this.setNumber, value: 1}],
        ['io-button', {label: 'set 2', action: this.setNumber, value: 2}],
        ['io-button', {label: 'set 3', action: this.setNumber, value: 3}],
      ]}],
      ['io-collapsable', {label: 'io-object', expanded: $('io-object'), elements: [
        ['io-object', {value: this, label: 'IoDemo (filtered property list)', expanded: $('io-object1'), props: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'menuoptions', 'options', 'numbers']}], //TODO: labeled?
        ['io-object', {value: this, label: 'IoDemo (single configured property)', labeled: false, expanded: $('io-object2'), props: ['number'], config: {'key:number': ['io-slider', {step: 0.1}]}}],
        ['io-object', {value: this.menuoptions, label: 'Array (menu options)', expanded: $('io-object3')}],
      ]}],
      ['io-collapsable', {label: 'io-inspector', expanded: $('io-inspector'), elements: [
        ['io-inspector', {value: this, expanded: ['properties']}],
      ]}],
      // TODO: array
      // TODO: object-group
      ['io-collapsable', {label: 'io-menu', expanded: $('io-menu'), elements: [
        ['div', {className: 'label'}, 'right-click (contextmenu)'],
        ['io-menu', {options: this.menuoptions, position: 'pointer', button: 2, ondown: false}]
      ]}],
      ['io-collapsable', {label: 'io-menu-options', expanded: $('io-menu'), elements: [
        ['io-menu-options', {className: 'sidebar', options: this.menuoptions}],
        ['div', {className: 'label'}, 'horizontal'],
        ['io-menu-options', {className: 'menubar', options: this.menuoptions, horizontal: true}],
      ]}],
    ]);
  }
}

IoDemo.Register();
