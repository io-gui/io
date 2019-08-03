import {html, IoElement, IoStorage as $} from "../dist/io.js";
import {IoThemeSingleton} from "../dist/io-elements-core.js";
import {IoSelectorTabs} from "../dist/io-elements-layout.js";
import "./todomvc/todo-app.js";
import "./demo-elements-core.js";
import "./demo-elements-math.js";

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
      selected:  $('demo', 'elements-math'),
      options: [
        {value: 'elements-core', label: "Core Elements"},
        {value: 'elements-math', label: "Math Elements"},
        {value: 'todo', label: "Todo App"},
      ],
      elements: [
        ['io-demo-elements-core', {name: 'elements-core'}],
        ['io-demo-elements-math', {name: 'elements-math'}],
        ['iframe', {name: 'todo', src: './demo/todomvc/index.html'}],
      ],
    };
  }
}

IoDemo.Register();
