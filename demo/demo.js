import {html, IoElement, IoStorage as $} from "../dist/io.js";
import {IoThemeSingleton} from "../dist/io-elements-core.js";
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
        {value: 'elements-menus', label: "Menus"},
        {value: 'elements-object', label: "Object"},
        {value: 'elements-math', label: "Math"},
        {value: 'elements-color', label: "Color"},
        {value: 'todo', label: "Todo App"},
      ],
      elements: [
        ['io-demo-elements-core', {name: 'elements-core', import: new URL('demo-elements-core.js', import.meta.url)}],
        ['io-demo-elements-menus', {name: 'elements-menus', import: new URL('demo-elements-menus.js', import.meta.url)}],
        ['io-demo-elements-object', {name: 'elements-object', import: new URL('demo-elements-object.js', import.meta.url)}],
        ['io-demo-elements-math', {name: 'elements-math', import: new URL('demo-elements-math.js', import.meta.url)}],
        ['io-demo-elements-color', {name: 'elements-color', import: new URL('demo-elements-color.js', import.meta.url)}],
        ['iframe', {name: 'todo', src: './demo/todomvc/index.html'}],
      ],
    };
  }
}

IoDemo.Register();
