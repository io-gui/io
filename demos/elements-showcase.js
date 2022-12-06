import { IoElement, RegisterIoElement, MenuOptions, MenuItem } from '../build/iogui.js';

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

const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
  'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
  'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
const hearts = ['❤️', '💚', '💙', '💜', '🧡', '💔', '💖', '🖤', '💗', '💘'];
const longOptions = [];
for (let i = 0; i < 100; i++) {
  const r1 = words[Math.floor(Math.random() * 20)];
  const r2 = words[Math.floor(Math.random() * 20)];
  const r3 = words[Math.floor(Math.random() * 20)];
  const h = hearts[Math.floor(Math.random() * 10)] || '';
  longOptions.push(new MenuItem({icon: h, label: r1 + ' ' + r2 + ' ' + i, value: r1 + ' ' + r2, hint: r3}));
}

export class IoDemoElementsShowcase extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        background: var(--io-background-color);
        color: var(--io-color);
      }
      :host > div > io-label {
        display: block;
        background: var(--io-background-color-light);
        padding: var(--io-spacing);
        height: auto;
      }
      :host > div > div {
        display: flex;
        /* width: 425px; */
        margin: var(--io-spacing) 0;
        padding: var(--io-spacing) 0;
        border: var(--io-border);
        border-color: rgba(128, 128, 128, .125);
      }
      :host > div > div.tall {
        height: var(--io-field-height4);
      }
      :host > div > div > :nth-child(1) {
        flex: 0 0 160px;
        text-align: right;
        margin-right: var(--io-spacing);
      }
      :host > div > div > * {
        margin-left: var(--io-spacing);
      }
      :host > div > div > io-label,
      :host > div > div > io-icon {
        margin-top: var(--io-spacing);
      }
      :host > div > div > io-menu-options:not([horizontal]) {
        flex: 0 1 auto;
      }
    `;
  }
  static get Properties() {
    return {
      string: 'zero',

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
  constructor(props) {
    super(props);
    this.template([
      ['div', [
        ['io-label', {label: 'Basic Editors'}],
        ['div', [
          ['io-label', {label: '<io-icon>'}],
          ['io-icon', {icon: 'icons:io'}],
          ['io-icon', {icon: 'icons:io', stroke: true}],
          ['io-icon', {icon: 'ℹ️'}],
          ['io-icon', {icon: '❤️'}],
        ]],
        ['div', [
          ['io-label', {label: '<io-field>'}],
          ['io-field', {value: this.bind('string'), appearance: 'outset'}],
          ['io-field', {value: this.bind('string'), appearance: 'inset'}],
          ['io-field', {value: this.bind('string')}],
          ['io-field', {value: this.bind('string'), appearance: 'neutral'}],
          ['io-field', {value: this.bind('string'), selected: this.bind('boolean')}],
          ['io-field', {value: this.bind('string'), invalid: true}],
        ]],
        ['div', [
          ['io-label', {label: '<io-string>'}],
          ['io-string', {value: this.bind('string')}],
          ['io-string', {value: this.bind('string'), live: true}],
        ]],
        ['div', [
          ['io-label', {label: '<io-number>'}],
          ['io-number', {value: this.bind('number')}],
          ['io-number', {ladder: true, value: this.bind('number')}],
          ['io-number', {conversion: 2, value: this.bind('number')}],
        ]],
        ['div', [
          ['io-label', {label: '<io-boolean>'}],
          ['io-boolean', {value: this.bind('boolean')}],
          ['io-boolean', {value: this.bind('boolean'), true: 'icons:box_fill_checked', false: 'icons:box'}],
        ]],
        ['div', [
          ['io-label', {label: '<io-switch>'}],
          ['io-switch', {value: this.bind('boolean')}],
        ]],
        ['div', [
          ['io-label', {label: '<io-button>'}],
          ['io-button', {label: 'Button', icon: 'icons:check'}],
          ['io-button', {label: 'Button', icon: 'icons:check', appearance: 'inset'}],
          ['io-button', {label: 'Button', icon: 'icons:check', appearance: 'flush'}],
          ['io-button', {label: 'Button', icon: 'icons:check', appearance: 'neutral'}],
        ]],
      ]],
      ['div', [
        ['io-label', {label: 'Sliders'}],
        ['div', [
          ['io-label', {label: '<io-slider>'}],
          ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider', {value: this.bind('number'), min: -0.3, max: 2, step: 1}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider', {value: this.bind('number'), min: 0, max: 2.3, step: 1}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 3}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 0.3}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider', {value: this.bind('number'), min: 2, max: 0, step: 0.05, exponent: 0.3}],
        ]],
        ['div', [
          ['io-label', {label: '<number-slider>'}],
          ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
        ]],
        ['div', [
          ['io-label', {label: '<slider-range>'}],
          ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}],
        ]],
        ['div', [
          ['io-label', {label: '<number-slider-range>'}],
          ['io-number-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
        ]],
        ['div', {class: 'tall'}, [
          ['io-label', {label: '<io-slider-2d>'}],
          ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}],
          ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}],
          ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.2}],
          ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
        ]],
        ['div', {class: 'tall'}, [
          ['io-label', {label: ' '}],
          ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}],
          ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}],
          ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
          ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
        ]],
      ]],
      ['div', [
        ['io-label', {label: 'Color Editors'}],
        ['div', [
          ['io-label', {label: '<color-rgba>'}],
          ['io-color-rgba', {value: this.rgba}],
        ]],
        ['div', [
          ['io-label', {label: '<color-rgba> [rgb]'}],
          ['io-color-rgba', {value: this.rgb}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [r]'}],
          ['io-color-slider', {value: this.rgba, channel: 'r'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [g]'}],
          ['io-color-slider', {value: this.rgba, channel: 'g'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [b]'}],
          ['io-color-slider', {value: this.rgba, channel: 'b'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [a]'}],
          ['io-color-slider', {value: this.rgba, channel: 'a'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [h]'}],
          ['io-color-slider', {value: this.rgba, channel: 'h'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [s]'}],
          ['io-color-slider', {value: this.rgba, channel: 's'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [v]'}],
          ['io-color-slider', {value: this.rgba, channel: 'v'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [l]'}],
          ['io-color-slider', {value: this.rgba, channel: 'l'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [c]'}],
          ['io-color-slider', {value: this.rgba, channel: 'c'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [m]'}],
          ['io-color-slider', {value: this.rgba, channel: 'm'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [y]'}],
          ['io-color-slider', {value: this.rgba, channel: 'y'}],
        ]],
        ['div', [
          ['io-label', {label: '<color-slider> [k]'}],
          ['io-color-slider', {value: this.rgba, channel: 'k'}],
        ]],
        ['div', {class: 'tall'}, [
          ['io-label', {label: 'slider-2d + [vert]'}],
          ['io-color-slider', {value: this.rgba, channel: 'hs'}],
          ['io-color-slider', {value: this.rgba, channel: 'sv'}],
          ['io-color-slider', {value: this.rgba, vertical: true, channel: 'v'}],
          ['io-color-slider', {value: this.rgba, vertical: true, channel: 'l'}],          
        ]],
        ['div', {class: 'tall'}, [
          ['io-label', {label: '<color-panel>'}],
          ['io-color-panel', {expanded: true, value: this.rgba}]
        ]],
      ]],
      ['div', [
        ['io-label', {label: 'Vector Editors'}],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.array2}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.array3}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.array3, linkable: true}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.array4}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.vector2}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.vector3}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.vector3, linkable: true}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.vector4}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.rgb}],
        ]],
        ['div', [
          ['io-label', {label: '<io-vector>'}],
          ['io-vector', {value: this.rgba}],
        ]],
        ['div', [
          ['io-label', {label: '<io-matrix>'}],
          ['io-matrix', {value: this.matrix2}],
        ]],
        ['div', [
          ['io-label', {label: '<io-matrix>'}],
          ['io-matrix', {value: this.matrix3}],
        ]],
        ['div', [
          ['io-label', {label: '<io-matrix>'}],
          ['io-matrix', {value: this.matrix4}],
        ]],
      ]],
      ['div', [
        ['io-label', {label: 'Object Editors'}],
        ['div', [
          ['io-label', {label: 'properties'}],
          ['io-properties', {
            value: this.object,
            // properties: ['number', 'string', 'boolean'],
            config: {'number': ['io-slider', {step: 0.1}]}
          }],
        ]],
        ['div', [
          ['io-label', {label: 'object [filtered]'}],
          ['io-object', {
            value: this.object,
            expanded: true,
            slotted: ['io-field', {label: 'Slotted Element'}],
            properties: ['number', 'string', 'boolean'],
          }],
        ]],
        ['div', [
          ['io-label', {label: 'object [configured]'}],
          ['io-object', {
            value: this.object,
            expanded: true,
            properties: ['number'],
            config: {'number': ['io-slider', {step: 0.1}]}
          }],
        ]],
        ['div', [
          ['io-label', {label: 'inspector'}],
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
        ]],
      ]],
      ['div', [
        ['io-label', {label: 'Menus'}],
        ['div', [
          ['io-label', {label: '<io-menu-item>'}],
          ['io-menu-item', {label: 'menu item', item: new MenuItem({
            selected: this.bind('boolean'),
            value: 'value',
            hint: 'hint',
            label: 'menu item label',
            icon: '💚',
          })}],
        ]],
        ['div', [
          ['io-label', {label: '<io-menu-options>'}],
          ['io-menu-options', {
            searchable: true,
            options: new MenuOptions(numberItems, {
              root: this.bind('menuRoot')
            }),
          }],
          ['io-menu-options', {
            options: new MenuOptions([...numberItems].reverse(), {
              root: this.bind('menuRoot')
            }),
          }],
          ['io-menu-options', {
            options: new MenuOptions([
              new MenuItem({value: 0, label: 'zero', hint: 'Number(0)', icon: 'icons:layers'}),
              new MenuItem({value: 1, label: 'one', hint: 'Number(1)', icon: 'icons:layers'}),
              new MenuItem({value: 2, label: 'two', hint: 'Number(2)', icon: 'icons:box'}),
              new MenuItem({value: 3, label: 'three', hint: 'Number(3)', icon: 'icons:film'}),
            ], {
              root: this.bind('menuRoot')
            }),
          }],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-menu-options', {
            horizontal: true,
            searchable: true,
            options: new MenuOptions(numberItems, {
              root: this.bind('menuRoot')
            }),
          }],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-menu-options', {
            horizontal: true,
            noPartialCollapse: true,
            options: new MenuOptions(numberItems, {
              root: this.bind('menuRoot')
            }),
          }],
        ]],
        ['div', [
          ['io-label', {label: ' '}],
          ['io-menu-options', {
            options: new MenuOptions([
              new MenuItem({value: 'Numbers', sellect: 'none', options: new MenuOptions(numberItems)}),
              // TODO: Selecting children of "Words" should not deselect children of "Numbers"
              new MenuItem({value: 'Words', options: new MenuOptions(longOptions)}),
              new MenuItem({value: 'Suboptions', options: new MenuOptions(options)}),
            ], {
              // TODO: when binding two menu trees with both `root` and `path` properties, it is important that `MenuOptions.updatePaths > setProperties`
              // updates the `path` property before the `root`. Otherwise, the menu binding will be broken!
              // TODO: create a test for this edge-case.
              path: this.bind('menuPath'),
              // root: this.bind('menuRoot'),
            }),
          }],
        ]],
        ['div', [
          ['io-label', {label: '<io-option-menu>'}],
          ['io-option-menu', {
            options: new MenuOptions([
              {label: 'negative one', value: -1},
              ...numberItems,
              {label: 'leet', value: 1337},
            ]),
            value: this.bind('menuRoot')
          }],
          ['io-option-menu', {options: new MenuOptions([ -1, 0, 0.5, 1, 2, 3, 4, 1337]), value: this.bind('menuRoot')}],
        ]],
        // ['div', [
        //   ['io-label', {label: '<io-context-menu>'}],
        //   ['span', 'click for menu'],
        //   ['io-context-menu', {options: menuoptions, position: 'pointer', button: 0}],
        // ]],
        // ['div', [
        //   ['io-label', {label: ' '}],
        //   ['span', 'right-click for menu'],
        //   ['io-context-menu', {options: menuoptions, position: 'pointer', button: 2}],
        // ]],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElementsShowcase);
