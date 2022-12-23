import { RegisterIoElement, IoElement, IoStorage, MenuOptions, MenuItem } from '../build/iogui.js';
import './menu-model.js';
import './theme-editor.js';

function $(key) {
  return new IoStorage({key: key, value: false, storage: 'local'})
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

// const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
//   'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
//   'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
// const hearts = ['❤️', '💚', '💙', '💜', '🧡', '💔', '💖', '🖤', '💗', '💘'];
// const longOptions = [];
// for (let i = 0; i < 100; i++) {
//   const r1 = words[Math.floor(Math.random() * 20)];
//   const r2 = words[Math.floor(Math.random() * 20)];
//   const r3 = words[Math.floor(Math.random() * 20)];
//   const h = hearts[Math.floor(Math.random() * 10)] || '';
//   longOptions.push(new MenuItem({icon: h, label: r1 + ' ' + r2 + ' ' + i, value: r1 + ' ' + r2, hint: r3}));
// }

const contentOptions = new MenuOptions([
  {value: 'devs', options: [
    {value: 'dev1', mode: 'anchor'},
    {value: 'dev2', mode: 'anchor'},
    {value: 'dev3', mode: 'anchor'},
    {value: 'dev4', mode: 'anchor'},
    {value: 'dev5', mode: 'anchor'},
    {value: 'dev6', mode: 'anchor'},
    {value: 'dev7', mode: 'anchor'},
  ]},
  {value: 'foos', options: [
    {value: 'foo1', mode: 'anchor'},
    {value: 'foo2', mode: 'anchor'},
    {value: 'foo3', mode: 'anchor'},
    {value: 'foo4', mode: 'anchor'},
    {value: 'foo5', mode: 'anchor'},
    {value: 'foo6', mode: 'anchor'},
    {value: 'foo7', mode: 'anchor'},
  ]},
  {value: 'bazs', options: [
    {value: 'baz1', mode: 'anchor'},
    {value: 'baz2', mode: 'anchor'},
    {value: 'baz3', mode: 'anchor'},
    {value: 'baz4', mode: 'anchor'},
    {value: 'baz5', mode: 'anchor'},
    {value: 'baz6', mode: 'anchor'},
    {value: 'baz7', mode: 'anchor'},
  ]},
  {value: 'bars', options: [
    {value: 'bar1', mode: 'anchor'},
    {value: 'bar2', mode: 'anchor'},
    {value: 'bar3', mode: 'anchor'},
    {value: 'bar4', mode: 'anchor'},
    {value: 'bar5', mode: 'anchor'},
    {value: 'bar6', mode: 'anchor'},
    {value: 'bar7', mode: 'anchor'},
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

const elements = [
  ['div', {id: 'devs'}, [
    ['span', {id: 'dev1'}, 'io-dev 1'],
    ['span', {id: 'dev2'}, 'io-dev 2'],
    ['span', {id: 'dev3'}, 'io-dev 3'],
    ['span', {id: 'dev4'}, 'io-dev 4'],
    ['span', {id: 'dev5'}, 'io-dev 5'],
    ['span', {id: 'dev6'}, 'io-dev 6'],
    ['span', {id: 'dev7'}, 'io-dev 7'],
  ]],
  ['div', {id: 'foos'}, [
    ['span', {id: 'foo1'}, 'io-foo 1'],
    ['span', {id: 'foo2'}, 'io-foo 2'],
    ['span', {id: 'foo3'}, 'io-foo 3'],
    ['span', {id: 'foo4'}, 'io-foo 4'],
    ['span', {id: 'foo5'}, 'io-foo 5'],
    ['span', {id: 'foo6'}, 'io-foo 6'],
    ['span', {id: 'foo7'}, 'io-foo 7'],
  ]],
  ['div', {id: 'bazs'}, [
    ['span', {id: 'baz1'}, 'io-baz 1'],
    ['span', {id: 'baz2'}, 'io-baz 2'],
    ['span', {id: 'baz3'}, 'io-baz 3'],
    ['span', {id: 'baz4'}, 'io-baz 4'],
    ['span', {id: 'baz5'}, 'io-baz 5'],
    ['span', {id: 'baz6'}, 'io-baz 6'],
    ['span', {id: 'baz7'}, 'io-baz 7'],
  ]],
  ['div', {id: 'bars'}, [
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
      }
      :host > io-collapsable {
        margin: var(--iotSpacing);
        margin-bottom: 0;
      }
      :host io-collapsable[expanded].fixed-tall > div {
        max-height: 20rem;
        height: 20rem;
      }
      :host io-collapsable.row > div {
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
      }
      :host io-collapsable > div > io-collapsable:not(:last-of-type) {
        margin-bottom: var(--iotSpacing);
      }
      :host > io-collapsable[expanded] {
        /* flex-basis: 100%; */
      }
      :host io-collapsable > div.io-collapsable-content > * {
        margin: var(--iotSpacing) !important;
      }
      :host span {
        display: block;
        padding-bottom: 10em;
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
      ['io-collapsable', {label: 'Theme Editor', expanded: $('expanded-demo-theme-editor'), elements: [
        ['io-demo-theme-editor'],
      ]}],
      ['io-collapsable', {label: 'Basic Elements', expanded: $('expanded-demo-basic'), elements: [
        ['io-collapsable', {label: 'io-icon', class: 'row', expanded: $('expanded-demo-basic-1'),
          elements: [
            ['io-icon', {icon: 'icons:io'}],
            ['io-icon', {icon: 'icons:io', stroke: true}],
            ['io-icon', {icon: 'ℹ️'}],
            ['io-icon', {icon: '❤️'}],
          ]
        }],
        ['io-collapsable', {label: 'io-field', class: 'row', expanded: $('expanded-demo-basic-2'),
          elements: [
            ['io-field', {value: this.bind('string'), appearance: 'outset'}],
            ['io-field', {value: this.bind('string'), appearance: 'inset'}],
            ['io-field', {value: this.bind('string')}],
            ['io-field', {value: this.bind('string'), appearance: 'neutral'}],
            ['io-field', {value: this.bind('string'), selected: this.bind('boolean')}],
            ['io-field', {value: this.bind('string'), invalid: true}],
          ]
        }],
        ['io-collapsable', {label: 'io-string', class: 'row', expanded: $('expanded-demo-basic-3'),
          elements: [
            ['io-string', {value: this.bind('string')}],
            ['io-string', {value: this.bind('string'), live: true}],
          ]
        }],
        ['io-collapsable', {label: 'io-number', class: 'row', expanded: $('expanded-demo-basic-4'),
          elements: [
            ['io-number', {value: this.bind('number')}],
            ['io-number', {ladder: true, value: this.bind('number')}],
            ['io-number', {conversion: 2, value: this.bind('number')}],
          ]
        }],
        ['io-collapsable', {label: 'io-boolean', class: 'row', expanded: $('expanded-demo-basic-5'),
          elements: [
            ['io-boolicon', {value: this.bind('boolean'), true: 'icons:box_fill_checked', false: 'icons:box'}],
            ['io-boolean', {value: this.bind('boolean')}],
          ]
        }],
        ['io-collapsable', {label: 'io-switch', expanded: $('expanded-demo-basic-6'),
          elements: [
            ['io-switch', {value: this.bind('boolean')}],
          ]
        }],
        ['io-collapsable', {label: 'io-button', class: 'row', expanded: $('expanded-demo-basic-7'),
            elements: [
              ['io-button', {label: 'Button', icon: 'icons:check'}],
              ['io-button', {label: 'Button', icon: 'icons:check', appearance: 'inset'}],
              ['io-button', {label: 'Button', icon: 'icons:check', appearance: 'flush'}],
              ['io-button', {label: 'Button', icon: 'icons:check', appearance: 'neutral'}],
            ]
          }],
      ]}],
      ['io-collapsable', {label: 'Basic Sliders', expanded: $('expanded-sliders-basic'), elements: [
        ['io-collapsable', {label: 'io-slider', expanded: $('expanded-sliders-basic-1'),
          elements: [
            ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
            ['io-slider', {value: this.bind('number'), min: -0.3, max: 2, step: 1}],
            ['io-slider', {value: this.bind('number'), min: 0, max: 2.3, step: 1}],
            ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 3}],
            ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 0.3}],
            ['io-slider', {value: this.bind('number'), min: 2, max: 0, step: 0.05, exponent: 0.3}],
          ]
        }],
        ['io-collapsable', {label: 'io-slider-range', expanded: $('expanded-sliders-basic-2'), elements: [
          ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
          ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}],
          ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}],
        ]}],
        ['io-collapsable', {label: 'io-number-slider and io-number-slider-range', expanded: $('expanded-sliders-basic-3'), elements: [
          ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
          ['io-number-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
        ]}],
        ['io-collapsable', {label: 'io-slider-2d and io-slider[vertical]', class: 'row', expanded: $('expanded-sliders-basic-4'), elements: [
          ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}],
          ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}],
          ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.2}],
          ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
          ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}],
          ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}],
          ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
          ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
        ]}],
      ]}],
      ['io-collapsable', {label: 'Color Sliders', expanded: $('expanded-demo-color'), elements: [
        ['io-collapsable', {label: 'io-color-slider', expanded: $('expanded-demo-color-1'), elements: [
          ['io-color-rgba', {value: this.rgba}],
          ['io-color-rgba', {value: this.rgb}],
          ['io-color-slider', {value: this.rgba, channel: 'r'}],
          ['io-color-slider', {value: this.rgba, channel: 'g'}],
          ['io-color-slider', {value: this.rgba, channel: 'b'}],
          ['io-color-slider', {value: this.rgba, channel: 'a'}],
          ['io-color-slider', {value: this.rgba, channel: 'h'}],
          ['io-color-slider', {value: this.rgba, channel: 's'}],
          ['io-color-slider', {value: this.rgba, channel: 'v'}],
          ['io-color-slider', {value: this.rgba, channel: 'l'}],
          ['io-color-slider', {value: this.rgba, channel: 'c'}],
          ['io-color-slider', {value: this.rgba, channel: 'm'}],
          ['io-color-slider', {value: this.rgba, channel: 'y'}],
          ['io-color-slider', {value: this.rgba, channel: 'k'}],
        ]}],
        ['io-collapsable', {label: 'io-color-slider (2D and vertical)', class: 'row', expanded: $('expanded-demo-color-2'), elements: [
          ['io-color-slider', {value: this.rgba, channel: 'hs'}],
          ['io-color-slider', {value: this.rgba, channel: 'sv'}],
          ['io-color-slider', {value: this.rgba, vertical: true, channel: 'v'}],
          ['io-color-slider', {value: this.rgba, vertical: true, channel: 'l'}],          
          ['io-color-panel', {expanded: true, value: this.rgba}]
        ]}],
      ]}],
      ['io-collapsable', {label: 'Vector Editors', expanded: $('expanded-demo-vector'), elements: [
        ['io-collapsable', {label: 'io-vector', expanded: $('expanded-demo-vector-1'), elements: [
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
        ]}],
        ['io-collapsable', {label: 'io-matrix', expanded: $('expanded-demo-vector-2'), elements: [
          ['io-matrix', {value: this.matrix2}],
          ['io-matrix', {value: this.matrix3}],
          ['io-matrix', {value: this.matrix4}],
        ]}],
      ]}],
      ['io-collapsable', {label: 'Content Elements', expanded: $('expanded-demo-content'), elements: [
        ['io-collapsable', {label: 'io-navigator with menu:"left" mode:"select-and-anchor"', class: 'fixed-tall', expanded: $('expanded-demo-content-1'), elements: [
          ['io-navigator', {
            menu: 'left',
            mode: 'select-and-anchor',
            elements: elements,
            options: contentOptions,
          }]
        ]}],
        ['io-collapsable', {label: 'io-navigator with mode:"scroll" and with menu:"right"', class: 'fixed-tall', expanded: $('expanded-demo-content-2'), elements: [
          ['io-navigator', {
            menu: 'right',
            mode: 'scroll',
            options: contentOptions[0].options,
            elements: [elements[0]]
          }]
        ]}],
        ['io-collapsable', {label: 'io-navigator with with menu:"top" and depth=0', class: 'fixed-tall', expanded: $('expanded-demo-content-3'), elements: [
          ['io-navigator', {
            menu: 'top',
            depth: 0,
            options: contentOptions,
            elements: elements
          }]
        ]}],
        ['io-collapsable', {label: 'io-selector', class: 'fixed-tall', expanded: $('expanded-demo-content-4'), elements: [
          ['io-selector', {
            elements: elements,
            options: contentOptions,
          }]
        ]}],
        ['io-collapsable', {label: 'io-scroller', class: 'fixed-tall', expanded: $('expanded-demo-content-5'), elements: [['io-scroller', {
            options: contentOptions[0].options,
          }, [elements[0]]]]
        }],
        ['io-collapsable', {label: 'scrollable content', class: 'fixed-tall', expanded: $('expanded-demo-content-6'), elements: [elements[0]] }],
      ]}],
      ['io-collapsable', {label: 'Object Editors', expanded: $('expanded-demo-objects'), elements: [
          ['io-collapsable', {label: 'io-properties', direction: 'row', expanded: $('expanded-demo-objects-1'), elements: [
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
              config: {
                'boolean': ['io-switch'],
                'number': ['io-option-menu', {options: new MenuOptions([
                  {label: 'zero', value: 0},
                  {label: 'half', value: 0.5},
                  {label: 'one', value: 1},
                ])}],
              },
            }],
          ]}],
          ['io-collapsable', {label: 'io-object', direction: 'row', expanded: $('expanded-demo-objects-2'), elements: [
            ['io-object', {
              value: this.object,
            }],
            ['io-object', {
              value: this.object,
              expanded: true,
              slotted: ['io-field', {label: 'Slotted Element'}],
              properties: ['number', 'string', 'boolean'],
            }],
            ['io-object', {
              value: this.object,
              expanded: true,
              properties: ['number'],
              config: {'number': ['io-slider', {step: 0.1}]}
            }],
          ]}],
          ['io-collapsable', {label: 'io-inspector', expanded: $('expanded-demo-objects-3'), elements: [
            ['io-inspector', {
              value: this.object,
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
          ]}],
        ]
      }],
      ['io-collapsable', {label: 'Menus', expanded: $('expanded-demo-menus'), elements: [
        ['io-collapsable', {label: 'MenuOptions and MenuItem select demo', expanded: $('expanded-demo-menu-model-0'), elements: [
          ['io-demo-menu-model', {name: 'Menu Model'}],
          // TODO: implement import
          // ['io-demo-menu-model', {name: 'Menu Model', import: './demos/menu-model.js'}],
        ]}],             
        ['io-collapsable', {label: 'io-menu-tree', expanded: $('expanded-demo-menus-1'), elements: [
          ['io-menu-tree', {
            options: options,
          }]
        ]}],
        ['io-collapsable', {label: 'io-menu-item', expanded: $('expanded-demo-menus-2'), elements: [
          ['io-menu-item', {label: 'menu item', item: new MenuItem({
            selected: this.bind('boolean'),
            value: 'value',
            hint: 'hint',
            label: 'menu item label',
            icon: '💚',
          })}],
        ]}],
        ['io-collapsable', {label: 'io-menu-options', class: 'row', expanded: $('expanded-demo-menus-3'), elements: [
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
              new MenuItem({value: 0, label: 'zero', hint: 'Number(0)', icon: 'icons:layers'}),
              new MenuItem({value: 1, label: 'one', hint: 'Number(1)', icon: 'icons:layers'}),
              new MenuItem({value: 2, label: 'two', hint: 'Number(2)', icon: 'icons:box'}),
              new MenuItem({value: 3, label: 'three', hint: 'Number(3)', icon: 'icons:film'}),
            ], {
              first: this.bind('menuRoot')
            }),
          }],
          ['io-menu-options', {
            options: optionsDeep,
          }],
        ]}],
        ['io-collapsable', {label: 'io-menu-options [horizontal]', expanded: $('expanded-demo-menus-4'), elements: [
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
        ]}],
        ['io-collapsable', {label: 'io-context-menu', class: 'fixed-tall', expanded: $('expanded-demo-menus-r'), elements: [
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
        ]}],
      ]}],
    ]);
  }
}

RegisterIoElement(IoDemoElements);
