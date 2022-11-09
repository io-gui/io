import { IoElement, RegisterIoElement, Options, Item } from '../build/iogui.js';

const suboptions = new Options();
const options = new Options([
  {label: 'Red', icon: '❤️', options: [{value: 'Red1'}, {value: 'Red2'}, {value: 'Red3'}]},
  {label: 'Green', icon: '💚', options: [{value: 'Green1'}, {value: 'Green2'}, {value: 'Green3'}]},
  {label: 'Blue', icon: '💙', options: [{value: 'Blue1'}, {value: 'Blue2'}, {value: 'Blue3'}]},
  {label: 'Numbers', options: [
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'five', value: 5},
  ]},
  {label: 'Suboptions', options: suboptions},
]);
suboptions.push(...[
  {label: 'Hearts', options: options},
  {label: 'suboption one', options: options},
  {label: 'suboption two', options: options},
  {label: 'suboption three', options: options},
]);

const option = new Item({
  label: 'Hearts',
  icon: '💕',
  hint: 'colors',
  options: options,
});

const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
  'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
  'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
const hearts = ['❤️', '💚', '💙', '💜', '🧡', '💔', '💖', '🖤', '💗', '💘'];
const longOptions = [];
for (let i = 0; i < 100; i++) {
  const r1 = words[Math.floor(Math.random() * 20)];
  const r2 = words[Math.floor(Math.random() * 20)];
  const r3 = words[Math.floor(Math.random() * 20)];
  const i = hearts[Math.floor(Math.random() * 10)] || '';
  longOptions.push(new Item({icon: i, label: r1 + ' ' + r2, value: r1 + ' ' + r2, hint: r3}));
}

const menuoptions = new Options([
  {label: 'Long Menu', options: longOptions},
  ...options,
]);

export class IoDemoElements extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host .warning {
        color: tomato;
        font-size: 2em;
        padding: 2em;
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
        flex: 0 0 140px;
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
    `;
  }
  static get Properties() {
    return {
      string: 'Hello IoGUI!',
      number: 1,
      boolean: false,
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
      // ['div', [
      //   ['div', [
      //     ['io-label', {label: 'icon'}],
      //     ['io-icon', {icon: 'icons:io'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'icon [stroke]'}],
      //     ['io-icon', {icon: 'icons:io', stroke: true}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'field'}],
      //     ['io-field', {value: this.bind('string')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'string'}],
      //     ['io-string', {value: this.bind('string')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'string [live]'}],
      //     ['io-string', {value: this.bind('string'), live: true}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'number'}],
      //     ['io-number', {value: this.bind('number')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'number [ladder]'}],
      //     ['io-number', {ladder: true, value: this.bind('number')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'number [x2]'}],
      //     ['io-number', {conversion: 2, value: this.bind('number')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'boolean'}],
      //     ['io-boolean', {value: this.bind('boolean')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'boolean [icon]'}],
      //     ['io-boolean', {value: this.bind('boolean'), true: 'icons:box_fill_checked', false: 'icons:box'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'switch'}],
      //     ['io-switch', {value: this.bind('boolean')}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'button'}],
      //     ['io-button', {label: 'Button', icon: 'icons:check'}],
      //   ]],
      // ]],
      // ['div', [
      //   ['div', [
      //     ['io-label', {label: 'slider'}],
      //     ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider [alt]'}],
      //     ['io-slider', {value: this.bind('number'), min: -0.3, max: 2, step: 1}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider [alt]'}],
      //     ['io-slider', {value: this.bind('number'), min: 0, max: 2.3, step: 1}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider [exp]'}],
      //     ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 3}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider [exp]'}],
      //     ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.05, exponent: 0.3}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider [exp][inv]'}],
      //     ['io-slider', {value: this.bind('number'), min: 2, max: 0, step: 0.05, exponent: 0.3}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'number-slider'}],
      //     ['io-number-slider', {value: this.bind('number'), min: 0, max: 2, step: 0.1}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider-range'}],
      //     ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider-range [exp]'}],
      //     ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 3}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'slider-range [exp]'}],
      //     ['io-slider-range', {value: this.array2, min: 0, max: 2, step: 0.05, exponent: 0.3}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'number-slider-range'}],
      //     ['io-number-slider-range', {value: this.array2, min: 0, max: 2, step: 0.1}],
      //   ]],
      //   ['div', {class: 'tall'}, [
      //     ['io-label', {label: 'slider-2d + [vert]'}],
      //     ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1]}],
      //     ['io-slider-2d', {value: this.bind('array2'), min: [-6, -2.5], max: [4.2, 8], step: [1, 1], vertical: true}],
      //     ['io-slider', {value: this.bind('number'), vertical: true, min: -2, max: 2, step: 0.2}],
      //     ['io-slider-range', {value: this.array2, vertical: true, min: 0, max: 2, step: 0.1}],
      //   ]],
      //   ['div', {class: 'tall'}, [
      //     ['io-label', {label: 'sliders [inv][vert]'}],
      //     ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1]}],
      //     ['io-slider-2d', {value: this.bind('array2'), min: [4.2, 8], max: [-6, -2.5], step: [1, 1], vertical: true}],
      //     ['io-slider', {value: this.bind('number'), vertical: true, min: 2, max: -2, step: 0.2}],
      //     ['io-slider-range', {value: this.array2, vertical: true, min: 2, max: 0, step: 0.1}],
      //   ]],
      // ]],
      // ['div', [
      //   ['div', [
      //     ['io-label', {label: 'color-rgba'}],
      //     ['io-color-rgba', {value: this.rgba}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-rgba [rgb]'}],
      //     ['io-color-rgba', {value: this.rgb}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [red]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'r'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [green]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'g'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [blue]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'b'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [alpha]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'a'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [h]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'h'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [s]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 's'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [v]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'v'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [l]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'l'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [c]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'c'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [m]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'm'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [y]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'y'}],
      //   ]],
      //   ['div', [
      //     ['io-label', {label: 'color-slider [k]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'k'}],
      //   ]],
      //   ['div', {class: 'tall'}, [
      //     ['io-label', {label: 'slider-2d + [vert]'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'hs'}],
      //     ['io-color-slider', {value: this.rgba, channel: 'sv'}],
      //     ['io-color-slider', {value: this.rgba, vertical: true, channel: 'v'}],
      //     ['io-color-slider', {value: this.rgba, vertical: true, channel: 'l'}],          
      //   ]],
      //   ['div', {class: 'tall'}, [
      //     ['io-label', {label: 'color-panel'}],
      //     ['io-color-panel', {expanded: true, value: this.rgba}]
      //   ]],
      // ]],
      ['div', [
        ['span', {class: 'warning'}, 'Elements below are still in development.']
      ]],
      ['div', [
        ['div', [
          ['io-label', {label: 'vector [array2]'}],
          ['io-vector', {value: this.array2}],
        ]],
        ['div', [
          ['io-label', {label: 'vector [array3]'}],
          ['io-vector', {value: this.array3}],
        ]],
        ['div', [
          ['io-label', {label: 'vector [array3][link]'}],
          ['io-vector', {value: this.array3, linkable: true}],
        ]],
        ['div', [
          ['io-label', {label: 'vector [array4]'}],
          ['io-vector', {value: this.array4}],
        ]],
        ['div', [
          ['io-label', {label: 'vector [vector2]'}],
          ['io-vector', {value: this.vector2}],
        ]],
        ['div', [
          ['io-label', {label: 'vector [vector3]'}],
          ['io-vector', {value: this.vector3}],
        ]],
        ['div', [
          ['io-label', {label: 'vector [vector4]'}],
          ['io-vector', {value: this.vector4}],
        ]],
        ['div', [
          ['io-label', {label: 'matrix [matrix2]'}],
          ['io-matrix', {value: this.matrix2}],
        ]],
        ['div', [
          ['io-label', {label: 'matrix [matrix3]'}],
          ['io-matrix', {value: this.matrix3}],
        ]],
        ['div', [
          ['io-label', {label: 'matrix [matrix4]'}],
          ['io-matrix', {value: this.matrix4}],
        ]],
      ]],
      ['div', [
        ['div', [
          ['io-label', {label: 'properties'}],
          ['io-properties', {value: this.object, properties: ['number', 'string', 'boolean']}],
        ]],
        ['div', [
          ['io-label', {label: 'object [filtered]'}],
          ['io-object', {
            value: this.object,
            expanded: true,
            slotted: ['io-field', {label: 'Slotted Element'}],
            properties: ['number', 'string', 'boolean']
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
        ['div', [
          ['io-label', {label: 'option-menu'}],
          ['io-option-menu', {
            options: new Options([
              new Item({label: 'negative one', value: -1}),
              new Item({label: 'zero', value: 0}),
              new Item({label: 'half', value: 0.5}),
              new Item({label: 'one', value: 1}),
              new Item({label: 'two', value: 2}),
              new Item({label: 'three', value: 3}),
              new Item({label: 'four', value: 4}),
              new Item({label: 'leet', value: 1337}),
            ]),
            value: this.bind('number')
          }],
          ['io-option-menu', {options: new Options([ -1, 0, 0.5, 1, 2, 3, 4, 1337]), value: this.bind('number')}],
          ['io-button', {label: 'set 0.5', action: () => { this.number = 0.5 }, value: 0.5}],
        ]],
        ['div', [
          ['io-label', {label: 'menu-options'}],
          ['io-menu-options', {options: menuoptions}],
        ]],
        ['div', [
          ['io-label', {label: 'menu-options [horizontal]'}],
          ['io-menu-options', {options: menuoptions, horizontal: true}],
        ]],
        ['div', [
          ['io-label', {label: 'menu-options'}],
          ['io-menu-options', {options: menuoptions, searchable: true}],
        ]],
        ['div', [
          ['io-label', {label: 'menu-item'}],
          ['io-menu-item', {label: 'menu item', option: option}],
        ]],
        ['div', [
          ['io-label', {label: 'context-menu'}],
          ['span', 'click for menu'],
          ['io-context-menu', {options: menuoptions, position: 'pointer', button: 0}],
        ]],
        ['div', [
          ['io-label', {label: 'context-menu'}],
          ['span', 'right-click for menu'],
          ['io-context-menu', {options: menuoptions, position: 'pointer', button: 2}],
        ]],
      ]],
    ]);
  }
}

RegisterIoElement(IoDemoElements);
