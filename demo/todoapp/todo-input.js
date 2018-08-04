import {IoElement} from "../../build/io.js";

export class TodoInput extends IoElement {
  static get properties() {
    return {
      model: Object
    };
  }
  changed() {
    this.template([
      ['input', {className: 'new-todo', placeholder: 'What needs to be done?', autofocus: true}]
    ]);
  }
}

TodoInput.Register();
