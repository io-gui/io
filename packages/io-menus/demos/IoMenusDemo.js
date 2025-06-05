import { Register, IoElement, div, span } from 'io-gui';
import { MenuOptions, MenuItem, ioMenuTree, ioMenuItem, ioMenuOptions, ioContextMenu, ioOptionSelect } from 'io-menus';
// TODO: remove dependencies on io-navigation.
import { ioSwitch, ioField, ioBoolean } from 'io-inputs';
import 'io-navigation';
import 'io-icons';

const numberItems = new MenuOptions().fromJSON([
  {value: 0, label: 'zero', hint: 'Number(0)', icon: 'io:layers'},
  {value: 1, label: 'one', hint: 'Number(1)', icon: 'io:lock'},
  {value: 2, label: 'two', hint: 'Number(2)', icon: 'io:box'},
  {value: 3, label: 'three', hint: 'Number(3)', icon: 'io:film'},
  {value: 4, label: 'four', hint: 'Number(4)', icon: 'io:gear'},
]);

const colorOptions = new MenuOptions().fromJSON([
  {id: 'Red', icon: '❤️', options: ['Red1','Red2','Red3']},
  {id: 'Green', icon: '💚', options: ['Green1','Green2','Green3']},
  {id: 'Blue', icon: '💙', options: ['Blue1','Blue2','Blue3']},
]);

const optionsDeep = new MenuOptions().fromJSON([
  {id: 'Deep Menu', options: [
    {value: 'Level 1/1', hint: 'One'},
    {value: 'Level 1/2', hint: 'Two'},
    {value: 'Level 1/3', hint: 'Three', options: [
      {value: 'Level 2/1', hint: 'One'},
      {value: 'Level 2/2', hint: 'Two'},
      {value: 'Level 2/3', hint: 'Three', options: [
        {value: 'Level 3/1', hint: 'One'},
        {value: 'Level 3/2', hint: 'Two'},
        {value: 'Level 3/3', hint: 'Three', options: [
          {value: 'Level 4/1', hint: 'One'},
          {value: 'Level 4/2', hint: 'Two'},
          {value: 'Level 4/3', hint: 'Three', options: [
            {value: 'Level 5/1', hint: 'One'},
            {value: 'Level 5/2', hint: 'Two'},
            {value: 'Level 5/3', hint: 'Three', options: [
              {value: 'Level 6/1', hint: 'One'},
              {value: 'Level 6/2', hint: 'Two'},
              {value: 'Level 6/3', hint: 'Three', options: [
                {value: 'Level 7/1', hint: 'One'},
                {value: 'Level 7/2', hint: 'Two'},
                {value: 'Level 7/3', hint: 'Three'},
              ]},
            ]},
          ]},
        ]},
      ]},
    ]},
    {value: 'Level 1/4', hint: 'Four'},
  ]},
]);

const optionsLong = new MenuOptions().fromJSON([
  'apple', 'banana', 'cherry', 'dolphin', 'elephant', 'flamingo', 'giraffe', 'hamburger', 'igloo', 'jaguar',
  'kangaroo', 'lemon', 'mango', 'nectarine', 'octopus', 'penguin', 'quilt', 'rainbow', 'sunflower', 'tiger',
  'umbrella', 'violin', 'watermelon', 'xylophone', 'yacht', 'zebra', 'astronaut', 'butterfly', 'crocodile', 'diamond',
  'eagle', 'fireworks', 'guitar', 'helicopter', 'iceberg', 'jellyfish', 'koala', 'lighthouse', 'mountain', 'notebook',
  'ocean', 'piano', 'queen', 'rocket', 'snowflake', 'telescope', 'unicorn', 'volcano', 'whale', 'yoga', 'zucchini',
  'airplane', 'basketball', 'camera', 'dragon', 'eclipse', 'fountain', 'garden', 'hurricane', 'island', 'jungle',
  'kite', 'moon', 'northern', 'oasis', 'paradise', 'quasar', 'rainforest', 'satellite', 'thunder', 'universe',
  'vortex', 'waterfall', 'xenon', 'yellow', 'zenith', 'aurora', 'blizzard', 'cascade', 'dynamo', 'echo', 'fractal',
  'galaxy', 'horizon', 'infinity', 'jubilee', 'kaleidoscope', 'labyrinth', 'mirage', 'nebula', 'orbit', 'phoenix',
  'quantum', 'radiance', 'spectrum', 'tranquility', 'ultraviolet', 'vibrant',
]);

export class IoMenusDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > * {
        margin-top: var(--io_spacing);
      }
      :host .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        margin-bottom: var(--io_spacing);
      }
      :host > io-menu-item {
        align-self: flex-start;
      }
      :host .row > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host .row > io-option-select {
        align-self: flex-start;
      }
      :host .contextArea {
        min-height: 200px;
      }
    `;
  }
  static get ReactiveProperties() {
    return {
      menuPath: '',
      menuRoot: undefined,
    };
  }
  init() {
    this.template([
      ioMenuTree({
        searchable: true,
        options: optionsDeep,
      }),
      ioMenuItem({label: 'menu item', item: new MenuItem({value: 'item'})}),
      ioMenuItem({item: new MenuItem({
        selected: true,
        value: 'value',
        hint: 'hint',
        label: 'menu item label',
        icon: 'io:code',
      })}),
      ioMenuItem({label: 'menu item', item: new MenuItem({
        selected: false,
        value: 'value',
        hint: 'hint',
        label: 'menu item label',
        icon: 'io:circle_fill_plus',
      })}),
      ioMenuOptions({
        horizontal: true,
        searchable: true,
        options: new MenuOptions({
          items: numberItems.items,
          selected: this.bind('menuRoot')
        }),
      }),
      ioMenuOptions({
        horizontal: true,
        noPartialCollapse: true,
        options: new MenuOptions({
          items: numberItems.items,
          selected: this.bind('menuRoot')
        }),
      }),
      div({class: 'row'}, [
        ioMenuOptions({
          searchable: true,
          options: new MenuOptions({
            items: numberItems.items,
            selected: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: new MenuOptions({
            items: numberItems.items.reverse(),
            selected: this.bind('menuRoot')
          }),
        }),
        ioMenuOptions({
          options: new MenuOptions({selected: this.bind('menuRoot'), items: numberItems.items}),
        }),
        ioMenuOptions({
          options: optionsDeep,
        }),
        ioOptionSelect({
          label: 'Long Menu Select',
          options: optionsLong,
        }),
      ]),
      div({class: 'contextArea'}, [
        span('Context Area'),
        ioContextMenu({
          options: new MenuOptions({items: [...optionsDeep.items, ...numberItems.items, ...colorOptions.items]}),
        }),
        ioContextMenu({
          options: new MenuOptions({items: [...colorOptions.items]}),
          button: 1,
        }),
        ioContextMenu({
          options: optionsLong,
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
      :host span.path {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host span.selected {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host span.scroll {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }

    `;
  }
  static get ReactiveProperties() {
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
        this.options.selected ? span({class: 'selected'}, `selected: ${this.options.selected}`) : null,
        this.options.path ? span({class: 'path'}, `path: ${this.options.path}`) : null,
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
  static get ReactiveProperties() {
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
    } else if (this.item.mode === 'select') {
      selectElement = ioSwitch({value: this.item.bind('selected')});
    }
    this.template([
      div([
        selectElement,
        ioField({value: this.item.label, inert: true, appearance: 'neutral'}),
      ]),
      this.item.hasmore ? ioOptionsDemoView({options: this.item.options}) : null
    ]);
  }
}
Register(IoItemDemoView);
export const ioItemDemoView = IoItemDemoView.vConstructor;

export class IoDemoMenuModel extends IoOptionsDemoView {
  static get ReactiveProperties() {
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
          {value: 'togglables', mode: 'none', options: [
            {value: 'toggle1', mode: 'toggle'},
            {value: 'toggle2', mode: 'toggle'},
            {value: 'toggle3', mode: 'toggle'},
            {value: 'toggle4', mode: 'toggle'},
          ]},
          {value: 'selectables', options: [
            {value: 'toggle', mode: 'toggle'},
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
