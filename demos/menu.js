import {IoElement, Options, OptionItem} from '../../io/build/io.js';
import  '../../io/build/io-elements.js';

function writePath(path) {
  if (path && path.length) return JSON.stringify(path);
  return '';
}

class IoOptionsDemoView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
      }
      :host > div {
        background-color: rgb(220,220,205);
        display: flex;
      }
      :host io-option-item-demo-view {
        margin-left: 0.5em;
      }
      :host io-item {
        margin-left: 0.5em;
      }
      :host io-item.root {
        color: rgba(120, 20, 0, 0.5);
      }
      :host io-item.path {
        color: rgba(20, 120, 0, 0.5);
      }
      :host io-item.leaf {
        color: rgba(0, 20, 120, 0.5);
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
        ['io-item', {value: writePath(this.options.selectedPath), class: 'path'}],
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
        ['io-item', {value: writePath(this.option.selectedPath), class: 'path'}],
        ['io-item', {value: this.option.bind('selectedLeaf'), class: 'leaf'}],
      ]],
      this.option.hasmore ? ['io-options-demo-view', {options: this.option.options}] : null
    ]);
  }
}
IoOptionItemDemoView.Register();

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