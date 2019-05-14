import {html, IoElement, IoStorage as $, IoInspector} from "../build/io.min.js";
import {menuoptions} from "./demo_menuoptions.js";

export class IoDemo extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
      }
      :host > * {
        margin: var(--io-theme-spacing);
      }
      :host .table {
        display: grid;
        grid-template-columns: 5.5em 5.5em 5.5em;
        grid-gap: var(--io-theme-spacing);
      }
      :host .sidebar {
        display: inline-block;
      }
      :host io-object:not(:last-of-type),
      :host io-slider:not(:last-of-type) {
        margin-bottom: var(--io-theme-spacing);
      }
      :host io-layout {
        height: 800px;
      }
      :host .warning {
        margin: 0.5em;
        padding: 0.5em;
        border: 1px solid red;
        border-radius: 0.5em;
      }
    </style>`;
  }
  static get properties() {
    return {
      title: 'demo',
      number: 0.5,
      string: 'hello',
      boolean: true,
      null: null,
      NaN: NaN,
      undefined: undefined,
      menuoptions: function() { return menuoptions },
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

    if (!("PointerEvent" in window)) console.warn("No PointerEvents support!");
    const pointerEventsWarning = [
      "PointerEvent" in window ? [] : ['div', {className: 'warning'}, [
        ['p', 'This feature requires missing PointerEvents support!'],
        ['a', {href: "https://github.com/jquery/PEP#why-pointer-events"}, 'Learn more about the API!'],
      ]]
    ]

    const demoPrimitives = ['div', {label: 'primitives', className: 'table'}, [
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

    const demoSliders = ['div', {label: 'sliders'}, [
      pointerEventsWarning,
      ['io-slider', {value: this.bind('number')}],
      ['io-slider', {value: this.bind('number'), min: 0.05, step: 0.1}],
      ['io-slider', {value: this.bind('number'), min: 0, max: 2, step: 1}],
      ['io-slider', {value: this.bind('number'), min: -2, max: 3, step: 1}],
      ['io-slider', {value: this.bind('number'), min: -1, max: 1, step: 0.1}],
      ['io-slider', {value: this.bind('NaN'), step: 0.1}],
    ]];

    const demoOptions = ['div', {label: 'options'}, [
      pointerEventsWarning,
      ['io-option', {options: [
        {label: 'negative one', value: -1},
        {label: 'zero', value: 0},
        {label: 'one', value: 1},
        {label: 'two', value: 2},
        {label: 'three', value: 3},
        {label: 'four', value: 4},
        {label: 'leet', value: 1337},
      ], value: this.bind('number')}],
    ]];

    const demoButton = ['div', {label: 'button', className: 'table'}, [
      ['io-button', {label: 'set .5', action: this.setNumber, value: 0.5}],
      ['io-button', {label: 'set 1', action: this.setNumber, value: 1}],
      ['io-button', {label: 'set 2', action: this.setNumber, value: 2}],
      ['io-button', {label: 'null', action: this.setNumber, value: null}],
      ['io-button', {label: 'NaN', action: this.setNumber, value: NaN}],
      ['io-button', {label: 'undef', action: this.setNumber, value: undefined}],
    ]];

    const demoObject = ['div', {label: 'object'}, [
      ['io-object', {value: this, label: 'IoDemo (filtered property list)', expanded: $('io-object1'), props: ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'menuoptions', 'options', 'numbers']}], //TODO: labeled?
      ['io-object', {value: this, label: 'IoDemo (single configured property)', labeled: false, expanded: $('io-object2'), props: ['number'], config: {'number': ['io-slider', {step: 0.1}]}}],
      ['io-object', {value: menuoptions, label: 'Array (menu options)', expanded: $('io-object3')}],
    ]];

    const demoInspector = ['div', {label: 'inspector'}, [
      ['io-inspector', {value: this, expanded: ['properties']}],
    ]];

    const demoMenu = ['div', {label: 'menu'}, [
      pointerEventsWarning,
      ['div', 'right-click (contextmenu)'],
      ['io-menu', {options: menuoptions, position: 'pointer', button: 2, ondown: false}],
      ['io-menu-options', {className: 'sidebar', options: menuoptions}],
      ['io-menu-options', {className: 'menubar', options: menuoptions, horizontal: true}],
    ]];

    const demoLayout = ['div', {label: 'layout', expanded: $('layout')}, [
      pointerEventsWarning,
      ['io-layout', {
        orientation: 'horizontal',
        elements: [
          demoPrimitives,
          demoSliders,
          demoOptions,
          demoButton,
          demoObject,
          demoInspector,
          demoMenu,
        ],
        splits: [
          {selected: 'primitives', tabs: ['primitives'], size: 280},
          {orientation: 'vertical', splits: [
            {tabs: ['button'], selected: 'button', size: 100},
            {tabs: ['primitives', 'sliders', 'options', 'button', 'object', 'menu', 'inspector'], selected: 'sliders'},
            {tabs: ['primitives'], selected: 'primitives'},
            {tabs: ['menu'], selected: 'menu', size: 10},
          ]},
        ],
      }],
    ]]

    // TODO: Add demos for all remaining elements

    this.template([
      ['io-collapsable', {label: 'Primitives', expanded: $('Primitives'), elements: [demoPrimitives]}],
      ['io-collapsable', {label: 'Sliders', expanded: $('Sliders'), elements: [demoSliders]}],
      ['io-collapsable', {label: 'Options', expanded: $('Options'), elements: [demoOptions]}],
      ['io-collapsable', {label: 'Button', expanded: $('Button'), elements: [demoButton]}],
      ['io-collapsable', {label: 'Object', expanded: $('Object'), elements: [demoObject]}],
      ['io-collapsable', {label: 'Inspector', expanded: $('Inspector'), elements: [demoInspector]}],
      ['io-collapsable', {label: 'Menu', expanded: $('Menu'), elements: [demoMenu]}],
      ['io-collapsable', {label: 'Layout', expanded: $('Layout'), elements: [demoLayout]}],
      ['io-button', {label: 'Stress Test!', action: animate}],
    ]);
  }
}

function animate() {
  requestAnimationFrame(animate);
  $('Primitives').source.value = Math.random() < 0.5;
  $('Sliders').source.value = Math.random() < 0.5;
  $('Options').source.value = Math.random() < 0.5;
  $('Button').source.value = Math.random() < 0.5;
  $('Object').source.value = Math.random() < 0.5;
  $('Inspector').source.value = Math.random() < 0.5;
  $('Menu').source.value = Math.random() < 0.5;
  $('Layout').source.value = Math.random() < 0.5;
}

IoInspector.RegisterConfig({
  'IoDemo|variables': ['number', 'string', 'boolean', 'null', 'NaN', 'undefined', 'object', 'menuoptions', 'options', 'numbers'],
});

IoDemo.Register();
