import {IoElement, Options, OptionItem} from '../../io/build/io.js';
import  '../../io/build/io-elements.js';

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
      :host io-option-item-demo-view {
        margin-left: 0.5em;
      }
      :host io-item {
        margin-left: 0.5em;
      }
      :host io-item.root {
        color: var(--io-color-link);
      }
      :host io-options-path-demo > io-item {
        color: var(--io-color-string);
      }
      :host io-item.leaf {
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
      options.push(['io-option-item-demo-view', {option: this.options[i]}]);
    }
    this.template([
      ['div', [
        ['io-item', {value: this.options.bind('selectedRoot'), class: 'root'}],
        ['io-options-path-demo', {value: this.options.bind('selectedPath')}],
        ['io-item', {value: this.options.bind('selectedLeaf'), class: 'leaf'}],
      ]],
      options
    ]);
  }
}

IoOptionsDemoView.Register();

class IoOptionItemDemoView extends IoElement {
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
        type: OptionItem,
        strict: true,
      },
    };
  }
  changed() {
    this.template([
      ['div', [
        [this.option.select === 'toggle' ? 'io-boolicon' : 'io-switch', {value: this.option.bind('selected')}],
        ['io-item', {value: this.option.bind('value')}],
        ['io-item', {value: this.option.bind('selectedRoot'), class: 'root'}],
        ['io-options-path-demo', {value: this.option.bind('selectedPath')}],
        ['io-item', {value: this.option.bind('selectedLeaf'), class: 'leaf'}],
      ]],
      this.option.hasmore ? ['io-options-demo-view', {options: this.option.options}] : null
    ]);
  }
}

IoOptionItemDemoView.Register();

class IoOptionsPathDemo extends IoElement {
  static get Properties() {
    return {
      value: Array,
    };
  }
  changed() {
    this.template([['io-item', {value: (this.value && this.value.length) ? JSON.stringify(this.value) : ''}]]);
  }
}
IoOptionsPathDemo.Register();

export class IoDemoMenu extends IoOptionsDemoView {
  static get Properties() {
    return {
      options: new Options([
        {value: 'home'}, 
        {value: 'food', options: [
          {value: 'fruits', options: [
            {value: 'apples', selected: true}, // TODO: use default selection instead selected: 'introduction', 
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

IoDemoMenu.Register();