import {IoNode} from "../../build/io.js";

export class TodoModel extends IoNode {
  static get properties() {
    return {
      items: Array,
      filter: String
    };
  }
  constructor() {
    super();
    this.items = [
      {title: 'one', completed: false},
      {title: 'two', completed: false},
      {title: 'three', completed: true},
      {title: 'four', completed: false},
    ];
    this.filters = {
      active: function(item) {
        return !item.completed;
      },
      completed: function(item) {
        return item.completed;
      }
    };
  }
  initialize() {
    this.items = [];
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
  }
  newItem(title) {
    title = String(title).trim();
    if (title) {
      this.items.push({title: title, completed: false});
      this.dispatchEvent('io-object-mutated', {object: this}, false, window);
    }
  }
  getCompletedCount() {
    return this.items ? this.items.filter(this.filters.completed).length : 0;
  }
  getActiveCount() {
    return this.items ? (this.items.length - this.getCompletedCount(this.items)) : 0;
  }
  matchesFilter(item, filter) {
    var fn = this.filters[filter];
    return fn ? fn(item) : true;
  }
  destroyItem(item) {
    var i = this.items.indexOf(item);
    if (i > -1) {
      this.items.splice(i, 1)
    }
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
  }
  toggleItem(item) {
    item.completed = !item.completed;
    this.dispatchEvent('io-object-mutated', {object: item}, false, window);
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
  }
  clearCompletedItems() {
    this.items = this.items.filter(this.filters.active);
    this.dispatchEvent('io-object-mutated', {object: this}, false, window);
  }
  areAllCompleted() {
    return this.items.length === this.getCompletedCount(this.items);
  }
  toggleItemsCompleted() {
    let completed = !this.areAllCompleted();
    for (var i = 0; i < this.items.length; ++i) {
      this.items[i].completed = completed;
      this.dispatchEvent('io-object-mutated', {object: this.items[i]}, false, window);
    }
  }
}

TodoModel.Register();
