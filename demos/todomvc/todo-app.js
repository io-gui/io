import { IoElement, Register, IoStorage as $ } from 'io-gui';

import { TodoModel } from './todo-model.js';
import './todo-new-item.js';
import './todo-list.js';
import './todo-footer.js';
import './todo-info.js';

export class TodoApp extends IoElement {
  static get Properties() {
    return {
      model: {
        type: TodoModel,
        value: new TodoModel(),
        observe: true,
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
      ['section', {class: 'todoapp'}, [
        ['header', {class: 'header'}, [
          ['h1', 'todos'],
          ['todo-new-item', {model: this.model}],
        ]],
        ['todo-list', {class: 'todo-list', model: this.model, route: this.route}],
        itemCount ? ['todo-footer', {class: 'footer', model: this.model, route: this.bind('route')}] : null,
      ]],
      ['todo-info', {class: 'info'}]
    ]);
  }
}

Register(TodoApp);
