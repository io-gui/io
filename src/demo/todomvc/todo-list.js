import {IoElement} from "../../io.js";
import {TodoModel} from "./todo-model.js";
import "./todo-item.js";

export class TodoList extends IoElement {
  static get Properties() {
    return {
      model: TodoModel,
      route: 'all',
    };
  }
  changed() {
    const itemCount = this.model.items.length;
    const completedCount = this.model.getCompletedCount();
    const allCompleted = itemCount === completedCount;
    const itemsInRoute = this.model.items.filter(this.model.filters[this.route]);

    this.template([
      ['section', {class: 'main'}, [
        ['input', {type: 'checkbox', id: 'toggle-all', class: 'toggle-all', checked: allCompleted, 'on-click': this.model._toggleItemsCompleted}],
        this.model.items.length ? ['label', {for: 'toggle-all'}, 'Mark all as complete'] : null,
        ['ul', {class: 'todo-list'}, [
          itemsInRoute.map((item) => ['todo-item', {item: item, model: this.model}])
        ]]
      ]],
    ]);
  }
}

TodoList.Register();
