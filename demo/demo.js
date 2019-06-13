import {html, IoElement, IoStorage as $} from "../build/io.min.js";

export class IoDemo extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
      }
      :host > io-element-selector-tabs {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
      }
      :host > io-element-selector-tabs > io-element-selector {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
      }
      :host .table {
        display: grid;
        grid-template-columns: 5.5em 5.5em 5.5em;
        grid-gap: var(--io-spacing);
      }
      :host .sidebar {
        display: inline-block;
      }
      :host io-object:not(:last-of-type),
      :host io-slider:not(:last-of-type) {
        margin-bottom: var(--io-spacing);
      }
      :host > io-element-selector-tabs > io-element-selector > io-layout {
        height: 600px;
        flex: 1 0 auto;
      }
      :host .warning {
        margin: 0.5em;
        padding: 0.5em;
        border: 1px solid red;
        border-radius: 0.5em;
      }
      :host div[name=Elements] {
        padding: var(--io-spacing);
      }
    </style>`;
  }
  static get properties() {
    return {
      number: 0.5,
      string: 'hello',
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      menuoptions: null,
    };
  }
  changed(event) {
    // console.log(this.number);
    // TODO: investigade excessive change events.
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
  setNumber(value) {
    this.number = value;
  }

  constructor(props) {
    super(props);

    if (!("PointerEvent" in window)) console.warn("No PointerEvents support!");
    const pointerEventsWarning = [
      "PointerEvent" in window ? [] : ['div', {className: 'warning'}, [
        ['p', 'This feature requires missing PointerEvents support!'],
        ['a', {href: "https://github.com/jquery/PEP#why-pointer-events"}, 'Learn more about the API!'],
      ]]
    ]

    const demoPrimitives = ['div', {name: 'primitives', className: 'table'}, [
      ['span', 'io-string'],
      ['span', 'io-number'],
      ['span', 'io-boolean'],
      ['io-string', {id: 'string', value: this.bind('string')}],
      ['io-number', {value: this.bind('string')}],
      ['io-boolean', {type: 'boolean', value: this.bind('string')}],
      ['io-string', {value: this.bind('number')}],
      ['io-number', {id: 'number', value: this.bind('number')}],
      ['io-boolean', {type: 'boolean', value: this.bind('number')}],
      ['io-string', {value: this.bind('boolean')}],
      ['io-number', {value: this.bind('boolean')}],
      ['io-boolean', {id: 'boolean', type: 'boolean', value: this.bind('boolean')}],
      ['io-string', {value: this.bind('NaN')}],
      ['io-number', {value: this.bind('NaN')}],
      ['io-boolean', {type: 'boolean', value: this.bind('NaN')}],
      ['io-string', {value: this.bind('null')}],
      ['io-number', {value: this.bind('null')}],
      ['io-boolean', {type: 'boolean', value: this.bind('null')}],
      ['io-string', {value: this.bind('undefined')}],
      ['io-number', {value: this.bind('undefined')}],
      ['io-boolean', {type: 'boolean', value: this.bind('undefined')}],
    ]];

    const demoSwitch = ['div', {name: 'switch'}, [
      ['io-switch', {value: this.bind('boolean')}],
    ]];

    const demoSliders = ['div', {name: 'sliders'}, [
      ['io-slider', {value: this.bind('number')}],
      ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
      ['io-slider', {value: this.bind('number'), min: -2, max: 3, step: 1}],
      ['io-slider', {value: this.bind('number'), min: -0.25, max: 0.25, step: 0.01}],
      ['io-slider', {value: this.bind('NaN'), step: 0.1}],
    ]];

    const demoOptions = ['div', {name: 'options'}, [
      ['io-option', {options: [
        {label: 'negative one', value: -1},
        {label: 'zero', value: 0},
        {label: 'one', value: 1},
        {label: 'two', value: 2},
        {label: 'three', value: 3},
        {label: 'four', value: 4},
        {label: 'leet', value: 1337},
      ], value: this.bind('number')}],
      ['io-option', {options: [ -1, 0, 1, 2, 3, 4, 1337], value: this.bind('number')}],
    ]];

    const demoButton = ['div', {name: 'button', className: 'table'}, [
      ['io-button', {label: 'set 0.3', action: this.setNumber, value: 0.3}],
      ['io-button', {label: 'set 1', action: this.setNumber, value: 1}],
      ['io-button', {label: 'set 2', action: this.setNumber, value: 2}],
      ['io-button', {label: 'null', action: this.setNumber, value: null}],
      ['io-button', {label: 'NaN', action: this.setNumber, value: NaN}],
      ['io-button', {label: 'undef', action: this.setNumber, value: undefined}],
    ]];

    const demoObject = ['div', {name: 'object'}, [
      ['io-object', {value: this, label: 'IoDemo (filtered property list)', expanded: $('io-object1'), props: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'menuoptions', 'options', 'numbers']}], //TODO: labeled?
      ['io-object', {value: this, label: 'IoDemo (single configured property)', labeled: false, expanded: $('io-object2'), props: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
    ]];

    const demoInspector = ['div', {name: 'inspector'}, [
      ['io-inspector', {value: this, expanded: ['properties']}],
    ]];

    const options = [
      {label: 'set one', value: 1, action: this.setNumber},
      {label: 'set two', value: 2, action: this.setNumber},
      {label: 'set three', value: 3, action: this.setNumber},
      {label: 'set four', value: 4, action: this.setNumber},
      {label: 'set five', value: 5, action: this.setNumber}
    ];
    this.menuoptions = [
      {label: 'file', options: options},
      {label: 'view', options: [
        {label: 'suboption one', options: options},
        {label: 'suboption two', options: options},
        {label: 'suboption three', options: options},
      ]},
      {label: 'long menu', options: new Array(100).fill({label: 'Set 0', value: 0, action: this.setNumber, icon: '>', hint: 'set'}), hint: 'list', icon: '⚠'}
    ];

    const demoMenu = ['div', {name: 'menu'}, [
      ['div', [
        ['span', 'right-click (contextmenu)'],
        ['io-menu', {options: this.menuoptions, position: 'pointer', button: 2}], ['br'],
      ]], ['br'],
      ['div', [
        ['span', 'click'],
        ['io-menu', {options: this.menuoptions, position: 'pointer', button: 0}], ['br'],
      ]], ['br'],
      ['io-menu-options', {className: 'sidebar', options: this.menuoptions}], ['br'], ['br'],
      ['io-menu-options', {className: 'menubar', options: this.menuoptions, horizontal: true}],
    ]];

    const demoLayout = ['io-layout', {
      name: 'Layout',
      orientation: 'horizontal',
      elements: [
        demoPrimitives,
        demoSwitch,
        demoSliders,
        demoOptions,
        demoButton,
        demoObject,
        demoInspector,
        demoMenu,
      ],
      splits: [
        {selected: 'sliders', tabs: ['sliders'], size: 280},
        {orientation: 'vertical', splits: [
          {tabs: ['button'], selected: 'button', size: 100},
          {tabs: ['primitives', 'sliders', 'options', 'button', 'object', 'menu', 'inspector'], selected: 'inspector'},
          {tabs: ['primitives'], selected: 'primitives'},
        ]},
      ],
    }];

    // TODO: Add demos for all remaining elements

    this.template([
      ['io-element-selector-tabs', {precache: true, selected: $('demo', 'Elements'), elements: [
        ['div', {name: 'Elements'}, [
          ['h4', 'io-quad'], ['io-quad', {style: {height: '257px', width: '257px'}}],
          ['h4', 'io-string io-number io-boolean'], demoPrimitives,
          ['h4', 'io-switch'], demoSwitch,
          ['h4', 'io-slider'], demoSliders,
          ['h4', 'io-options'], demoOptions,
          ['h4', 'io-button'], demoButton,
          ['h4', 'io-menu'], demoMenu,
          ['h4', 'io-object'], demoObject,
          ['h4', 'io-inspector'], demoInspector,
        ]],
        demoLayout,
      ]}]
    ]);
  }
}

IoDemo.Register();
