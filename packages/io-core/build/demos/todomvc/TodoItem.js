var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, input, label, li, div, button, ReactiveProperty } from 'io-core';
import { TodoItemModel } from './TodoItemModel.js';
import { TodoListModel } from './TodoListModel.js';
export class TodoItem extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: contents;
    }
    `;
    }
    $input;
    _originalTitle;
    constructor(args = {}) { super(args); }
    itemMutated() {
        this.changed();
    }
    changed() {
        this.render([
            li({ class: 'todo ' + (this.item.completed ? 'completed ' : '') + (this.editing ? 'editing' : '') }, [
                div({ class: 'view' }, [
                    input({ type: 'checkbox', class: 'toggle', checked: this.item.completed, '@click': this.item.toggle }),
                    label({ '@dblclick': this.onStartEdit }, this.item.title),
                    button({ class: 'destroy', '@click': this.item.delete }),
                ]),
                input({ id: 'input-' + this.item.title, class: 'edit', value: this.item.title, '@blur': this.onBlur, '@keyup': this.onInputKey })
            ])
        ]);
        this.$input = this.querySelector('input.edit');
    }
    onStartEdit() {
        this.editing = true;
        this._originalTitle = this.item.title;
        this.$input.focus();
    }
    onBlur() {
        const title = String(this.$input.value).trim();
        if (title) {
            this.item.title = title;
        }
        else {
            this.item.title = this._originalTitle;
        }
        this.editing = false;
    }
    onInputKey(event) {
        const keyboardEvent = event.detail;
        if (['Enter', 'Escape'].includes(keyboardEvent.key)) {
            this.$input.blur();
        }
    }
}
__decorate([
    ReactiveProperty({ type: TodoItemModel })
], TodoItem.prototype, "item", void 0);
__decorate([
    ReactiveProperty({ type: TodoListModel })
], TodoItem.prototype, "model", void 0);
__decorate([
    ReactiveProperty({ value: false })
], TodoItem.prototype, "editing", void 0);
Register(TodoItem);
export const todoItem = function (arg0) {
    return TodoItem.vConstructor(arg0);
};
//# sourceMappingURL=TodoItem.js.map