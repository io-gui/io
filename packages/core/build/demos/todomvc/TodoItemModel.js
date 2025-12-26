var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Node, Register, ReactiveProperty } from 'io-core';
export class TodoItemModel extends Node {
    toggle = () => {
        this.completed = !this.completed;
    };
    delete = () => {
        this.dispatch('delete-item', { item: this }, true);
    };
    toJSON() {
        return {
            title: this.title,
            completed: this.completed,
        };
    }
    fromJSON(json) {
        this.setProperties({
            title: json.title ?? '',
            completed: json.completed ?? false,
        });
        return this;
    }
}
__decorate([
    ReactiveProperty({ type: String })
], TodoItemModel.prototype, "title", void 0);
__decorate([
    ReactiveProperty({ type: Boolean })
], TodoItemModel.prototype, "completed", void 0);
Register(TodoItemModel);
//# sourceMappingURL=TodoItemModel.js.map