import { IoElement, Register } from 'io-gui';

export class TodoInfo extends IoElement {
  init() {
    this.innerHTML = `
      <p>Double-click to edit a todo</p>
      <p>Created with <a href="https://iogui.dev" target="_blank">Io-Gui</a></p>
      <p>Part of <a href="http://todomvc.com/" target="_blank">TodoMVC</a>
    `;
  }
}
Register(TodoInfo);
export const todoInfo = TodoInfo.vConstructor;