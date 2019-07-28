import {IoElement, html} from "../../dist/io.js";
import {TodoModel} from "./todo-model.js";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoNewItem extends IoElement {
  static get Style() {
    return html`<style>
    :host .new-todo {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 24px;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      border: 0;
      outline: none;
      color: inherit;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      padding: 16px 16px 16px 60px;
      border: none;
      background: rgba(0, 0, 0, 0.003);
      box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
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
