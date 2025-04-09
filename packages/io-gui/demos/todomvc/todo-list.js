import { IoElement, Register, section, input, label, ul } from 'io-gui';
import { TodoModel } from './todo-model.js';
import { todoItem } from './todo-item.js';

export class TodoList extends IoElement {
  static get Style() {
    return /* CSS */`
      :host {
        flex-direction: column;
      }
    `;
  }
  static get Properties() {
    return {
      model: {
        type: TodoModel,
      },
      route: 'all',
    };
  }
  modelMutated() {
    this.changed();
  }
  changed() {
    const itemCount = this.model.items.length;
    const completedCount = this.model.getCompletedCount();
    const allCompleted = itemCount === completedCount;
    const itemsInRoute = this.model.items.filter(this.model.filters[this.route]);

    this.template([
      section({class: 'main'}, [
        input({type: 'checkbox', $: 'toggle-all', class: 'toggle-all', checked: allCompleted}),
        this.model.items.length ? label({for: 'toggle-all', '@click': this.model.toggleAll}, 'Mark all as complete') : null,
        ul({class: 'todo-list'},
          itemsInRoute.map((item) => todoItem({item: item, model: this.model}))
        )
      ]),
    ]);
  }
}
Register(TodoList);
export const todoList = TodoList.vConstructor;