//@ts-nocheck
import { IoElement, Register, Storage as $, section, header, h1, div, p, a, span } from 'io-gui';

import { TodoListModel } from './TodoListModel.js';
import { todoInput } from './TodoInput.js';
import { todoList } from './TodoList.js';
import { todoFooter } from './TodoFooter.js';

$.permit();
const $route = $({key: 'route', storage: 'hash', value: 'all'});
const $model = $({key: 'model', storage: 'local', value: new TodoListModel({items: []})});

export class TodoApp extends IoElement {
  static get ReactiveProperties() {
    return {
      model: $model,
      route: $route,
    };
  }
  ready() {
    this.changed();
  }
  modelMutated() {
    this.changed();
  }
  changed() {
    this.render([
      section({class: 'todoapp'}, [
        header({class: 'header'}, [
          h1('todos'),
          todoInput({model: this.model}),
        ]),
        todoList({class: 'todo-list', model: this.model, route: this.route}),
        this.model.count ? todoFooter({class: 'footer', model: this.model, route: this.bind('route')}) : null,
      ]),
      div({class: 'info'}, [
        p('Double-click to edit a todo'),
        p([
          // TODO: implement text and DOM mixed content rendering
          span('Created with '),
          a({href: 'https://iogui.dev', target: '_blank'}, 'Io-Gui'),
        ]),
        p([
          // TODO: implement text and DOM mixed content rendering
          span('Part of '),
          a({href: 'http://todomvc.com/', target: '_blank'}, 'TodoMVC')
        ])
      ])
    ]);
  }
}
Register(TodoApp);
export const todoApp = TodoApp.vConstructor;