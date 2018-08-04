import {IoElement} from "../../build/io.js";
import {TodoModel} from "./todo-model.js";
import "./todo-footer.js";
import "./todo-input.js";
import "./todo-item.js";
import "./todo-list.js";

export class TodoApp extends IoElement {
  static get properties() {
    return {
      model: Object
    };
  }
  constructor() {
    super();
    this.model = new TodoModel();
  }
  changed() {
    console.log(this.model.areAllCompleted());
    this.template([
      ['section', {className: 'todoapp'}, [
        ['header', {className: 'header'}, [
          ['h1', 'todos'],
        ]],
        ['todo-input', {model: this.model}],
        ['section', {className: 'main'}, [
          ['input', {type: 'checkbox', className: 'toggle-all', checked: this.model.areAllCompleted(), 'on-click': this.model.toggleItemsCompleted}],
          ['todo-list', {model: this.model}]
        ]],
        this.model.items.length ? ['todo-footer', {model: this.model}] : null
      ]],
      ['footer', {className: 'info'}, [
        ['p', 'Double-click to edit a todo'],
        ['p', 'Created by Aki Rodić'],
        ['p', 'Part of TodoMVC'],
      ]]
    ]);
  }
}

TodoApp.Register();
