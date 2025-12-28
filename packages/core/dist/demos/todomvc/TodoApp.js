var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, Storage as $, section, header, h1, div, p, a, span, ReactiveProperty } from '@io-gui/core';
import { TodoListModel } from './TodoListModel.js';
import { todoInput } from './TodoInput.js';
import { todoList } from './TodoList.js';
import { todoFooter } from './TodoFooter.js';
$.permit();
const $route = $({ key: 'route', storage: 'hash', value: 'all' });
const $model = $({ key: 'model', storage: 'local', value: new TodoListModel({ items: [] }) });
export class TodoApp extends IoElement {
    ready() {
        this.changed();
    }
    modelMutated() {
        this.changed();
    }
    changed() {
        this.render([
            section({ class: 'todoapp' }, [
                header({ class: 'header' }, [
                    h1('todos'),
                    todoInput({ model: this.model }),
                ]),
                todoList({ class: 'todo-list', model: this.model, route: this.route }),
                this.model.count ? todoFooter({ class: 'footer', model: this.model, route: this.bind('route') }) : null,
            ]),
            div({ class: 'info' }, [
                p('Double-click to edit a todo'),
                p([
                    // TODO: implement text and DOM mixed content rendering
                    span('Created with '),
                    a({ href: 'https://iogui.dev', target: '_blank' }, 'Io-Gui'),
                ]),
                p([
                    // TODO: implement text and DOM mixed content rendering
                    span('Part of '),
                    a({ href: 'http://todomvc.com/', target: '_blank' }, 'TodoMVC')
                ])
            ])
        ]);
    }
}
__decorate([
    ReactiveProperty($model)
], TodoApp.prototype, "model", void 0);
__decorate([
    ReactiveProperty($route)
], TodoApp.prototype, "route", void 0);
Register(TodoApp);
export const todoApp = TodoApp.vConstructor;
//# sourceMappingURL=TodoApp.js.map