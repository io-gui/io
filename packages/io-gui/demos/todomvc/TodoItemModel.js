import { Node, Register } from 'io-gui';

export class TodoItemModel extends Node {
  static get ReactiveProperties() {
    return {
      title: String,
      completed: Boolean,
    };
  }
  toggle = () => {
    this.completed = !this.completed;
  }
  delete = () => {
    this.dispatch('delete-item', {item: this}, true);
  }
  toJSON() {
    return {
      title: this.title,
      completed: this.completed,
    };
  }
  fromJSON(json) {
    this.setProperties({
      title: json.title ?? '',
      completed: json.completed ?? false,
    });
    return this;
  }
}
Register(TodoItemModel);