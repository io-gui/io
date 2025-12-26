var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, input, ReactiveProperty } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
import { TodoItemModel } from './TodoItemModel.js';
export class TodoInput extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: contents;
    }
    `;
    }
    constructor(args = {}) { super(args); }
    onInputKey(event) {
        if (event.key === 'Enter') {
            const inputElement = this.$.input;
            const title = String(inputElement.value).trim();
            if (title) {
                this.model.items.push(new TodoItemModel({ title: title, completed: false }));
            }
            inputElement.value = '';
            inputElement.focus();
        }
        if (event.key === 'Escape') {
            const inputElement = this.$.input;
            inputElement.value = '';
            inputElement.focus();
        }
    }
    changed() {
        this.render([
            input({ id: 'input', class: 'new-todo', placeholder: 'What needs to be done?', '@keyup': this.onInputKey, autofocus: true }),
        ]);
    }
}
__decorate([
    ReactiveProperty({ type: TodoListModel })
], TodoInput.prototype, "model", void 0);
Register(TodoInput);
export const todoInput = function (arg0) {
    return TodoInput.vConstructor(arg0);
};
//# sourceMappingURL=TodoInput.js.map