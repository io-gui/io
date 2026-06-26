import { ReactiveElement, Register, Storage as $, section, header, h1, div, p, a, Property } from '@io-gui/core'

import { TodoListModel } from './TodoListModel.js'
import { todoInput } from './TodoInput.js'
import { todoList } from './TodoList.js'
import { todoFooter } from './TodoFooter.js'

$.permit()
const $route = $({key: 'route', storage: 'hash', value: 'all'})
const $model = $({key: 'model', storage: 'local', value: new TodoListModel({items: []})})

export class TodoApp extends ReactiveElement {

  @Property($model)
  declare model: TodoListModel

  @Property($route)
  declare route: string

  override ready() {
    this.render([
      section({class: 'todoapp'}, [
        header({class: 'header'}, [
          h1('todos'),
          todoInput({model: this.model}),
        ]),
        todoList({class: 'todo-list', model: this.model, route: this.bind('route')}),
        todoFooter({class: 'footer', model: this.model, route: this.bind('route')}),
      ]),
      div({class: 'info'}, [
        p('Double-click to edit a todo'),
        p(['Created with ', a({href: 'https://iogui.dev', target: '_blank'}, 'Io-Gui')]),
        p(['Part of ', a({href: 'http://todomvc.com/', target: '_blank'}, 'TodoMVC')])
      ])
    ])
  }
}
Register(TodoApp)
export const todoApp = TodoApp.vConstructor