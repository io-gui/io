import { IoElement, Register, MenuOptions, MenuItem } from 'io-gui';

// TODO: improve this test-demo

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
      :host io-label {
        background-color: transparent;
        color: var(--io_color);
      }
      :host io-label.first {
        color: var(--io_colorBlue);
      }
      :host io-label.path {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host io-label.last {
        margin-left: 0.5em;
        color: var(--io_colorBlue);
      }
      :host io-label.scroll {
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
  changed() {
    const options = [];
    for (let i = 0; i < this.options.length; i++) {
      options.push(['io-item-demo-view', {item: this.options[i]}]);
    }
    this.template([
      ['div', [
        this.options.first ? [['io-label', {label: 'first:', class: 'first'}], ['io-label', {label: this.options.first}]] : null,
        this.options.last ? [['io-label', {label: 'last:', class: 'last'}], ['io-label', {label: this.options.last}]] : null,
        this.options.scroll ? [['io-label', {label: 'scroll:', class: 'scroll'}], ['io-label', {label: this.options.scroll}]] : null,
        this.options.path ? [['io-label', {label: 'path:', class: 'path'}], ['io-label', {label: this.options.path}]] : null,
      ]],
      options
    ]);
  }
}

Register(IoOptionsDemoView);

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
  changed() {
    let selectElement = null;
    if (this.item.mode === 'toggle') {
      selectElement = ['io-boolicon', {value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'}];
    } else if (this.item.mode === 'select' || this.item.mode === 'scroll') {
      selectElement = ['io-boolicon', {value: this.item.bind('selected'), true: 'io:box_fill_checked', false: 'io:box'}];
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

Register(IoItemDemoView);

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
            {value: 'selectable'},
          ]},
        ]}
      ])
    }};
  }
}

Register(IoDemoMenuModel);