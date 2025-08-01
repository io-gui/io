//@ts-nocheck
import { IoElement, Register, input, label, li, div, button } from 'io-gui';
import { TodoItemModel } from './TodoItemModel.js';
import { TodoListModel } from './TodoListModel.js';

export class TodoItem extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: contents;
    }
    `;
  }
  static get ReactiveProperties() {
    return {
      item: TodoItemModel,
      model: {
        type: TodoListModel,
      },
      editing: false
    };
  }
  itemMutated() {
    this.changed();
  }
  changed() {
    this.render([
      li({class: 'todo ' + (this.item.completed ? 'completed ' : '') + (this.editing ? 'editing' : '')}, [
        div({class: 'view'}, [
          input({type: 'checkbox', class: 'toggle', checked: this.item.completed, '@click': this.item.toggle}),
          label({'@dblclick': this.onStartEdit}, this.item.title),
          button({class: 'destroy', '@click': this.item.delete}),
        ]),
        input({id: 'input-' + this.item.title, class: 'edit', value: this.item.title, '@blur': this.onBlur, '@keyup': this.onInputKey})
      ])
    ]);
    this.$input = this.querySelector('input.edit');
  }
  onStartEdit() {
    this.editing = true;
    this._originalTitle = this.item.title;
    this.$input.focus();
  }
  onBlur() {
    const title = String(this.$input.value).trim();
    if (title) {
      this.item.title = title;
    } else {
      this.item.title = this._originalTitle;
    }
    this.editing = false;
  }
  onInputKey(event) {
    if (['Enter', 'Escape'].includes(event.key)) {
      this.$input.blur();
    }
  }
}
Register(TodoItem);
export const todoItem = TodoItem.vConstructor;