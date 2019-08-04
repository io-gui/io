import {IoElement} from "../../dist/io.js";
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
        ['input', {type: 'checkbox', class: 'toggle-all', checked: allCompleted, 'on-click': this.model._toggleItemsCompleted}],
        ['ul', {class: 'todo-list'}, [
          itemsInRoute.map((item, i) => ['todo-item', {item: item, model: this.model}])
        ]]
      ]],
    ]);
  }
}

TodoList.Register();
