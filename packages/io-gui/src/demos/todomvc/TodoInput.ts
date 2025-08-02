import { IoElement, Register, input, ReactiveProperty, IoElementProps } from 'io-gui';
import { TodoListModel } from './TodoListModel.js';
import { TodoItemModel } from './TodoItemModel.js';

type TodoInputProps = IoElementProps & {
  model?: TodoListModel;
};

export class TodoInput extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: contents;
    }
    `;
  }

  @ReactiveProperty({type: TodoListModel})
  declare model: TodoListModel;

  constructor(args: TodoInputProps = {}) { super(args); }

  onInputKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const inputElement = this.$.input as HTMLInputElement;
      const title = String(inputElement.value).trim();
      if (title) {
        this.model.items.push(new TodoItemModel({title: title, completed: false}));
      }
      inputElement.value = '';
      inputElement.focus();
    }
    if (event.key === 'Escape') {
      const inputElement = this.$.input as HTMLInputElement;
      inputElement.value = '';
      inputElement.focus();
    }
  }

  changed() {
    this.render([
      input({id: 'input', class: 'new-todo', placeholder: 'What needs to be done?', '@keyup': this.onInputKey, autofocus: true}),
    ]);
  }
}
Register(TodoInput);

export const todoInput = function(arg0: TodoInputProps) {
  return TodoInput.vConstructor(arg0);
};