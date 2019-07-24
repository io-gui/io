import {html, IoElement, IoStorage as $} from "../dist/io.js";
import {IoThemeSingleton} from "../dist/io-elements-core.js";
import "./todomvc/todo-app.js";

export class IoDemo extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex: 1 1;
      }
      :host > io-selector-tabs {
        flex: 1 1;
      }
      :host .table {
        max-width: 24em;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: var(--io-spacing);
      }
      :host .table > * {
        width: auto;
      }
      :host io-object:not(:last-of-type),
      :host io-slider:not(:last-of-type) {
        margin-bottom: var(--io-spacing);
      }
      :host div[name=elements] {
        padding: var(--io-spacing);
      }
      :host div[name=elements] > .io-frame {
        margin: var(--io-spacing) 0;
        max-width: 24em;
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

    this.setNumber = this.setNumber.bind(this);

    if (!("PointerEvent" in window)) console.warn("No PointerEvents support!");

    const primitives = ['div', {name: 'primitives', class: 'table'}, [
      ['io-string', {id: 'string', value: this.bind('string')}],
      ['io-number', {value: this.bind('string')}],
      ['io-boolean', {value: this.bind('string')}],
      ['io-switch', {value: this.bind('string')}],
      ['io-string', {value: this.bind('number')}],
      ['io-number', {id: 'number', value: this.bind('number')}],
      ['io-boolean', {value: this.bind('number')}],
      ['io-switch', {value: this.bind('number')}],
      ['io-string', {value: this.bind('boolean')}],
      ['io-number', {value: this.bind('boolean')}],
      ['io-boolean', {id: 'boolean', value: this.bind('boolean')}],
      ['io-switch', {id: 'boolean', value: this.bind('boolean')}],
    ]];

    const sliders = ['div', {name: 'sliders', class: 'io-frame'}, [
      ['io-slider', {value: this.bind('number')}],
      ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
      ['io-slider', {value: this.bind('number'), min: -1.33, max: 3.5, step: 0.8}],
      ['io-slider', {value: this.bind('number'), min: -0.25, max: 0.25, step: 0.01}],
      ['io-slider', {value: this.bind('NaN'), step: 0.1}],
    ]];

    const buttons = ['div', {name: 'button', class: 'table io-frame'}, [
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
      ['io-button', {label: 'set 1', action: this.setNumber, value: 1}],
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
      {label: 'file', options: options},
      {label: 'view', options: [
        {label: 'suboption one', options: options},
        {label: 'suboption two', options: options},
        {label: 'suboption three', options: options},
      ]},
      {label: 'long menu', options: longOptions, hint: 'list', icon: '⚠'}
    ];
    const menu = ['div', {name: 'menu', class: 'io-frame'}, [
      ['io-menu-options', {options: menuoptions, horizontal: true}],
      ['div', {class: 'io-row'}, [
        ['io-menu-options', {options: menuoptions}],
        ['div', {class: 'io-column'}, [
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

    const object = ['div', {name: 'object', class: 'io-frame'}, [
      ['io-object', {value: this, label: 'IoDemo (filtered property list)', expanded: $('io-object1', true), properties: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'options', 'numbers']}], //TODO: labeled?
      ['io-object', {value: this, label: 'IoDemo (single configured property)', expanded: $('io-object2', true), properties: ['number'], config: {'number': ['io-slider', {step: 0.001}]}}],
    ]];

    const inspector = ['div', {name: 'inspector', class: 'io-frame'}, [
      ['io-inspector', {value: this, expanded: ['properties']}],
    ]];

    const demoLayout = ['io-layout', {
      name: 'layout',
      orientation: 'horizontal',
      elements: [
        primitives,
        sliders,
        buttons,
        object,
        inspector,
        menu,
      ],
      splits: [
        {selected: 'sliders', tabs: ['sliders'], size: 280},
        {orientation: 'vertical', splits: [
          {tabs: ['button'], selected: 'button', size: 100},
          {tabs: ['primitives', 'sliders', 'options', 'button', 'object', 'inspector'], selected: 'inspector'},
          {tabs: ['primitives'], selected: 'primitives'},
        ]},
      ],
    }];

    // TODO: Add demos for all remaining elements

    this.template([
      ['io-selector-tabs', {precache: true, selected: $('demo', 'elements', true),
        slotted: [
          ['io-menu-option', {label: 'Theme', class: 'io-item', value:
           IoThemeSingleton.bind('theme'), options: ['light', 'dark']}],
        ],
        options: [
          {value: 'elements', label: "Elements"},
          {value: 'layout', label: "Layout"},
          {value: 'todo', label: "Todo App"},
        ],
        elements: [
          ['div', {name: 'elements'}, [
            primitives,
            sliders,
            buttons,
            menu,
            object,
            inspector,
          ]],
          demoLayout,
          ['todo-app', {name: 'todo'}],
        ]
      }]
    ]);
  }
}

IoDemo.Register();
