import {IoElement, RegisterIoElement, Options, Item} from '../build/iogui.js';

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

export class IoDemoElementsMenus extends IoElement {
  static get Style() {
    return /* css */`
      :host > io-menu-options[horizontal] {
        margin-bottom: 0.5em;
      }
      :host > io-menu-options:not([horizontal]) {
        margin-right: 0.5em;
      }
    `;
  }
  static get Properties() {
    return {
      number: 0,
    };
  }
  setNumber(value) {
    this.number = value;
  }
  constructor(props) {
    super(props);
    this.setNumber = this.setNumber.bind(this);
    const menuValue = menuoptions.path.bind('leaf');
    this.template([
      ['div', {class: 'io-table3 table'}, [
        ['io-option-menu', 
        {
          options: new Options([
            {label: 'negative one', value: -1},
            {label: 'zero', value: 0},
            {label: 'half', value: 0.5},
            {label: 'one', value: 1},
            {label: 'two', value: 2},
            {label: 'three', value: 3},
            {label: 'four', value: 4},
            {label: 'leet', value: 1337},
          ]),
          value: this.bind('number')
        }],
        ['io-option-menu', {options: new Options([ -1, 0, 0.5, 1, 2, 3, 4, 1337]), value: this.bind('number')}],
        ['io-button', {label: 'set 0.5', action: this.setNumber, value: 0.5}],
      ]],
      ['br'],
      ['div', {class: 'io-column'}, [
        ['io-menu-options', {options: menuoptions, horizontal: true}],
        ['div', {class: 'io-row'}, [
          ['io-menu-options', {options: menuoptions, searchable: true}],
          ['div', {class: 'io-column'}, [
            ['div', [['span', {class: 'io-item'}, 'Selected:'], ['io-item', {value: menuValue}]]],
            ['io-menu-item', {label: 'menu item', option: option}],
            ['div', {class: 'io-content'}, [
              ['span', 'click for menu'],
              ['io-context-menu', {options: menuoptions, position: 'pointer', button: 0}],
            ]],
            ['div', {class: 'io-content'}, [
              ['span', 'right-click for menu'],
              ['io-context-menu', {options: menuoptions, position: 'pointer', button: 2}],
            ]],
          ]],
        ]],
      ]],
    ]);
  }
  
}

RegisterIoElement(IoDemoElementsMenus);
