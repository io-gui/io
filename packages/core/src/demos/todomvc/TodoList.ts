//@ts-nocheck
import { IoElement, Register, section, input, label, ul, ReactiveProperty, IoElementProps } from '@io-gui/core'
import { TodoListModel } from './TodoListModel.js'
import { todoItem } from './TodoItem.js'

type TodoListProps = IoElementProps & {
  model?: TodoListModel
  route?: string
}

export class TodoList extends IoElement {
  static get Style() {
    return /* CSS */`
      :host {
        flex-direction: column;
      }
    `
  }

  @ReactiveProperty({type: TodoListModel})
  declare model: TodoListModel

  @ReactiveProperty({value: 'all'})
  declare route: string

  constructor(args: TodoListProps = {}) { super(args) }

  modelMutated() {
    this.changed()
  }

  changed() {
    const itemsInRoute = this.model.items.filter(this.model.filters[this.route as keyof typeof this.model.filters])
    this.render([
      section({class: 'main'}, [
        input({type: 'checkbox', id: 'toggle-all', class: 'toggle-all', checked: this.model.allCompleted}),
        (this.model.items.length && !this.model.allCompleted) ? label({for: 'toggle-all', '@click': this.model.completeAll}, 'Mark all as complete') : null,
        ul({class: 'todo-list'},
          itemsInRoute.map((item) => todoItem({item: item, model: this.model}))
        )
      ]),
    ])
  }
}
Register(TodoList)

export const todoList = function(arg0: TodoListProps) {
  return TodoList.vConstructor(arg0)
}