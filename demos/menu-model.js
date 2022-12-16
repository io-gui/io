import { IoElement, RegisterIoElement, MenuOptions, MenuItem } from '../build/iogui.js';

// TODO: improve this test-demo

export class IoOptionsDemoView extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        align-self: stretch;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: var(--iotBorderRadius);
      }
      :host > div {
        background-color: var(--iotBackgroundColorDark);
        display: flex;
        height: var(--iotLineHeight);
      }
      :host io-item-demo-view {
        margin-left: var(--iotSpacing);
      }
      :host io-label {
        background-color: transparent;
      }
      :host io-label.first {
        color: var(--iotColorLink);
      }
      :host io-label.path {
        margin-left: 0.5em;
        color: var(--iotColorLink);
      }
      :host io-label.last {
        margin-left: 0.5em;
        color: var(--iotColorLink);
      }
      :host io-label.anchor {
        margin-left: 0.5em;
        color: var(--iotColorLink);
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
        this.options.first ? [['io-label', {label: 'first:', class: 'first'}], ['io-label', {label: this.options.first}]] : null,
        this.options.last ? [['io-label', {label: 'last:', class: 'last'}], ['io-label', {label: this.options.last}]] : null,
        this.options.anchor ? [['io-label', {label: 'anchor:', class: 'anchor'}], ['io-label', {label: this.options.anchor}]] : null,
        this.options.path ? [['io-label', {label: 'path:', class: 'path'}], ['io-label', {label: this.options.path}]] : null,
      ]],
      options
    ]);
  }
}

RegisterIoElement(IoOptionsDemoView);

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
        observe: true,
      },
    };
  }
  changed() {
    let selectElement = null;
    if (this.item.mode === 'toggle') {
      selectElement = ['io-boolean', {value: this.item.bind('selected'), true: 'icons:box_fill_checked', false: 'icons:box'}];
    } else if (this.item.mode === 'select' || this.item.mode === 'anchor') {
      selectElement = ['io-boolean', {value: this.item.bind('selected'), true: 'icons:box_fill_checked', false: 'icons:box'}];
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

RegisterIoElement(IoItemDemoView);

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
          {value: 'anchors', options: [
            {value: 'anchor1', mode: 'anchor'},
            {value: 'anchor2', mode: 'anchor'},
            {value: 'anchor3', mode: 'anchor'},
            {value: 'anchor4', mode: 'anchor'},
          ]},
          {value: 'togglables', mode: 'none', options: [
            {value: 'toggle1', mode: 'toggle'},
            {value: 'toggle2', mode: 'toggle'},
            {value: 'toggle3', mode: 'toggle'},
            {value: 'toggle4', mode: 'toggle'},
          ]},
          {value: 'selectable', options: [
            {value: 'toggle', mode: 'toggle'},
            {value: 'anchor', mode: 'anchor'},
            {value: 'selectable'},
          ]},
        ]}
      ])
    }};
  }
}

RegisterIoElement(IoDemoMenuModel);