import {html, IoElement, IoStorage as $} from "../dist/io.js";
import {IoThemeSingleton} from "../dist/io-elements-core.js";
import "./todomvc/todo-app.js";

export class IoDemo extends IoElement {
  static get Style() {
    return html`<style>
      :host,
      :host > io-selector-tabs {
        display: flex;
        flex: 1 1;
      }
      :host div[name=elements] > div {
        max-width: 24em;
      }
      :host .table > * {
        width: auto;
      }
      :host .io-content {
        flex: 1 1 auto;

      }
      :host iframe[name=todo] {
        border: none;
        flex: 1 1;
      }
      :host div[name=elements] {
        padding: var(--io-spacing);
      }
      :host div[name=color] > div > io-vector {
        flex: 1 1;
      }
      :host div[name=color] > div > :not(io-vector) {
      }
      :host div[name=elements] > .io-row,
      :host div[name=elements] > .io-column {
        margin: var(--io-spacing) 0;
        max-width: 24em;
        width: 24em;
      }
      :host div[name=elements] > .io-column > *:not(:last-child) {
        margin-bottom: var(--io-spacing);
      }
      :host div[name=elements] > .io-row > *:not(:last-child) {
        margin-right: var(--io-spacing);
      }
      :host io-rgba-picker {
        flex: 1 1;
      }
      :host .menuframe {
        flex: 1 1;
        align-self: stretch;
        margin: var(--io-spacing);
      }
    </style>`;
  }
  static get Properties() {
    return {
      number: 0.0,
      string: 'hello',
      boolean: true,

      color: [],
      rgba: {},
      hsva: {},
      hsla: {},
      cmyka: {},

      null: null,
      NaN: NaN,
      undefined: undefined,
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

    this.color = [1.0000, 0.5019, 0.2509, 1];
    this.rgba = {r: 1.0000, g: 0.5019, b: 0.2509, a:1};
    this.hsva = {h: 0.0558, s: 0.7490, v: 1.0000, a:1};
    this.hsla = {h: 0.0558, s: 1.0000, l: 0.6255, a:1};
    this.cmyka = {c: 0, m: 0.4980, y: 0.7490, k: 0, a:1};

    this.setNumber = this.setNumber.bind(this);

    if (!("PointerEvent" in window)) console.warn("No PointerEvents support!");

    const primitives = ['div', {name: 'primitives', class: 'io-table5 table'}, [
      ['io-string', {value: this.bind('string')}],
      ['io-number', {value: this.bind('string')}],
      ['io-boolean', {value: this.bind('string'), display: 'icon'}],
      ['io-boolean', {value: this.bind('string')}],
      ['io-boolean', {value: this.bind('string'), display: 'switch'}],
      ['io-string', {value: this.bind('number')}],
      ['io-number', {value: this.bind('number')}],
      ['io-boolean', {value: this.bind('number'), display: 'icon'}],
      ['io-boolean', {value: this.bind('number')}],
      ['io-boolean', {value: this.bind('number'), display: 'switch'}],
      ['io-string', {value: this.bind('boolean')}],
      ['io-number', {value: this.bind('boolean')}],
      ['io-boolean', {value: this.bind('boolean'), display: 'icon'}],
      ['io-boolean', {value: this.bind('boolean')}],
      ['io-boolean', {value: this.bind('boolean'), display: 'switch'}],
    ]];

    const sliders = ['div', {name: 'sliders', class: 'io-column'}, [
      ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
      ['io-slider', {value: this.bind('number'), min: -1.33, max: 3.5, step: 0.8}],
      ['io-slider', {value: this.bind('number'), min: -0.25, max: 0.25, step: 0.01}],
      ['io-slider', {value: this.bind('string'), min: -0.25, max: 0.25, step: 0.01}],
      ['io-vector', {value: this.bind('color'), linkable: true}],
      ['io-rgba', {value: this.bind('color')}],
    ]];

    const buttons = ['div', {name: 'button', class: 'io-table4 table'}, [
      ['io-menu-option', {options: [
        {label: 'negative one', value: -1},
        {label: 'zero', value: 0},
        {label: 'half', value: 0.5},
        {label: 'one', value: 1},
        {label: 'two', value: 2},
        {label: 'three', value: 3},
        {label: 'four', value: 4},
        {label: 'leet', value: 1337},
      ], value: this.bind('number')}],
      ['io-menu-option', {options: [ -1, 0, 1, 2, 3, 4, 1337], value: this.bind('number')}],
      ['io-button', {label: 'set 0.5', action: this.setNumber, value: 0.5}],
      ['io-menu-option', {label: 'Theme ▾', value: IoThemeSingleton.bind('theme'), options: ['light', 'dark']}],
    ]];

    const color = ['div', {name: 'color', class: 'io-column'}, [
      ['div', {class: 'io-row'}, [
        ['io-rgba-picker', {value: this.bind('color'), horizontal: false}],
        ['io-rgba-picker', {value: this.bind('color')}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-color-slider', {value: this.bind('color')}],
        ['io-color-slider-hue', {value: this.bind('color')}],
        ['io-color-slider-saturation', {value: this.bind('color')}],
        ['io-color-slider-value', {value: this.bind('color')}],
        ['io-color-slider-level', {value: this.bind('color')}],
        ['io-color-slider-hs', {value: this.bind('color')}],
        ['io-color-slider-sv', {value: this.bind('color')}],
        ['io-color-slider-sl', {value: this.bind('color')}],
        ['io-color-slider-alpha', {value: this.bind('color')}],
        ['io-vector', {value: this.bind('color')}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-color-slider', {value: this.bind('rgba')}],
        ['io-color-slider-hue', {value: this.bind('rgba')}],
        ['io-color-slider-saturation', {value: this.bind('rgba')}],
        ['io-color-slider-value', {value: this.bind('rgba')}],
        ['io-color-slider-level', {value: this.bind('rgba')}],
        ['io-color-slider-hs', {value: this.bind('rgba')}],
        ['io-color-slider-sv', {value: this.bind('rgba')}],
        ['io-color-slider-sl', {value: this.bind('rgba')}],
        ['io-color-slider-alpha', {value: this.bind('rgba')}],
        ['io-vector', {value: this.bind('rgba')}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-color-slider', {value: this.bind('hsva')}],
        ['io-color-slider-hue', {value: this.bind('hsva')}],
        ['io-color-slider-saturation', {value: this.bind('hsva')}],
        ['io-color-slider-value', {value: this.bind('hsva')}],
        ['io-color-slider-level', {value: this.bind('hsva')}],
        ['io-color-slider-hs', {value: this.bind('hsva')}],
        ['io-color-slider-sv', {value: this.bind('hsva')}],
        ['io-color-slider-sl', {value: this.bind('hsva')}],
        ['io-color-slider-alpha', {value: this.bind('hsva')}],
        ['io-vector', {value: this.bind('hsva')}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-color-slider', {value: this.bind('hsla')}],
        ['io-color-slider-hue', {value: this.bind('hsla')}],
        ['io-color-slider-saturation', {value: this.bind('hsla')}],
        ['io-color-slider-value', {value: this.bind('hsla')}],
        ['io-color-slider-level', {value: this.bind('hsla')}],
        ['io-color-slider-hs', {value: this.bind('hsla')}],
        ['io-color-slider-sv', {value: this.bind('hsla')}],
        ['io-color-slider-sl', {value: this.bind('hsla')}],
        ['io-color-slider-alpha', {value: this.bind('hsla')}],
        ['io-vector', {value: this.bind('hsla')}],
      ]],
      ['div', {class: 'io-row'}, [
        ['io-color-slider', {value: this.bind('cmyka')}],
        ['io-color-slider-hue', {value: this.bind('cmyka')}],
        ['io-color-slider-saturation', {value: this.bind('cmyka')}],
        ['io-color-slider-value', {value: this.bind('cmyka')}],
        ['io-color-slider-level', {value: this.bind('cmyka')}],
        ['io-color-slider-hs', {value: this.bind('cmyka')}],
        ['io-color-slider-sv', {value: this.bind('cmyka')}],
        ['io-color-slider-sl', {value: this.bind('cmyka')}],
        ['io-color-slider-alpha', {value: this.bind('cmyka')}],
        ['io-vector', {value: this.bind('cmyka')}],
      ]],
    ]];

    const options = [
      {label: 'set one', value: 1, action: this.setNumber},
      {label: 'set two', value: 2, action: this.setNumber},
      {label: 'set three', value: 3, action: this.setNumber},
      {label: 'set four', value: 4, action: this.setNumber},
      {label: 'set five', value: 5, action: this.setNumber}
    ];
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
      'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
      'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
    const hearts = ["❤️", "💚", "💙"];
    const longOptions = [];
    for (let i = 0; i < 100; i++) {
      const r1 = words[Math.floor(Math.random() * 20)];
      const r2 = words[Math.floor(Math.random() * 20)];
      const r3 = words[Math.floor(Math.random() * 20)];
      const i = hearts[Math.floor(Math.random() * 9)] || '';
      longOptions.push({icon: i, label: r1 + ' ' + r2, value: 0, action: this.setNumber, hint: r3});
    }
    const menuoptions = [
      {label: 'first', options: options},
      {label: 'second', options: [
        {label: 'suboption one', options: options},
        {label: 'suboption two', options: options},
        {label: 'suboption three', options: options},
      ]},
      {label: 'long menu', options: longOptions, hint: 'list', icon: '⚠'}
    ];
    const menu = ['div', {name: 'menu', class: 'io-column'}, [
      ['io-menu-options', {options: menuoptions, horizontal: true}],
      ['div', {class: 'io-row'}, [
        ['io-menu-options', {options: menuoptions}],
        ['div', {class: 'io-column'}, [
          ['io-menu-item', {label: 'menu item', option: {options: menuoptions}}],
          ['div', {class: 'io-frame menuframe'}, [
            ['span', 'click for menu'],
            ['io-menu', {options: menuoptions, position: 'pointer', button: 0}],
          ]],
          ['div', {class: 'io-frame menuframe'}, [
            ['span', 'right-click for menu'],
            ['io-menu', {options: menuoptions, position: 'pointer', button: 2}],
          ]],
        ]]
      ]]
    ]];

    const object = ['div', {name: 'object', class: 'io-column'}, [
      ['io-object', {value: this, label: 'IoObject (filtered properties)', expanded: $('io-object1', true), properties: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'options', 'numbers', 'color']}], //TODO: labeled?
      ['io-object', {value: this, label: 'IoObject (configured property)', expanded: $('io-object2', true), properties: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
    ]];

    const inspector = ['div', {name: 'inspector', class: 'io-column'}, [
      ['io-inspector', {value: this, expanded: ['properties']}],
    ]];

    // const demoLayout = ['io-layout', {
    //   name: 'layout',
    //   orientation: 'horizontal',
    //   elements: [
    //     primitives,
    //     sliders,
    //     buttons,
    //     object,
    //     inspector,
    //     menu,
    //   ],
    //   splits: [
    //     {selected: 'sliders', tabs: ['sliders'], size: 280},
    //     {orientation: 'vertical', splits: [
    //       {tabs: ['button'], selected: 'button', size: 100},
    //       {tabs: ['primitives', 'sliders', 'options', 'button', 'object', 'inspector'], selected: 'inspector'},
    //       {tabs: ['primitives'], selected: 'primitives'},
    //     ]},
    //   ],
    // }];

    // TODO: Add demos for all remaining elements

    this.template([
      ['io-selector-tabs', {precache: true, selected: $('demo', 'elements', true),
        options: [
          {value: 'elements', label: "All Elements"},
          // {value: 'layout', label: "Layout"},
          {value: 'todo', label: "Todo App"},
        ],
        elements: [
          ['div', {name: 'elements'}, [
            // primitives,
            // sliders,
            // buttons,
            color,
            // menu,
            // object,
            // inspector,
          ]],
          // demoLayout,
          ['iframe', {name: 'todo', src: './demo/todomvc/index.html'}],
        ]
      }]
    ]);
  }
}

IoDemo.Register();
