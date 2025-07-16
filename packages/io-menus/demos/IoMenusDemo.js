import { Register, IoElement, div, span } from 'io-gui';
import { MenuOption, ioMenuTree, ioMenuItem, ioMenuOptions, ioContextMenu, ioOptionSelect } from 'io-menus';
import { ioSwitch, ioField, ioBoolean } from 'io-inputs';
// TODO: remove dependencies on io-navigation.
import 'io-navigation';
import 'io-icons';

// const numberItems = new MenuOption({id: 'numbers', options: [
//   {value: 0, label: 'zero', hint: 'Number(0)', icon: 'io:numeric-0-box'},
//   {value: 1, label: 'one', hint: 'Number(1)', icon: 'io:numeric-1-box'},
//   {value: 2, label: 'two', hint: 'Number(2)', icon: 'io:numeric-2-box'},
//   {value: 3, label: 'three', hint: 'Number(3)', icon: 'io:numeric-3-box'},
//   {value: 4, label: 'four', hint: 'Number(4)', icon: 'io:numeric-4-box'},
// ]});

// const colorOptions = new MenuOption({id: 'colors', options: [
//   {id: 'Red', icon: '❤️', options: ['Red1','Red2','Red3']},
//   {id: 'Green', icon: '💚', options: ['Green1','Green2','Green3']},
//   {id: 'Blue', icon: '💙', options: ['Blue1','Blue2','Blue3']},
// ]});

const optionDeep = new MenuOption({id: 'deep', options: [
  {id: 'Deep Menu', options: [
    {id: 'Level 1/1', hint: 'One'},
    {id: 'Level 1/2', hint: 'Two'},
    {id: 'Level 1/3', hint: 'Three', options: [
      {id: 'Level 2/1', hint: 'One'},
      {id: 'Level 2/2', hint: 'Two'},
      {id: 'Level 2/3', hint: 'Three', options: [
        {id: 'Level 3/1', hint: 'One'},
        {id: 'Level 3/2', hint: 'Two'},
        {id: 'Level 3/3', hint: 'Three', options: [
          {id: 'Level 4/1', hint: 'One'},
          {id: 'Level 4/2', hint: 'Two'},
          {id: 'Level 4/3', hint: 'Three', options: [
            {id: 'Level 5/1', hint: 'One'},
            {id: 'Level 5/2', hint: 'Two'},
            {id: 'Level 5/3', hint: 'Three', options: [
              {id: 'Level 6/1', hint: 'One'},
              {id: 'Level 6/2', hint: 'Two'},
              {id: 'Level 6/3', hint: 'Three', options: [
                {id: 'Level 7/1', hint: 'One'},
                {id: 'Level 7/2', hint: 'Two'},
                {id: 'Level 7/3', hint: 'Three'},
              ]},
            ]},
          ]},
        ]},
      ]},
    ]},
    {id: 'Level 1/4', hint: 'Four'},
  ]},
]});

// const optionsLong = new MenuOption({id: 'long', options: [
//   'apple', 'banana', 'cherry', 'dolphin', 'elephant', 'flamingo', 'giraffe', 'hamburger', 'igloo', 'jaguar',
//   'kangaroo', 'lemon', 'mango', 'nectarine', 'octopus', 'penguin', 'quilt', 'rainbow', 'sunflower', 'tiger',
//   'umbrella', 'violin', 'watermelon', 'xylophone', 'yacht', 'zebra', 'astronaut', 'butterfly', 'crocodile', 'diamond',
//   'eagle', 'fireworks', 'guitar', 'helicopter', 'iceberg', 'jellyfish', 'koala', 'lighthouse', 'mountain', 'notebook',
//   'ocean', 'piano', 'queen', 'rocket', 'snowflake', 'telescope', 'unicorn', 'volcano', 'whale', 'yoga', 'zucchini',
//   'airplane', 'basketball', 'camera', 'dragon', 'eclipse', 'fountain', 'garden', 'hurricane', 'island', 'jungle',
//   'kite', 'moon', 'northern', 'oasis', 'paradise', 'quasar', 'rainforest', 'satellite', 'thunder', 'universe',
//   'vortex', 'waterfall', 'xenon', 'yellow', 'zenith', 'aurora', 'blizzard', 'cascade', 'dynamo', 'echo', 'fractal',
//   'galaxy', 'horizon', 'infinity', 'jubilee', 'kaleidoscope', 'labyrinth', 'mirage', 'nebula', 'orbit', 'phoenix',
//   'quantum', 'radiance', 'spectrum', 'tranquility', 'ultraviolet', 'vibrant',
// ]});

class IoOptionsViewDemo extends IoElement {
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
        background-color: var(--io_bgColorLight);
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
      option: {
        type: MenuOption,
      },
    };
  }
  optionMutated() {
    this.changed();
  }
  changed() {
    const vChildren = [];
    for (let i = 0; i < this.option.options.length; i++) {
      vChildren.push(ioItemViewDemo({option: this.option.options[i]}));
    }
    this.render([
      div([
        this.option.selectedID ? span({class: 'selected'}, `selected: ${this.option.selectedID}`) : null,
        this.option.path ? span({class: 'path'}, `path: ${this.option.path}`) : null,
      ]),
      ...vChildren
    ]);
  }
}
Register(IoOptionsViewDemo);
const ioOptionsViewDemo = IoOptionsViewDemo.vConstructor;

class IoItemViewDemo extends IoElement {
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
      option: {
        type: MenuOption,
      },
    };
  }
  optionMutated() {
    this.changed();
  }
  changed() {
    let selectElement = null;
    if (this.option.mode === 'toggle') {
      selectElement = ioBoolean({value: this.option.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'});
    } else if (this.option.mode === 'select') {
      selectElement = ioSwitch({value: this.option.bind('selected')});
    }
    this.render([
      div([
        selectElement,
        ioField({value: this.option.label, inert: true, appearance: 'neutral'}),
      ]),
      this.option.hasmore ? ioOptionsViewDemo({options: this.option.options}) : null
    ]);
  }
}
Register(IoItemViewDemo);
const ioItemViewDemo = IoItemViewDemo.vConstructor;

class IoMenusDemo extends IoElement {
  static get Style () {
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
  ready() {
    this.render([
      ioMenuTree({
        searchable: true,
        option: optionDeep,
      }),
      // ioMenuItem({label: 'menu item', option: new MenuOption({id: 'item', value: 'item'})}),
      // ioMenuItem({option: new MenuOption({
      //   id: 'item with hint',
      //   selected: true,
      //   value: 'value',
      //   hint: 'hint',
      //   label: 'menu item label',
      //   icon: 'io:code',
      // })}),
      // ioMenuItem({label: 'menu item', option: new MenuOption({
      //   id: 'item with hint2',
      //   selected: false,
      //   value: 'value',
      //   hint: 'hint',
      //   label: 'menu item label',
      //   icon: 'io:circle_fill_plus',
      // })}),
      // ioMenuOptions({
      //   horizontal: true,
      //   searchable: true,
      //   options: new MenuOption({
      //     id: 'horizontal',
      //     options: numberItems.options,
      //     selected: this.bind('menuRoot')
      //   }),
      // }),
      // ioMenuOptions({
      //   horizontal: true,
      //   options: new MenuOption({
      //     id: 'horizontal2',
      //     options: numberItems.options,
      //     selected: this.bind('menuRoot')
      //   }),
      // }),
      // div({class: 'row'}, [
      //   ioMenuOptions({
      //     searchable: true,
      //     options: new MenuOption({
      //       id: 'searchable',
      //       options: numberItems.options,
      //       selected: this.bind('menuRoot')
      //     }),
      //   }),
      //   ioMenuOptions({
      //     options: new MenuOption({
      //       id: 'reversed',
      //       options: [...numberItems.options].reverse(),
      //       selected: this.bind('menuRoot')
      //     }),
      //   }),
      //   ioMenuOptions({
      //     options: new MenuOption({id: 'selected', selected: this.bind('menuRoot'), options: numberItems.options}),
      //   }),
      //   ioMenuOptions({
      //     options: new MenuOption({id: 'deep', options: optionDeep.options}),
      //   }),
      //   ioOptionSelect({
      //     label: 'Long Menu Select',
      //     options: optionsLong,
      //   }),
      // ]),
      // div({class: 'contextArea'}, [
      //   span('Context Area'),
      //   ioContextMenu({
      //     options: new MenuOption({id: 'context', options: [...optionDeep.options, ...numberItems.options, ...colorOptions.options]}),
      //   }),
      //   ioContextMenu({
      //     options: new MenuOption({id: 'context2', options: [...colorOptions.options]}),
      //     button: 1,
      //   }),
      //   ioContextMenu({
      //     options: optionsLong,
      //     button: 2,
      //   }),
      // ]),
      // ioOptionsViewDemo({options: new MenuOption({id: 'optionsview', options: [
      //   'home', 
      //   {value: 'food', options: [
      //     {value: 'fruits', options: [
      //       {value: 'apples', selected: true},
      //       {value: 'mangos'},
      //       {value: 'bannanas'},
      //     ]}
      //   ]},
      //   {value: 'mixed', options: [
      //     {value: 'togglables', mode: 'none', options: [
      //       {value: 'toggle1', mode: 'toggle'},
      //       {value: 'toggle2', mode: 'toggle'},
      //       {value: 'toggle3', mode: 'toggle'},
      //       {value: 'toggle4', mode: 'toggle'},
      //     ]},
      //     {value: 'selectables', options: [
      //       {value: 'toggle', mode: 'toggle'},
      //       'selectable',
      //     ]},
      //   ]},
      // ]})}),
    ]);
  }
}
Register(IoMenusDemo);
export const ioMenusDemo = IoMenusDemo.vConstructor;
