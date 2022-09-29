import {IoElement, RegisterIoElement, Options, Item} from '../build/iogui.js';

class IoOptionsDemoView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
      }
      :host > div {
        background-color: var(--io-background-color-dark);
        display: flex;
      }
      :host io-item-demo-view {
        margin-left: 0.5em;
      }
      :host io-field {
        pointer-events: none;
        margin-left: 0.5em;
      }
      :host io-field.root {
        color: var(--io-color-link);
      }
      :host io-options-path-demo > io-field {
        color: var(--io-color-string);
      }
      :host io-field.leaf {
        color: var(--io-color-focus);
      }
    `;
  }
  static get Properties() {
    return {
      options: {
        type: Options,
        strict: true,
      },
    };
  }
  changed() {
    const options = [];
    for (let i = 0; i < this.options.length; i++) {
      options.push(['io-item-demo-view', {option: this.options[i]}]);
    }
    this.template([
      ['div', [
        ['io-field', {value: this.options.path.bind('root'), class: 'root'}],
        ['io-options-path-demo', {value: this.options.path.bind('value')}],
        ['io-field', {value: this.options.path.bind('root'), class: 'leaf'}],
      ]],
      options
    ]);
  }
}

RegisterIoElement(IoOptionsDemoView);

class IoItemDemoView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > div {
        display: flex;
      }
      :host:last-child {
        margin-bottom: 0.5em;
      }
    `;
  }
  static get Properties() {
    return {
      option: {
        type: Item,
        strict: true,
      },
    };
  }
  changed() {
    this.template([
      ['div', [
        this.option.select === 'toggle'
            ? ['io-boolean', {value: this.option.bind('selected'), true: 'icons:box_fill_checked', false: 'icons:box'}]
            : ['io-switch', {value: this.option.bind('selected')}],
        ['io-field', {value: this.option.bind('value')}],
        ['io-field', {value: this.option.path.bind('root'), class: 'root'}],
        ['io-options-path-demo', {value: this.option.path.bind('value')}],
        ['io-field', {value: this.option.path.bind('leaf'), class: 'leaf'}],
      ]],
      this.option.hasmore ? ['io-options-demo-view', {options: this.option.options}] : null
    ]);
  }
}

RegisterIoElement(IoItemDemoView);

class IoOptionsPathDemo extends IoElement {
  static get Properties() {
    return {
      value: Array,
    };
  }
  changed() {
    this.template([['io-field', {value: (this.value && this.value.length) ? JSON.stringify(this.value) : ''}]]);
  }
}
RegisterIoElement(IoOptionsPathDemo);

export class IoDemoMenu extends IoOptionsDemoView {
  static get Properties() {
    return {
      options: new Options([
        {value: 'home'}, 
        {value: 'food', options: [
          {value: 'fruits', options: [
            {value: 'apples', selected: true}, // TODO: consider this as default selection
            {value: 'mangos'},
            {value: 'bannanas'},
          ]},
          {value: 'nuts', options: [
            {value: 'chestnuts'},
            {value: 'almonds'},
            {value: 'cashews'},
          ]},
        ]}, 
        {value: 'mixed', options: [
          {value: 'selectable1'},
          {value: 'selecrable2'},
          {value: 'togglables', options: [
            {value: 'toggle1', select: 'toggle'},
            {value: 'toggle2', select: 'toggle'},
            {value: 'toggle3', select: 'toggle'},
            {value: 'toggle4', select: 'toggle'},
          ]},
          {value: 'nested mixed', options: [
            {value: 'toggle', select: 'toggle'},
            {value: 'selectable'},
          ]},
        ]}
      ])
    };
  }
}

RegisterIoElement(IoDemoMenu);