import { Node, NodeArray, Register } from 'io-gui';
import { TodoItemModel } from './TodoItemModel.js';

export class TodoListModel extends Node {
  static get ReactiveProperties() {
    return {
      items: {
        type: NodeArray,
        init: 'this',
      }
    };
  }
  static get Listeners() {
    return {
      'delete-item': 'onDeleteItem',
    };
  }
  onDeleteItem(event) {
    const item = event.path[0];
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
  }
  get filters() {
    return {
      all: () => true,
      active: item => !item.completed,
      completed: item => item.completed,
    };
  }
  get count() {
    return this.items.length;
  }
  get completedCount() {
    return this.items.filter(item => item.completed).length;
  }
  get activeCount() {
    return this.items.filter(item => !item.completed).length;
  }
  get allCompleted() {
    return this.items.every(item => item.completed);
  }
  constructor(args) {
    args = { ...args };
    args.items = args.items.map(item => new TodoItemModel({...item}));
    super(args);
  }
  completeAll = () => {
    this.items.forEach(item => item.completed = true);
  }
  clearCompleted = () => {
    this.items = this.items.filter(item => !item.completed);
  }
  itemsMutated() {
    this.dispatchMutation();
  }
  toJSON() {
    return {
      items: this.items.map(item => item.toJSON()),
    };
  }
  fromJSON(json) {
    this.setProperties({
      items: json.items.map(item => new TodoItemModel(item)),
    });
    return this;
  }
}
Register(TodoListModel);