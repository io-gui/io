import {html, IoStorage as $} from "../dist/io.js";
import {IoSelectorTabs} from "../dist/io-elements-layout.js";

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
      selected:  $('demo', 'elements-math', true),
      options: [
        {value: 'elements-core', label: "Core"},
        {value: 'elements-theme', label: "Theme"},
        {value: 'elements-menus', label: "Menus"},
        {value: 'elements-object', label: "Object"},
        {value: 'elements-math', label: "Math"},
        {value: 'elements-color', label: "Color"},
        {value: 'todo', label: "Todo App"},
      ],
      elements: [
        ['io-demo-core', {name: 'elements-core', import: 'demo/demo-core.js'}],
        ['io-demo-theme', {name: 'elements-theme', import: 'demo/demo-theme.js'}],
        ['io-demo-menus', {name: 'elements-menus', import: 'demo/demo-menus.js'}],
        ['io-demo-object', {name: 'elements-object', import: 'demo/demo-object.js'}],
        ['io-demo-math', {name: 'elements-math', import: 'demo/demo-math.js'}],
        ['io-demo-color', {name: 'elements-color', import: 'demo/demo-color.js'}],
        ['iframe', {name: 'todo', title: 'TODO MVC', src: './demo/todomvc/index.html'}],
      ],
    };
  }
}

IoDemo.Register();
