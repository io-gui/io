import {html, IoStorage as $} from "../io.js";
import {IoSelectorTabs} from "../io-layout.js";

import "./elements/core.js"
import "./elements/theme.js"
import "./elements/menus.js"
import "./elements/object.js"
import "./elements/math.js"
import "./elements/color.js"

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
        ['io-demo-core', {name: 'elements-core'}],
        ['io-demo-theme', {name: 'elements-theme'}],
        ['io-demo-menus', {name: 'elements-menus'}],
        ['io-demo-object', {name: 'elements-object'}],
        ['io-demo-math', {name: 'elements-math'}],
        ['io-demo-color', {name: 'elements-color'}],
        ['iframe', {name: 'todo', title: 'TODO MVC', src: './src/demo/todomvc/index.html'}],
      ],
    };
  }
}

IoDemo.Register();
