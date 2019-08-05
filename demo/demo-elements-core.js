import {html, IoElement, IoStorage as $} from "../dist/io.js";
import {IoThemeSingleton} from "../dist/io-elements-core.js";

export class IoDemoElementsCore extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      max-width: 32em;
      padding: var(--io-spacing);
      grid-template-columns: auto 1fr !important;
    }
    :host > :nth-child(2n+1) {
      text-align: right;
    }
    @media only screen and (max-width: 400px) {
      :host {
        grid-template-columns: 0 1fr !important;
      }
      :host > :nth-child(2n+1) {
        visibility: hidden;
      }
    }

    :host .io-table5 {
      max-width: 32em;
    }
    :host .io-table5 > * {
      width: auto;
    }
    :host > *,
    :host .io-column > *:not(:last-child) {
      margin-bottom: var(--io-spacing)
    }
    </style>`;
  }
  static get Properties() {
    return {
      class: 'io-table2',
      number: 0.0,
      string: 'hello',
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
    };
  }
  changed(event) {
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
      {label: 'set five', value: 5, action: this.setNumber}
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
    const menu = ['div', {class: 'io-column'}, [
      ['io-menu-options', {options: menuoptions, horizontal: true}],
      ['div', {class: 'io-row'}, [
        ['io-menu-options', {options: menuoptions}],
        ['div', {class: 'io-column'}, [
          ['io-menu-item', {label: 'menu item', option: {options: menuoptions}}],
          ['div', {class: 'io-frame menuframe'}, [
            ['span', 'click for menu'],
            ['io-menu', {options: menuoptions, position: 'pointer', button: 0}],
          ]],
          ['div', {class: 'io-frame menuframe'}, [
            ['span', 'right-click for menu'],
            ['io-menu', {options: menuoptions, position: 'pointer', button: 2}],
          ]],
        ]]
      ]]
    ]];

    this.template([
      ['io-item', {label: 'Primitives'}],
      ['div', {class: 'io-table5 table'}, [
        ['io-string', {value: this.bind('string')}],
        ['io-number', {value: this.bind('string')}],
        ['io-boolean', {value: this.bind('string'), display: 'icon'}],
        ['io-boolean', {value: this.bind('string')}],
        ['io-boolean', {value: this.bind('string'), display: 'switch'}],
        ['io-string', {value: this.bind('number')}],
        ['io-number', {value: this.bind('number')}],
        ['io-boolean', {value: this.bind('number'), display: 'icon'}],
        ['io-boolean', {value: this.bind('number')}],
        ['io-boolean', {value: this.bind('number'), display: 'switch'}],
        ['io-string', {value: this.bind('boolean')}],
        ['io-number', {value: this.bind('boolean')}],
        ['io-boolean', {value: this.bind('boolean'), display: 'icon'}],
        ['io-boolean', {value: this.bind('boolean')}],
        ['io-boolean', {value: this.bind('boolean'), display: 'switch'}],
      ]],
      ['div'],
      ['div', {class: 'io-column'}, [
        ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
        ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
        ['io-slider', {value: this.bind('number'), min: -1.33, max: 3.5, step: 0.8}],
        ['io-slider', {value: this.bind('number'), min: -0.25, max: 0.25, step: 0.01}],
        ['io-slider', {value: this.bind('string'), min: -0.25, max: 0.25, step: 0.01}],
      ]],
      ['div'],
      ['div', {class: 'io-table4 table'}, [
        ['io-menu-option', {options: [
          {label: 'negative one', value: -1},
          {label: 'zero', value: 0},
          {label: 'half', value: 0.5},
          {label: 'one', value: 1},
          {label: 'two', value: 2},
          {label: 'three', value: 3},
          {label: 'four', value: 4},
          {label: 'leet', value: 1337},
        ], value: this.bind('number')}],
        ['io-menu-option', {options: [ -1, 0, 1, 2, 3, 4, 1337], value: this.bind('number')}],
        ['io-button', {label: 'set 0.5', action: this.setNumber, value: 0.5}],
        ['io-menu-option', {label: 'Theme ▾', value: IoThemeSingleton.bind('theme'), options: ['light', 'dark']}],
      ]],
      ['io-item', {label: 'io-properties'}],
      ['div', {class: 'io-column'}, [
        ['io-properties', {value: this, properties: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined']}], //TODO: labeled?
      ]],
      ['io-item', {label: 'io-object'}],
      ['div', {class: 'io-column'}, [
        ['io-object', {value: this, label: 'io-object (filtered properties)', expanded: $('io-object1', true), properties: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined']}], //TODO: labeled?
        ['io-object', {value: this, label: 'io-object (configured property)', expanded: $('io-object2', true), properties: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
      ]],
      ['io-item', {label: 'io-inspector'}],
      ['div', {class: 'io-column'}, [
        ['io-inspector', {value: this, expanded: ['properties']}],
      ]],
    ]);
  }
}

IoDemoElementsCore.Register();
