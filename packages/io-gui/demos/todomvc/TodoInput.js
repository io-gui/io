import { IoElement, Register, input } from 'io-gui';
import { TodoModel } from './TodoModel.js';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoInput extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: contents;
    }
    `;
  }
  static get Properties() {
    return {
      model: {
        type: TodoModel,
      },
    };
  }
  onInputKey(event) {
    if (event.which === ENTER_KEY) {
      this.model.newItem(this.$.input.value);
      this.$.input.value = '';
      this.$.input.focus();
    }
    if (event.which === ESCAPE_KEY) {
      this.$.input.value = '';
      this.$.input.focus();
    }
  }
  changed() {
    this.template([
      input({$: 'input', class: 'new-todo', placeholder: 'What needs to be done?', '@keyup': this.onInputKey, autofocus: true}),
    ]);
  }
}
Register(TodoInput);
export const todoInput = TodoInput.vConstructor;