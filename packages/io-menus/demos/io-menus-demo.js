import { Register, IoElement } from 'io-gui';
import { MenuOptions, MenuItem } from 'io-menus';
// TODO: remove dependencies on io-inputs and io-navigation.
import 'io-inputs';
import 'io-navigation';
import 'io-iconset';

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

export class IoMenusDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-bottom: var(--io_spacing);
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host .contextArea {
        min-height: 200px;
      }
    `;
  }
  static get Properties() {
    return {
      menuPath: '',
      menuRoot: 0,
    };
  }
  init() {
    this.template([
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
    ]);
  }
}
Register(IoMenusDemo);
export const ioMenusDemo = IoMenusDemo.vDOM;

export class IoOptionsDemoView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        align-self: stretch;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: var(--io_borderRadius);
      }
      :host > div {
        background-color: var(--io_bgColorDimmed);
        display: flex;
        height: var(--io_lineHeight);
      }
      :host io-item-demo-view {
        margin-left: var(--io_spacing);
      }
      :host io-label {
        background-color: transparent;
        color: var(--io_color);
      }
      :host io-label.first {
        color: var(--io_colorBlue);
      }
      :host io-label.path {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host io-label.last {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host io-label.scroll {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }

    `;
  }
  static get Properties() {
    return {
      options: {
        type: MenuOptions,
        strict: true,
      },
    };
  }
  optionsMutated() {
    this.changed();
  }
  changed() {
    const options = [];
    for (let i = 0; i < this.options.length; i++) {
      options.push(['io-item-demo-view', {item: this.options[i]}]);
    }
    this.template([
      ['div', [
        this.options.first ? [['io-label', {label: 'first:', class: 'first'}], ['io-label', {label: this.options.first}]] : null,
        this.options.last ? [['io-label', {label: 'last:', class: 'last'}], ['io-label', {label: this.options.last}]] : null,
        this.options.scroll ? [['io-label', {label: 'scroll:', class: 'scroll'}], ['io-label', {label: this.options.scroll}]] : null,
        this.options.path ? [['io-label', {label: 'path:', class: 'path'}], ['io-label', {label: this.options.path}]] : null,
      ]],
      options
    ]);
  }
}
Register(IoOptionsDemoView);
export const ioOptionsDemoView = IoOptionsDemoView.vDOM;

export class IoItemDemoView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > div {
        display: flex;
      }
    `;
  }
  static get Properties() {
    return {
      item: {
        type: MenuItem,
        strict: true,
      },
    };
  }
  itemMutated() {
    this.changed();
  }
  changed() {
    let selectElement = null;
    if (this.item.mode === 'toggle') {
      selectElement = ['io-boolicon', {value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'}];
    } else if (this.item.mode === 'select' || this.item.mode === 'scroll') {
      selectElement = ['io-boolicon', {value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'}];
    }
    this.template([
      ['div', [
        selectElement,
        ['io-field', {value: this.item.label, appearance: 'neutral'}],
      ]],
      this.item.hasmore ? ['io-options-demo-view', {options: this.item.options}] : null
    ]);
  }
}
Register(IoItemDemoView);
export const ioItemDemoView = IoItemDemoView.vDOM;

export class IoDemoMenuModel extends IoOptionsDemoView {
  static get Properties() {
    return {
      options: {value: new MenuOptions([
        {value: 'home'}, 
        {value: 'food', options: [
          {value: 'fruits', options: [
            {value: 'apples', selected: true},
            {value: 'mangos'},
            {value: 'bannanas'},
          ]}
        ]}, 
        {value: 'mixed', options: [
          {value: 'scrolls', options: [
            {value: 'scroll1', mode: 'scroll'},
            {value: 'scroll2', mode: 'scroll'},
            {value: 'scroll3', mode: 'scroll'},
            {value: 'scroll4', mode: 'scroll'},
          ]},
          {value: 'togglables', mode: 'none', options: [
            {value: 'toggle1', mode: 'toggle'},
            {value: 'toggle2', mode: 'toggle'},
            {value: 'toggle3', mode: 'toggle'},
            {value: 'toggle4', mode: 'toggle'},
          ]},
          {value: 'selectable', options: [
            {value: 'toggle', mode: 'toggle'},
            {value: 'scroll', mode: 'scroll'},
            {value: 'selectable'},
          ]},
        ]}
      ])
    }};
  }
  init() {
    // TODO: remove this. Why is it necessary in ./index.html?
    this.changed();
  }
}
Register(IoDemoMenuModel);
export const ioDemoMenuModel = IoDemoMenuModel.vDOM;
