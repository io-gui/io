import { Register, IoElement, div, span } from 'io-gui';
import { MenuOptions, MenuItem, ioMenuTree, ioMenuItem, ioMenuOptions, ioContextMenu } from 'io-menus';
// TODO: remove dependencies on io-inputs and io-navigation.
import { ioSwitch, ioInputBase, ioBoolean } from 'io-inputs';
import 'io-navigation';
import 'io-icons';

const numberItems = new MenuOptions().fromJSON([
  {value: 0, label: 'zero'},
  {value: 1, label: 'one'},
  {value: 2, label: 'two'},
  {value: 3, label: 'three'},
  {value: 4, label: 'four'},
]);


const options = new MenuOptions().fromJSON([
  {label: 'Red', icon: '❤️', options: ['Red1','Red2','Red3']},
  {label: 'Green', icon: '💚', options: ['Green1','Green2','Green3']},
  {label: 'Blue', icon: '💙', options: ['Blue1','Blue2','Blue3']},
  {label: 'Numbers', options: [
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'five', value: 5},
  ]},
]);

const optionsDeep = new MenuOptions().fromJSON([
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
  ]},
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
      ioMenuTree({
        options: options,
      }),
      ioMenuItem({label: 'menu item', item: new MenuItem({value: 'item'})}),
      ioMenuItem({label: 'menu item', item: new MenuItem({
        selected: true,
        value: 'value',
        hint: 'selected',
        label: 'menu item label',
        icon: 'io:code',
      })}),
      ioMenuItem({label: 'menu item', item: new MenuItem({
        selected: false,
        value: 'value',
        hint: 'not selected',
        label: 'menu item label',
        icon: 'io:circle_fill_plus',
      })}),
      ioMenuOptions({
        horizontal: true,
        searchable: true,
        options: new MenuOptions({
          items: numberItems.items,
          first: this.bind('menuRoot')
        }),
      }),
      ioMenuOptions({
        horizontal: true,
        noPartialCollapse: true,
        options: new MenuOptions({
          items: numberItems.items,
          first: this.bind('menuRoot')
        }),
      }),
      div({class: 'row'}, [
        ioMenuOptions({
          searchable: true,
          options: new MenuOptions({
            items: numberItems.items,
            first: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: new MenuOptions({
            items: numberItems.items.reverse(),
            first: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: new MenuOptions({first: this.bind('menuRoot')}).fromJSON([
            {value: 0, label: 'zero', hint: 'Number(0)', icon: 'io:layers'},
            {value: 1, label: 'one', hint: 'Number(1)', icon: 'io:layers'},
            {value: 2, label: 'two', hint: 'Number(2)', icon: 'io:box'},
            {value: 3, label: 'three', hint: 'Number(3)', icon: 'io:film'},
          ]),
        }),
        ioMenuOptions({
          options: optionsDeep,
        }),
      ]),
      div({class: 'contextArea'}, [
        span('Context Area'),
        ioContextMenu({
          options: new MenuOptions({items: [...optionsDeep.items, ...numberItems.items, ...options.items]}),
        }),
        ioContextMenu({
          options: new MenuOptions({items: [...options.items]}),
          button: 1,
        }),
        ioContextMenu({
          options: new MenuOptions({items: [...numberItems.items]}),
          button: 2,
        }),
      ]),
      ioDemoMenuModel(),
    ]);
  }
}
Register(IoMenusDemo);
export const ioMenusDemo = IoMenusDemo.vConstructor;

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
      :host span {
        background-color: transparent;
        padding: 0 var(--io_spacing);
        color: var(--io_color);
      }
      :host span.first {
        color: var(--io_colorBlue);
      }
      :host span.path {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host span.last {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host span.scroll {
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
      options.push(ioItemDemoView({item: this.options[i]}));
    }
    this.template([
      div([
        this.options.first ? span({class: 'first'}, `first: ${this.options.first}`) : null,
        this.options.last ? span({class: 'last'}, `last: ${this.options.last}`) : null,
        this.options.path ? span({class: 'path'}, `path: ${this.options.path}`) : null,
        this.options.scroll ? span({class: 'scroll'}, `scroll: ${this.options.scroll}`) : null,
      ]),
      ...options
    ]);
  }
}
Register(IoOptionsDemoView);
export const ioOptionsDemoView = IoOptionsDemoView.vConstructor;

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
      selectElement = ioBoolean({value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'});
    } else if (this.item.mode === 'select' || this.item.mode === 'scroll') {
      selectElement = ioSwitch({value: this.item.bind('selected')});
    }
    this.template([
      div([
        selectElement,
        ioInputBase({value: this.item.label, appearance: 'neutral'}),
      ]),
      this.item.hasmore ? ioOptionsDemoView({options: this.item.options}) : null
    ]);
  }
}
Register(IoItemDemoView);
export const ioItemDemoView = IoItemDemoView.vConstructor;

export class IoDemoMenuModel extends IoOptionsDemoView {
  static get Properties() {
    return {
      options: {value: new MenuOptions().fromJSON([
        'home', 
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
            'selectable',
          ]},
        ]},
      ])}
    }
  }
  init() {
    // TODO: remove this. Why is it necessary in ./index.html?
    this.changed();
  }
}
Register(IoDemoMenuModel);
export const ioDemoMenuModel = IoDemoMenuModel.vConstructor;
