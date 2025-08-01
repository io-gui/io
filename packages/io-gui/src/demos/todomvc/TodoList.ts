//@ts-nocheck
import { IoElement, Register, section, input, label, ul } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
import { todoItem } from './TodoItem.js';

export class TodoList extends IoElement {
  static get Style() {
    return /* CSS */`
      :host {
        flex-direction: column;
      }
    `;
  }
  static get ReactiveProperties() {
    return {
      model: {
        type: TodoListModel,
      },
      route: 'all',
    };
  }
  modelMutated() {
    this.changed();
  }
  changed() {
    const itemsInRoute = this.model.items.filter(this.model.filters[this.route]);
    this.render([
      section({class: 'main'}, [
        input({type: 'checkbox', id: 'toggle-all', class: 'toggle-all', checked: this.model.allCompleted}),
        (this.model.items.length && !this.model.allCompleted) ? label({for: 'toggle-all', '@click': this.model.completeAll}, 'Mark all as complete') : null,
        ul({class: 'todo-list'},
          itemsInRoute.map((item) => todoItem({item: item, model: this.model}))
        )
      ]),
    ]);
  }
}
Register(TodoList);
export const todoList = TodoList.vConstructor;