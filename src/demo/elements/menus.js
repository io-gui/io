import {IoElement, IoStorageFactory as $} from "../../io.js";

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
    this.template([
      ['div', {class: 'io-column'}, [
        ['io-menu-options', {options: menuoptions, horizontal: true, selectable: true}],
        ['div', {class: 'io-row'}, [
          ['io-menu-options', {options: menuoptions}],
          ['div', {class: 'io-column'}, [
            ['io-menu-item', {label: 'menu item', option: $('demo:menuoption')}],
            ['div', {class: 'io-content'}, [
              ['span', 'click for menu'],
              ['io-context-menu', {options: menuoptions, position: 'pointer', button: 0}],
            ]],
            ['div', {class: 'io-content'}, [
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
