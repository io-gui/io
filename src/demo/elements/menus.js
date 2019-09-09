import {IoElement} from "../../io.js";
import {IoStorageFactory as $} from "../../io-core.js";

const menuoptions = [
  {label: 'Long Menu', options: $('demo:longmenuoptions').value},
  ...$('demo:menuoptions').value,
];

export class IoDemoMenus extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      padding-top: var(--io-spacing);
    }
    :host .io-row > *:not(:last-child) {
      margin-right: var(--io-spacing);
    }
    :host .io-column > *:not(:last-child) {
      margin-bottom: var(--io-spacing);
    }
    `;
  }
  constructor(props) {
    super(props);
    const value = $({value: 'menu value'});
    this.template([
      ['div', {class: 'io-column'}, [
        ['io-menu-options', {value: value, options: menuoptions, horizontal: true, selectable: true}],
        ['div', {class: 'io-row'}, [
          ['io-menu-options', {value: value, options: menuoptions, searchable: true}],
          ['div', {class: 'io-column'}, [
            ['div', [['span', {class: 'io-item'}, 'Selected:'], ['io-item', {value: value}]]],
            ['io-menu-item', {label: 'menu item', option: $('demo:menuoption')}],
            ['div', {class: 'io-content'}, [
              ['span', 'click for menu'],
              ['io-context-menu', {value: value, options: menuoptions, position: 'pointer', button: 0}],
            ]],
            ['div', {class: 'io-content'}, [
              ['span', 'right-click for menu'],
              ['io-context-menu', {value: value, options: menuoptions, position: 'pointer', button: 2}],
            ]],
          ]],
        ]],
      ]],
    ]);
  }
}

IoDemoMenus.Register();
