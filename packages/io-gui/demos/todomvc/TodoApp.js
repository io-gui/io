import { IoElement, Register, Storage as $, section, header, h1 } from 'io-gui';

import { TodoModel } from './TodoModel.js';
import { todoInput } from './TodoInput.js';
import { todoList } from './TodoList.js';
import { todoFooter } from './TodoFooter.js';
import { todoInfo } from './TodoInfo.js';

export class TodoApp extends IoElement {
  static get ReactiveProperties() {
    return {
      model: {
        type: TodoModel,
        value: new TodoModel(),
      },
      route: $({value: 'all', storage: 'hash', key: 'route'}),
    };
  }
  ready() {
    this.changed();
  }
  modelMutated() {
    this.changed();
  }
  changed() {
    const itemCount = this.model.items.length;
    this.render([
      section({class: 'todoapp'}, [
        header({class: 'header'}, [
          h1('todos'),
          todoInput({model: this.model}),
        ]),
        todoList({class: 'todo-list', model: this.model, route: this.route}),
        itemCount ? todoFooter({class: 'footer', model: this.model, route: this.bind('route')}) : null,
      ]),
      todoInfo({class: 'info'})
    ]);
  }
}
Register(TodoApp);
export const todoApp = TodoApp.vConstructor;