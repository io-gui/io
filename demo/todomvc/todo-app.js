import {html, IoElement, IoStorage} from "../../dist/io.js";
import {TodoModel} from "./todo-model.js";
import "./todo-new-item.js";
import "./todo-list.js";
import "./todo-item.js";
import "./todo-footer.js";
import "./todo-info.js";

export class TodoApp extends IoElement {
  static get Style() {
    return html`
    <style>
    :host {
      display: block;
      padding: 1em;
      font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.4em;
      background: #f5f5f5;
      color: #4d4d4d;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 300;
    }
    :host button,
    :host input[type="checkbox"] {
      outline: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      font-size: 100%;
      vertical-align: baseline;
      font-family: inherit;
      font-weight: inherit;
      color: inherit;
      -webkit-appearance: none;
      appearance: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host > .todoapp {
      background: #fff;
      margin: 130px 0 40px 0;
      position: relative;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
                  0 25px 50px 0 rgba(0, 0, 0, 0.1);
    }

    :host > .todoapp input::-webkit-input-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }

    :host > .todoapp input::-moz-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }

    :host > .todoapp input::input-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }

    :host > .todoapp h1 {
      position: absolute;
      top: -155px;
      width: 100%;
      font-size: 100px;
      font-weight: 100;
      text-align: center;
      color: rgba(175, 47, 47, 0.15);
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
    }
    </style>
    `;
  }
  static get Properties() {
    return {
      model: TodoModel,
      route: IoStorage('route', 'all', true),
    };
  }
  changed() {
    const itemCount = this.model.items.length;
    this.template([
      ['section', {class: 'todoapp'}, [
        ['header', {class: 'header'}, [['h1', 'todos'],]],
        ['todo-new-item', {model: this.model}],
        ['todo-list', {model: this.model, route: this.route}],
        itemCount ? ['todo-footer', {model: this.model, route: this.bind('route')}] : null,
      ]],
      ['todo-info']
    ]);
  }
}

TodoApp.Register();
