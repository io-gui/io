var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//@ts-nocheck
import { IoElement, Register, section, input, label, ul, ReactiveProperty } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
import { todoItem } from './TodoItem.js';
export class TodoList extends IoElement {
    static get Style() {
        return /* CSS */ `
      :host {
        flex-direction: column;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    modelMutated() {
        this.changed();
    }
    changed() {
        const itemsInRoute = this.model.items.filter(this.model.filters[this.route]);
        this.render([
            section({ class: 'main' }, [
                input({ type: 'checkbox', id: 'toggle-all', class: 'toggle-all', checked: this.model.allCompleted }),
                (this.model.items.length && !this.model.allCompleted) ? label({ for: 'toggle-all', '@click': this.model.completeAll }, 'Mark all as complete') : null,
                ul({ class: 'todo-list' }, itemsInRoute.map((item) => todoItem({ item: item, model: this.model })))
            ]),
        ]);
    }
}
__decorate([
    ReactiveProperty({ type: TodoListModel })
], TodoList.prototype, "model", void 0);
__decorate([
    ReactiveProperty({ value: 'all' })
], TodoList.prototype, "route", void 0);
Register(TodoList);
export const todoList = function (arg0) {
    return TodoList.vConstructor(arg0);
};
//# sourceMappingURL=TodoList.js.map