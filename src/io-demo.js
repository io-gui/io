import {html, IoStorageFactory as $} from "./io.js";
import {IoSelectorTabs} from "./io-layout.js";

import "./demo/element-demo.js";
import "./demo/elements/core.js";
import "./demo/elements/theme.js";
import "./demo/elements/menus.js";
import "./demo/elements/object.js";
import "./demo/elements/math.js";
import "./demo/elements/color.js";

export class IoDemo extends IoSelectorTabs {
  static get Style() {
    return html`<style>
    :host iframe[name=todo] {
      border: none;
      flex: 1 1;
    }
    </style>`;
  }
  static get Properties() {
    return {
      selected:  $({value: 'core', storage: 'hash', key: 'demo'}),
      options: [
        {value: 'core', label: "Core"},
        {value: 'theme', label: "Theme"},
        {value: 'menus', label: "Menus"},
        {value: 'object', label: "Object"},
        {value: 'math', label: "Math"},
        {value: 'color', label: "Color"},
        {value: 'todo', label: "Todo App"},
      ],
      elements: [
        ['io-demo-core', {name: 'core'}],
        ['io-demo-theme', {name: 'theme'}],
        ['io-demo-menus', {name: 'menus'}],
        ['io-demo-object', {name: 'object'}],
        ['io-demo-math', {name: 'math'}],
        ['io-demo-color', {name: 'color'}],
        ['iframe', {name: 'todo', title: 'TODO MVC', src: './src/demo/todomvc/index.html'}],
      ],
    };
  }
}

IoDemo.Register();
