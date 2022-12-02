import { IoElement, RegisterIoElement, MenuOptions, MenuItem } from '../build/iogui.js';

// TODO: improve this test-demo

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
        background-color: transparent;
      }
      :host io-field.root {
        color: var(--io-color-link);
      }
      :host io-field.leaf {
        color: var(--io-color-focus);
      }
    `;
  }
  static get Properties() {
    return {
      options: {
        type: MenuOptions,
        strict: true,
        observe: true,
      },
    };
  }
  changed() {
    const options = [];
    for (let i = 0; i < this.options.length; i++) {
      options.push(['io-item-demo-view', {item: this.options[i]}]);
    }
    this.template([
      ['div', [
        ['io-field', {value: this.options.root || '', class: 'root'}],
        ['io-field', {value: this.options.path, class: 'path'}],
        ['io-field', {value: this.options.leaf || '', class: 'leaf'}],
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
      item: {
        type: MenuItem,
        strict: true,
        observe: true,
      },
    };
  }
  changed() {
    this.template([
      ['div', [
        this.item.select === 'toggle'
            ? ['io-boolean', {value: this.item.bind('selected'), true: 'icons:box_fill_checked', false: 'icons:box'}]
            : ['io-switch', {value: this.item.bind('selected')}],
        ['io-field', {value: this.item.label}],
      ]],
      this.item.hasmore ? ['io-options-demo-view', {options: this.item.options}] : null
    ]);
  }
}

RegisterIoElement(IoItemDemoView);

export class IoDemoMenu extends IoOptionsDemoView {
  static get Properties() {
    return {
      options: {value: new MenuOptions([
        {value: 'home'}, 
        {value: 'food', options: [
          {value: 'fruits', options: [
            {value: 'apples', selected: true},
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
    }};
  }
}

RegisterIoElement(IoDemoMenu);