import { Register, IoElement, IoStorage } from 'io-gui';
import { MenuItem, MenuOptions } from 'io-menus';
import './menu-model.js';
import 'io-iconset';
import '../packages/io-inputs/demos/io-inputs-demo.js';
import '../packages/io-iconset/demos/io-iconset-demo.js';

function $(key) {
  return IoStorage({key: key, value: false, storage: 'local'})
}

const numberItems = [
  {value: 0, label: 'zero'},
  {value: 1, label: 'one'},
  {value: 2, label: 'two'},
  {value: 3, label: 'three'},
  {value: 4, label: 'four'},
];

const options = new MenuOptions([
  {label: 'Red', icon: '❤️', options: [
    'Red1',
    'Red2',
    'Red3',
  ]},
  {label: 'Green', icon: '💚', options: [
    'Green1',
    'Green2',
    'Green3',
  ]},
  {label: 'Blue', icon: '💙', options: [
    'Blue1',
    'Blue2',
    'Blue3',
  ]},
  {label: 'Numbers', options: [
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'five', value: 5},
  ]},
]);

const contentOptions = new MenuOptions([
  {value: 'devs', options: [
    {value: 'dev1', mode: 'scroll'},
    {value: 'dev2', mode: 'scroll'},
    {value: 'dev3', mode: 'scroll'},
    {value: 'dev4', mode: 'scroll'},
    {value: 'dev5', mode: 'scroll'},
    {value: 'dev6', mode: 'scroll'},
    {value: 'dev7', mode: 'scroll'},
  ]},
  {value: 'foos', options: [
    {value: 'foo1', mode: 'scroll'},
    {value: 'foo2', mode: 'scroll'},
    {value: 'foo3', mode: 'scroll'},
    {value: 'foo4', mode: 'scroll'},
    {value: 'foo5', mode: 'scroll'},
    {value: 'foo6', mode: 'scroll'},
    {value: 'foo7', mode: 'scroll'},
  ]},
  {value: 'bazs', options: [
    {value: 'baz1', mode: 'scroll'},
    {value: 'baz2', mode: 'scroll'},
    {value: 'baz3', mode: 'scroll'},
    {value: 'baz4', mode: 'scroll'},
    {value: 'baz5', mode: 'scroll'},
    {value: 'baz6', mode: 'scroll'},
    {value: 'baz7', mode: 'scroll'},
  ]},
  {value: 'bars', options: [
    {value: 'bar1', mode: 'scroll'},
    {value: 'bar2', mode: 'scroll'},
    {value: 'bar3', mode: 'scroll'},
    {value: 'bar4', mode: 'scroll'},
    {value: 'bar5', mode: 'scroll'},
    {value: 'bar6', mode: 'scroll'},
    {value: 'bar7', mode: 'scroll'},
  ]},
]);
contentOptions[0].selected = true;
contentOptions[0].options[3].selected = true;

const optionsDeep = new MenuOptions([
  {label: 'Deep Menu', options: [
    {value: 'Level 1 Item One'},
    {value: 'Level 1 Item Two'},
    {value: 'Level 1 Item Three', options: [
      {value: 'Level 2 Item One'},
      {value: 'Level 2 Item Two'},
      {value: 'Level 2 Item Three', options: [
        {value: 'Level 3 Item One'},
        {value: 'Level 3 Item Two'},
        {value: 'Level 3 Item Three', options: [
          {value: 'Level 4 Item One'},
          {value: 'Level 4 Item Two'},
          {value: 'Level 4 Item Three', options: [
            {value: 'Level 5 Item One'},
            {value: 'Level 5 Item Two'},
            {value: 'Level 5 Item Three', options: [
              {value: 'Level 6 Item One'},
              {value: 'Level 6 Item Two'},
              {value: 'Level 6 Item Three', options: [
                {value: 'Level 7 Item One'},
                {value: 'Level 7 Item Two'},
                {value: 'Level 7 Item Three'},
              ]},
            ]},
          ]},
        ]},
      ]},
    ]},
  ]}
]);

const contentElements = [
  ['div', {id: 'devs', class: 'vertical'}, [
    ['span', {id: 'dev1'}, 'io-dev 1'],
    ['span', {id: 'dev2'}, 'io-dev 2'],
    ['span', {id: 'dev3'}, 'io-dev 3'],
    ['span', {id: 'dev4'}, 'io-dev 4'],
    ['span', {id: 'dev5'}, 'io-dev 5'],
    ['span', {id: 'dev6'}, 'io-dev 6'],
    ['span', {id: 'dev7'}, 'io-dev 7'],
  ]],
  ['div', {id: 'foos', class: 'vertical'}, [
    ['span', {id: 'foo1'}, 'io-foo 1'],
    ['span', {id: 'foo2'}, 'io-foo 2'],
    ['span', {id: 'foo3'}, 'io-foo 3'],
    ['span', {id: 'foo4'}, 'io-foo 4'],
    ['span', {id: 'foo5'}, 'io-foo 5'],
    ['span', {id: 'foo6'}, 'io-foo 6'],
    ['span', {id: 'foo7'}, 'io-foo 7'],
  ]],
  ['div', {id: 'bazs', class: 'vertical'}, [
    ['span', {id: 'baz1'}, 'io-baz 1'],
    ['span', {id: 'baz2'}, 'io-baz 2'],
    ['span', {id: 'baz3'}, 'io-baz 3'],
    ['span', {id: 'baz4'}, 'io-baz 4'],
    ['span', {id: 'baz5'}, 'io-baz 5'],
    ['span', {id: 'baz6'}, 'io-baz 6'],
    ['span', {id: 'baz7'}, 'io-baz 7'],
  ]],
  ['div', {id: 'bars', class: 'vertical'}, [
    ['span', {id: 'bar1'}, 'io-bar 1'],
    ['span', {id: 'bar2'}, 'io-bar 2'],
    ['span', {id: 'bar3'}, 'io-bar 3'],
    ['span', {id: 'bar4'}, 'io-bar 4'],
    ['span', {id: 'bar5'}, 'io-bar 5'],
    ['span', {id: 'bar6'}, 'io-bar 6'],
    ['span', {id: 'bar7'}, 'io-bar 7'],
  ]],
];

export class IoDemoElements extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        flex-direction: column;
        width: 100%;
        height: 100%;
        flex: 0 0 auto;
        padding: var(--io_spacing);
      }
      :host io-collapsable > div.io-collapsable-content > *:not(:last-child) {
        margin-bottom: var(--io_spacing);
      }
      :host io-collapsable[expanded].fixed-tall > div {
        max-height: 20rem;
        height: 20rem;
      }
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host .contextArea {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--io_bgColorField);
        min-height: 10em;
        min-width: 20em;
      }
      :host io-navigator-scroller,
      :host io-navigator-selector,
      :host io-selector {
        height: 20em;
        width: 20em;
        background-color: var(--io_bgColorField);

      }
      :host .vertical {
        display: flex;
        flex-direction: column;
      }
      :host .vertical > span {
        min-height: 10em;
      }
    `;
  }
  static get Properties() {
    return {
      menuPath: '',
      menuRoot: 0,
      string: 'Hello!',
      number: 1,
      boolean: true,
      array2: [0, 1],
      array3: [0, 1, 2],
      array4: [0, 1, 2, 3],
      vector2: {value: {x: 0, y: 1}},
      vector3: {value: {x: 0, y: 1, z: 2}},
      vector4: {value: {x: 0, y: 1, z: 2, w: 3}},
      rgb: {value: {r: 0, g: 1, b: 0.5}},
      rgba: {value: {r: 1, g: 0.5, b: 1, a: 1}},
      matrix2: [1, 0, 0, 1],
      matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      object: {value: {
        number: 0.5,
        string: 'hello',
        boolean: true,
        object: {
          prop1: 1,
          prop2: 2,
        },
        array: [...Array(32).keys()],
        vector2: [0, 1],
        vector3: [0, 1, 2],
        vector4: [0, 1, 2, 3],
        matrix2: [1, 0, 0, 1],
        matrix3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        matrix4: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      }}
    };
  }
  init() {
    this.template([
      ['io-collapsable', {label: 'io-inputs-demo', expanded: $('expanded-io-inputs-demo'), elements: [
        ['io-inputs-demo', {string: this.bind('string'), number: this.bind('number'), boolean: this.bind('boolean')}],
      ]}],
      ['io-collapsable', {label: 'io-iconset-demo', expanded: $('expanded-io-iconset-demo'), elements: [
        ['io-iconset-demo'],
      ]}],
      ['io-collapsable', {label: 'Sliders', expanded: $('expanded-sliders-basic'), elements: [
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
        ['io-slider', {value: this.bind('number'), min: -1.3, max: 3, step: 1}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 4.3, step: 1}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1, exponent: 3}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.01, exponent: 5}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1, exponent: 0.3}],
        ['io-slider', {value: this.bind('number'), min: 2, max: 0, step: 0.1, exponent: 0.1}],
        ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
        ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}],
        ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}],
        ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
        ['io-number-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
        ['div', {class: 'row'}, [
          ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}],
          ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}],
          ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.02, exponent: 5.5}],
          ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
        ]],
        ['div', {class: 'row'}, [
          ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}],
          ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}],
          ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
          ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
        ]],
      ]}],
      ['io-collapsable', {label: 'Color', expanded: $('expanded-demo-color'), elements: [
        ['io-color-rgba', {value: this.rgba}],
        ['io-color-rgba', {value: this.rgb}],
        ['io-color-slider', {value: this.rgba, channel: 'r', step: 0.05}],
        ['io-color-slider', {value: this.rgba, channel: 'g', step: 0.05}],
        ['io-color-slider', {value: this.rgba, channel: 'b', step: 0.05}],
        ['io-color-slider', {value: this.rgba, channel: 'a'}],
        ['io-color-slider', {value: this.rgba, channel: 'h'}],
        ['io-color-slider', {value: this.rgba, channel: 's'}],
        ['io-color-slider', {value: this.rgba, channel: 'v'}],
        ['io-color-slider', {value: this.rgba, channel: 'l'}],
        ['div', {class: 'row'}, [
          ['io-color-slider', {value: this.rgba, channel: 'hs'}],
          ['io-color-slider', {value: this.rgba, channel: 'sl', step: 0.1}],
          ['io-color-slider', {value: this.rgba, vertical: true, channel: 'v'}],
          ['io-color-slider', {value: this.rgba, vertical: true, channel: 'l'}],          
        ]],
        ['div', {class: 'row'}, [
          ['io-color-panel', {expanded: true, value: this.rgba}]
        ]],
      ]}],
      ['io-collapsable', {label: 'Vectors', expanded: $('expanded-demo-vector'), elements: [
        ['io-vector', {value: this.array2}],
        ['io-vector', {value: this.array3}],
        ['io-vector', {value: this.array3, linkable: true}],
        ['io-vector', {value: this.array4}],
        ['io-vector', {value: this.vector2}],
        ['io-vector', {value: this.vector3}],
        ['io-vector', {value: this.vector3, linkable: true}],
        ['io-vector', {value: this.vector4}],
        ['io-vector', {value: this.rgb}],
        ['io-vector', {value: this.rgba}],
        ['io-matrix', {value: this.matrix2}],
        ['io-matrix', {value: this.matrix3}],
        ['io-matrix', {value: this.matrix4}],
      ]}],
      ['io-collapsable', {label: 'Objects', expanded: $('expanded-demo-objects'), elements: [
        ['div', {class: 'row'}, [
          ['io-properties', {
            value: this.object,
          }],
          ['io-properties', {
            value: this.object,
            config: {
              'number': ['io-slider', {step: 0.1}],
              'vector2': ['io-vector'],
              'vector3': ['io-vector'],
              'vector4': ['io-vector'],
              'matrix2': ['io-matrix'],
              'matrix3': ['io-matrix'],
              'matrix4': ['io-matrix'],
            },
          }],
          ['io-properties', {
            value: this.object,
            properties: ['number', 'string', 'boolean'],
            widget: ['io-field', {label: 'Widget Element'}],
            // TODO: investigate listener warning
            config: {
              'boolean': ['io-switch'],
              'number': ['io-option-menu', {options: new MenuOptions([
                {label: 'zero', value: 0},
                {label: 'half', value: 0.5},
                {label: 'one', value: 1},
              ])}],
            },
          }],
        ]],
        ['div', {class: 'row'}, [
          ['io-object', {
            value: this.object,
          }],
          ['io-object', {
            value: this.object,
            expanded: true,
            widget: ['io-field', {label: 'Widget Element'}],
            properties: ['number', 'string', 'boolean'],
          }],
          ['io-object', {
            value: this.object,
            expanded: true,
            properties: ['number'],
            config: {'number': ['io-slider', {step: 0.1}]}
          }],
        ]],
        ['div', {class: 'row'}, [
          ['io-inspector', {
            value: this.object,
            // TODO: this.object.object displays broken "number" slider. Investigate!
            groups: {
              'Object|properties': ['number', 'string', 'boolean', 'object', 'array'],
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
        ]
      }],
      ['io-collapsable', {label: 'Content', expanded: $('expanded-demo-content'), elements: [
        ['io-navigator-scroller', {
          menu: 'left',
          collapseWidth: 100,
          options: contentOptions[0].options,
          elements: [contentElements[0]]
        }],
        ['io-navigator-selector', {
          menu: 'top',
          depth: 0,
          options: contentOptions,
          elements: contentElements
        }],
        ['io-selector', {
          elements: contentElements,
          options: contentOptions,
        }]
      ]}],
      ['io-collapsable', {label: 'Menus', expanded: $('expanded-demo-menus'), elements: [
        ['io-menu-tree', {
          options: options,
        }],
        ['io-menu-item', {label: 'menu item', item: new MenuItem('item')}],
        ['io-menu-item', {label: 'menu item', item: new MenuItem({
          selected: true,
          value: 'value',
          hint: 'selected',
          label: 'menu item label',
          icon: 'io:code',
        })}],
        ['io-menu-item', {label: 'menu item', item: new MenuItem({
          selected: false,
          value: 'value',
          hint: 'not selected',
          label: 'menu item label',
          icon: 'io:circle_fill_plus',
        })}],
        ['io-menu-options', {
          horizontal: true,
          searchable: true,
          options: new MenuOptions(numberItems, {
            first: this.bind('menuRoot')
          }),
        }],
        ['io-menu-options', {
          horizontal: true,
          noPartialCollapse: true,
          options: new MenuOptions(numberItems, {
            first: this.bind('menuRoot')
          }),
        }],
        ['div', {class: 'row'}, [
          ['io-menu-options', {
            searchable: true,
            options: new MenuOptions(numberItems, {
              first: this.bind('menuRoot')
            }),
          }],
          ['io-menu-options', {
            options: new MenuOptions([...numberItems].reverse(), {
              first: this.bind('menuRoot')
            }),
          }],
          ['io-menu-options', {
            options: new MenuOptions([
              new MenuItem({value: 0, label: 'zero', hint: 'Number(0)', icon: 'io:layers'}),
              new MenuItem({value: 1, label: 'one', hint: 'Number(1)', icon: 'io:layers'}),
              new MenuItem({value: 2, label: 'two', hint: 'Number(2)', icon: 'io:box'}),
              new MenuItem({value: 3, label: 'three', hint: 'Number(3)', icon: 'io:film'}),
            ], {
              first: this.bind('menuRoot')
            }),
          }],
          ['io-menu-options', {
            options: optionsDeep,
          }],
        ]],
        ['div', {class: 'contextArea'}, [
          ['span', 'Context Area'],
          ['io-context-menu', {
            options: new MenuOptions([...optionsDeep, ...numberItems, ...options]),
          }],
          ['io-context-menu', {
            options: new MenuOptions([...options]),
            button: 1,
          }],
          ['io-context-menu', {
            options: new MenuOptions([...numberItems]),
            button: 2,
          }],
        ]],
        ['io-demo-menu-model', {name: 'Menu Model'}],
      ]}],
    ]);
  }
}

Register(IoDemoElements);
