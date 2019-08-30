import {html, IoElement} from "../../io.js";

export class IoDemoMenus extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      max-width: 32em;
      padding: var(--io-spacing);
    }
    :host > *,
    :host .io-row > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host .io-column > *:not(:last-child) {
      margin-bottom: var(--io-spacing);
    }
    </style>`;
  }
  static get Properties() {
    return {
      number: 0.0,
    };
  }
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  setNumber(value) {
    this.number = value;
  }
  constructor(props) {
    super(props);
    this.setNumber = this.setNumber.bind(this);

    const options = [
      {label: 'set one', value: 1, action: this.setNumber},
      {label: 'set two', value: 2, action: this.setNumber},
      {label: 'set three', value: 3, action: this.setNumber},
      {label: 'set four', value: 4, action: this.setNumber},
      {label: 'set five', value: 5, action: this.setNumber},
      {label: 'set null', value: null, action: this.setNumber},
    ];
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
      'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
      'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
    const hearts = ["❤️", "💚", "💙"];
    const longOptions = [];
    for (let i = 0; i < 100; i++) {
      const r1 = words[Math.floor(Math.random() * 20)];
      const r2 = words[Math.floor(Math.random() * 20)];
      const r3 = words[Math.floor(Math.random() * 20)];
      const i = hearts[Math.floor(Math.random() * 9)] || '';
      longOptions.push({icon: i, label: r1 + ' ' + r2, value: 0, action: this.setNumber, hint: r3});
    }
    const menuoptions = [
      {label: 'first', options: options},
      {label: 'second', options: [
        {label: 'suboption one', options: options},
        {label: 'suboption two', options: options},
        {label: 'suboption three', options: options},
      ]},
      {label: 'long menu', options: longOptions, hint: 'list', icon: '⚠'}
    ];

    this.template([
      ['div', {class: 'io-column'}, [
        ['io-menu-options', {options: menuoptions, horizontal: true}],
        ['div', {class: 'io-row'}, [
          ['io-menu-options', {options: menuoptions}],
          ['div', {class: 'io-column'}, [
            ['io-menu-item', {label: 'menu item', option: {options: menuoptions}}],
            ['div', {class: 'io-frame menuframe'}, [
              ['span', 'click for menu'],
              ['io-context-menu', {options: menuoptions, position: 'pointer', button: 0}],
            ]],
            ['div', {class: 'io-frame menuframe'}, [
              ['span', 'right-click for menu'],
              ['io-context-menu', {options: menuoptions, position: 'pointer', button: 2}],
            ]],
          ]]
        ]]
      ]]
    ]);
  }
}

IoDemoMenus.Register();
