import { IoElement, Register, IoStorage as $, section, header, h1 } from 'io-gui';

import { TodoModel } from './todo-model.js';
import { todoNewItem } from './todo-new-item.js';
import { todoList } from './todo-list.js';
import { todoFooter } from './todo-footer.js';
import { todoInfo } from './todo-info.js';

export class TodoApp extends IoElement {
  static get Properties() {
    return {
      model: {
        type: TodoModel,
        value: new TodoModel(),
      },
      route: $({value: 'all', storage: 'hash', key: 'route'}),
    };
  }
  init() {
    this.changed();
  }
  changed() {
    const itemCount = this.model.items.length;
    this.template([
      section({class: 'todoapp'}, [
        header({class: 'header'}, [
          h1('todos'),
          todoNewItem({model: this.model}),
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