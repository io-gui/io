import { Register, IoElement, div, span, ioText } from 'io-gui';
import { MenuOptions, MenuItem, ioMenuTree, ioMenuItem, ioMenuOptions, ioContextMenu } from 'io-menus';
// TODO: remove dependencies on io-inputs and io-navigation.
import { ioSwitch, ioInputBase } from 'io-inputs';
import 'io-navigation';
import 'io-icons';

const numberItems = [
  {value: 0, label: 'zero'},
  {value: 1, label: 'one'},
  {value: 2, label: 'two'},
  {value: 3, label: 'three'},
  {value: 4, label: 'four'},
];

const options = new MenuOptions([
  {label: 'Red', icon: '❤️', options: new MenuOptions([
    'Red1',
    'Red2',
    'Red3',
  ])},
  {label: 'Green', icon: '💚', options: new MenuOptions([
    'Green1',
    'Green2',
    'Green3',
  ])},
  {label: 'Blue', icon: '💙', options: new MenuOptions([
    'Blue1',
    'Blue2',
    'Blue3',
  ])},
  {label: 'Numbers', options: new MenuOptions([
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'five', value: 5},
  ])},
]);

const optionsDeep = new MenuOptions([
  {label: 'Deep Menu', options: new MenuOptions([
    {value: 'Level 1 Item One'},
    {value: 'Level 1 Item Two'},
    {value: 'Level 1 Item Three', options: new MenuOptions([
      {value: 'Level 2 Item One'},
      {value: 'Level 2 Item Two'},
      {value: 'Level 2 Item Three', options: new MenuOptions([
        {value: 'Level 3 Item One'},
        {value: 'Level 3 Item Two'},
        {value: 'Level 3 Item Three', options: new MenuOptions([
          {value: 'Level 4 Item One'},
          {value: 'Level 4 Item Two'},
          {value: 'Level 4 Item Three', options: new MenuOptions([
            {value: 'Level 5 Item One'},
            {value: 'Level 5 Item Two'},
            {value: 'Level 5 Item Three', options: new MenuOptions([
              {value: 'Level 6 Item One'},
              {value: 'Level 6 Item Two'},
              {value: 'Level 6 Item Three', options: new MenuOptions([
                {value: 'Level 7 Item One'},
                {value: 'Level 7 Item Two'},
                {value: 'Level 7 Item Three'},
              ])},
            ])},
          ])},
        ])},
      ])},
    ])},
  ])},
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
        options: new MenuOptions(numberItems, {
          first: this.bind('menuRoot')
        }),
      }),
      ioMenuOptions({
        horizontal: true,
        noPartialCollapse: true,
        options: new MenuOptions(numberItems, {
          first: this.bind('menuRoot')
        }),
      }),
      ['div', {class: 'row'}, [
        ioMenuOptions({
          searchable: true,
          options: new MenuOptions(numberItems, {
            first: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: new MenuOptions([...numberItems].reverse(), {
            first: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: new MenuOptions([
            new MenuItem({value: 0, label: 'zero', hint: 'Number(0)', icon: 'io:layers'}),
            new MenuItem({value: 1, label: 'one', hint: 'Number(1)', icon: 'io:layers'}),
            new MenuItem({value: 2, label: 'two', hint: 'Number(2)', icon: 'io:box'}),
            new MenuItem({value: 3, label: 'three', hint: 'Number(3)', icon: 'io:film'}),
          ], {
            first: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: optionsDeep,
        }),
      ]],
      div({class: 'contextArea'}, [
        span('Context Area'),
        ioContextMenu({
          options: new MenuOptions([...optionsDeep, ...numberItems, ...options]),
        }),
        ioContextMenu({
          options: new MenuOptions([...options]),
          button: 1,
        }),
        ioContextMenu({
          options: new MenuOptions([...numberItems]),
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
      :host io-text {
        background-color: transparent;
        color: var(--io_color);
      }
      :host io-text.first {
        color: var(--io_colorBlue);
      }
      :host io-text.path {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host io-text.last {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host io-text.scroll {
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
        this.options.first ? [ioText({label: 'first:', class: 'first'}), ioText({label: this.options.first})] : null,
        this.options.last ? [ioText({label: 'last:', class: 'last'}), ioText({label: this.options.last})] : null,
        this.options.scroll ? [ioText({label: 'scroll:', class: 'scroll'}), ioText({label: this.options.scroll})] : null,
        this.options.path ? [ioText({label: 'path:', class: 'path'}), ioText({label: this.options.path})] : null,
      ]),
      options
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
      selectElement = ioSwitch({value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'});
    } else if (this.item.mode === 'select' || this.item.mode === 'scroll') {
      selectElement = ioSwitch({value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'});
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
      options: {value: new MenuOptions([
        {value: 'home'}, 
        {value: 'food', options: new MenuOptions([
          {value: 'fruits', options: new MenuOptions([
            {value: 'apples', selected: true},
            {value: 'mangos'},
            {value: 'bannanas'},
          ])}
        ])},
        {value: 'mixed', options: new MenuOptions([
          {value: 'scrolls', options: new MenuOptions([
            {value: 'scroll1', mode: 'scroll'},
            {value: 'scroll2', mode: 'scroll'},
            {value: 'scroll3', mode: 'scroll'},
            {value: 'scroll4', mode: 'scroll'},
          ])},
          {value: 'togglables', mode: 'none', options: new MenuOptions([
            {value: 'toggle1', mode: 'toggle'},
            {value: 'toggle2', mode: 'toggle'},
            {value: 'toggle3', mode: 'toggle'},
            {value: 'toggle4', mode: 'toggle'},
          ])},
          {value: 'selectable', options: new MenuOptions([
            {value: 'toggle', mode: 'toggle'},
            {value: 'scroll', mode: 'scroll'},
            {value: 'selectable'},
          ])},
        ])},
      ])
    }};
  }
  init() {
    // TODO: remove this. Why is it necessary in ./index.html?
    this.changed();
  }
}
Register(IoDemoMenuModel);
export const ioDemoMenuModel = IoDemoMenuModel.vConstructor;
