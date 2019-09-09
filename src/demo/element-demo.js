import {IoElement, Binding} from "../io.js";
import {IoThemeSingleton, IoStorageFactory as $} from "../io-core.js";

const suboptions = [];
const options = [
  {label: "Red", icon: "❤️", options: [{value: "Red1"}, {value: "Red2"}, {value: "Red3"}]},
  {label: "Green", icon: "💚", options: [{value: "Green1"}, {value: "Green2"}, {value: "Green3"}]},
  {label: "Blue", icon: "💙", options: [{value: "Blue1"}, {value: "Blue2"}, {value: "Blue3"}]},
  {label: "Numbers", options: [
    {label: 'one', value: 1},
    {label: 'two', value: 2},
    {label: 'three', value: 3},
    {label: 'four', value: 4},
    {label: 'five', value: 5},
  ]},
  {label: "Suboptions", options: suboptions},
];
suboptions.push(...[
  {label: 'Hearts', options: options},
  {label: 'suboption one', options: options},
  {label: 'suboption two', options: options},
  {label: 'suboption three', options: options},
]);

const option = {
  "label": "Hearts",
  "icon": "💕",
  "hint": "colors",
  "options": options,
};

const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'ac', 'libero',
  'vitae', 'magna', 'tellus', 'nisl', 'wisi', 'lacinia', 'curae', 'mauris',
  'fusce', 'interdum', 'vestibulum', 'nunc', 'velit'];
const hearts = ["❤️", "💚", "💙", "💜", "🧡", "💔", "💖", "🖤", "💗", "💘"];
const longOptions = [];
for (let i = 0; i < 100; i++) {
  const r1 = words[Math.floor(Math.random() * 20)];
  const r2 = words[Math.floor(Math.random() * 20)];
  const r3 = words[Math.floor(Math.random() * 20)];
  const i = hearts[Math.floor(Math.random() * 10)] || '';
  longOptions.push({icon: i, label: r1 + ' ' + r2, value: Math.random(), hint: r3});
}

$({key: 'demo:boolean', value: true});
$({key: 'demo:string', value: 'Hello io!'});
$({key: 'demo:leet', value: 1337});
$({key: 'demo:number', value: 0});
$({key: 'demo:theme', value: IoThemeSingleton.bind('theme')});
$({key: 'demo:menuoptions', value: options});
$({key: 'demo:longmenuoptions', value: longOptions});
$({key: 'demo:menuoption', value: option});
$({key: 'demo:rgba', value: {"r": 1, "g": 0.5, "b": 0, "a": 1}});
$({key: 'demo:cmyk', value: {"c": 0, "m": 0, "y": 0, "k": 0}});
$({key: 'demo:object', value: {
  "number": 0.5,
  "string": "hello",
  "boolean": true,
  "object": {"prop1": 1, "prop2": 2},
  "array": [1, 2, 3, 4, 5],
}});

export class IoElementDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      @apply --io-panel;
      position: relative;
    }
    :host > io-boolicon {
      z-index: 2;
      position: absolute;
      top: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
      right: calc(calc(2 * var(--io-spacing)) + var(--io-border-width));
    }
    :host > io-boolicon:not([value]):not(:hover) {
      opacity: 0.5;
    }
    :host > io-properties {
      align-self: stretch;
      padding: var(--io-spacing) 0;
      margin: var(--io-border-width);
      margin-right: var(--io-spacing);
      margin-bottom: calc(2 * var(--io-spacing));
    }
    :host > io-properties > :nth-child(2) {
      margin-right: calc(var(--io-item-height) + var(--io-spacing));
    }
    :host:not([expanded]) > .io-content {
      margin-right: calc(var(--io-item-height) + calc(3 * var(--io-spacing)));
    }
    `;
  }
  static get Properties() {
    return {
      element: {
        type: String,
        reflect: -1,
      },
      properties: {
        type: Object,
        reflect: -1,
        observe: true,
      },
      width: {
        type: String,
        reflect: -1,
      },
      height: {
        type: String,
        reflect: -1,
      },
      config: {
        type: Object,
        reflect: -1,
        observe: true,
      },
      expanded: {
        type: Boolean,
        reflect: 2,
      }
    };
  }
  _onPropSet(event) {
    const p = event.detail.property;
    if (this.properties[p] instanceof Binding) {
      // TODO: unhack
    } else if (this.properties[p] !== undefined) {
      this.properties[p] = event.detail.value;
    }
    this.dispatchEvent('object-mutated', {
      object: this.properties,
      property: p,
      value: event.detail.value,
      oldValue: event.detail.oldValue,
    }, false, window);
  }
  propertiesChanged() {
    // TODO: Unhack demovalues
    for (let p in this.properties) {
      const prop = this.properties[p];
      if (typeof prop === 'string' && prop.startsWith('demo:')) {
        this.properties[p] = $({key: prop});
      }
      if (prop === 'undefined') {
        this.properties[p] = undefined;
      }
      this.properties['on-' + p + '-changed'] = this._onPropSet;
    }
  }
  changed() {
    const properties = this.properties;
    if (this.element) {
      const hasProps = !!Object.keys(properties).length;
      this.template([
        hasProps ? ['io-boolicon', {value: this.bind('expanded'), true: 'icons:gear', false: 'icons:gear'}] : null,
        (hasProps && this.expanded) ?
        ['io-properties', {value: properties, config: Object.assign({
            'type:number': ['io-number', {step: 0.00001}],
            'type:boolean': ['io-switch'],
          }, this.config)}] : null,
        ['div', {class: 'io-content'}, [
          // TODO: unhack demovalues
          [this.element, Object.assign({'id': 'demo-element'}, properties)],
        ]],
       ]);
       if (this.$['demo-element']) {
         if (this.width) this.$['demo-element'].style.width = this.width;
         if (this.height) this.$['demo-element'].style.height = this.height;
       }
    } else {
      this.template([null]);
    }
  }
}

IoElementDemo.Register();
