import {IoElement, html} from "../../dist/io.js";
import {TodoModel} from "./todo-model.js";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoNewItem extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      display: contents;
    }
    </style>`;
  }
  static get Properties() {
    return {
      model: TodoModel,
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
      ['input', {id: 'input', class: 'new-todo', placeholder: 'What needs to be done?', 'on-keyup': this.onInputKey, autofocus: true}],
    ]);
  }
}

TodoNewItem.Register();