import {IoElement} from "../../build/io.js";

export class TodoList extends IoElement {
  static get properties() {
    return {
      model: Object
    };
  }
  changed() {
    this.template([
      ['ul', {className: 'todo-list'}, [
        this.model.items.map((item, i) => ['li', {className: item.completed ? 'completed' : ''}, [['todo-item', {
          item: item,
          model: this.model
        }]]])
      ]]
    ]);
  }
}

TodoList.Register();
