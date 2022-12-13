import { IoElement, RegisterIoElement } from '../../build/iogui.js';

export class TodoInfo extends IoElement {
  static get Style() {
    return /* CSS */`
      :host {
        display: block;
      }
    `;
  }
  init() {
    this.innerHTML = `
<p>Double-click to edit a todo</p>
<p>Created with <a href="https://iogui.dev" target="_blank">Io-Gui</a></p>
<p>Part of <a href="http://todomvc.com/" target="_blank">TodoMVC</a>
    `;
  }
}

RegisterIoElement(TodoInfo);
