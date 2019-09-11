import {IoStorageFactory as $} from "./io-core.js";
import {IoSelectorTabs} from "./io-layout.js";

import "./demo/element-demo.js";
import "./demo/elements/core.js";
import "./demo/elements/theme.js";
import "./demo/elements/menus.js";
import "./demo/elements/object.js";

export class IoDemo extends IoSelectorTabs {
  static get Style() {
    return /* css */`
    :host iframe[name=todo] {
      border: none;
      flex: 1 1;
    }
    `;
  }
  static get Properties() {
    return {
      selected:  $({value: 'core', storage: 'hash', key: 'demo'}),
      options: [
        {value: 'core', label: "Core"},
        {value: 'theme', label: "Theme"},
        {value: 'menus', label: "Menus"},
        {value: 'objects', label: "Objects"},
        {value: 'three', label: "Three.js"},
        {value: 'todo', label: "Todo App"},
      ],
      elements: [
        ['io-demo-core', {name: 'core'}],
        ['io-demo-theme', {name: 'theme'}],
        ['io-demo-menus', {name: 'menus'}],
        ['io-demo-object', {name: 'objects'}],
        ['io-demo-three', {name: 'three', import: './src/demo/elements/three.js'}],
        ['iframe', {name: 'todo', title: 'TODO MVC', src: './src/demo/todomvc/index.html'}],
      ],
    };
  }
}

IoDemo.Register();
