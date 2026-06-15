var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, span, ul, li, a, button, ReactiveProperty } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
export class TodoFooter extends IoElement {
    static get Style() {
        return /* css */ `
      :host a {
        cursor: pointer;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    onRouteClicked(event) {
        const target = event.target;
        this.route = target.innerText.toLowerCase();
    }
    modelMutated() {
        this.changed();
    }
    changed() {
        this.render([
            span({ class: 'todo-count' }, String(this.model.activeCount) + (this.model.activeCount === 1 ? ' item' : ' items') + ' left'),
            ul({ class: 'filters' }, [
                li([a({ '@click': this.onRouteClicked, class: this.route === 'all' ? 'selected' : '' }, 'All')]),
                li([a({ '@click': this.onRouteClicked, class: this.route === 'active' ? 'selected' : '' }, 'Active')]),
                li([a({ '@click': this.onRouteClicked, class: this.route === 'completed' ? 'selected' : '' }, 'Completed')]),
            ]),
            this.model.completedCount ? button({ class: 'clear-completed', '@click': this.model.clearCompleted }, 'Clear completed') : null
        ]);
    }
}
__decorate([
    ReactiveProperty({ type: TodoListModel })
], TodoFooter.prototype, "model", void 0);
__decorate([
    ReactiveProperty({ value: 'all' })
], TodoFooter.prototype, "route", void 0);
Register(TodoFooter);
export const todoFooter = function (arg0) {
    return TodoFooter.vConstructor(arg0);
};
//# sourceMappingURL=TodoFooter.js.map