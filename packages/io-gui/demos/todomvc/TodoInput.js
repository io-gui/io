import { IoElement, Register, input } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
import { TodoItemModel } from './TodoItemModel.js';

export class TodoInput extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: contents;
    }
    `;
  }
  static get ReactiveProperties() {
    return {
      model: {
        type: TodoListModel,
      },
    };
  }
  onInputKey(event) {
    if (event.key === 'Enter') {
      const title = String(this.$.input.value).trim();
      if (title) {
        this.model.items.push(new TodoItemModel({title: title, completed: false}));
      }
      this.$.input.value = '';
      this.$.input.focus();
    }
    if (event.key === 'Escape') {
      this.$.input.value = '';
      this.$.input.focus();
    }
  }
  changed() {
    this.render([
      input({id: 'input', class: 'new-todo', placeholder: 'What needs to be done?', '@keyup': this.onInputKey, autofocus: true}),
    ]);
  }
}
Register(TodoInput);
export const todoInput = TodoInput.vConstructor;