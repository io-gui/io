var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Node, NodeArray, Register, ReactiveProperty } from '@io-gui/core';
import { TodoItemModel } from './TodoItemModel.js';
export class TodoListModel extends Node {
    static get Listeners() {
        return {
            'delete-item': 'onDeleteItem',
        };
    }
    onDeleteItem(event) {
        const item = event.path[0];
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
    }
    get filters() {
        return {
            all: () => true,
            active: (item) => !item.completed,
            completed: (item) => item.completed,
        };
    }
    get count() {
        return this.items.length;
    }
    get completedCount() {
        return this.items.filter(item => item.completed).length;
    }
    get activeCount() {
        return this.items.filter(item => !item.completed).length;
    }
    get allCompleted() {
        return this.items.every(item => item.completed);
    }
    constructor(args) {
        args = { ...args };
        args.items = args.items.map((item) => new TodoItemModel({ ...item }));
        super(args);
    }
    completeAll = () => {
        this.items.forEach(item => item.completed = true);
    };
    clearCompleted = () => {
        this.items = this.items.filter(item => !item.completed);
    };
    itemsMutated() {
        this.dispatchMutation();
    }
    toJSON() {
        return {
            items: this.items.map(item => item.toJSON()),
        };
    }
    fromJSON(json) {
        this.setProperties({
            items: json.items.map((item) => new TodoItemModel(item)),
        });
        return this;
    }
}
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], TodoListModel.prototype, "items", void 0);
Register(TodoListModel);
//# sourceMappingURL=TodoListModel.js.map