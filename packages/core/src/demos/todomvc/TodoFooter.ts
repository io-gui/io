import { IoElement, Register, IoElementProps, span, ul, li, a, button, ReactiveProperty, WithBinding } from 'io-core'
import { TodoListModel } from './TodoListModel.js'

type TodoFooterProps = IoElementProps & {
  model?: TodoListModel
  route?: WithBinding<string>
}

export class TodoFooter extends IoElement {
  static get Style() {
    return /* css */`
      :host a {
        cursor: pointer;
      }
    `
  }

  @ReactiveProperty({type: TodoListModel})
  declare model: TodoListModel

  @ReactiveProperty({value: 'all'})
  declare route: string

  constructor(args: TodoFooterProps = {}) { super(args) }

  onRouteClicked(event: CustomEvent) {
    const target = event.target as HTMLElement
    this.route = target.innerText.toLowerCase()
  }

  modelMutated() {
    this.changed()
  }

  changed() {
    this.render([
      span({class: 'todo-count'}, String(this.model.activeCount) + (this.model.activeCount === 1 ? ' item' : ' items') + ' left'),
      ul({class: 'filters'}, [
        li([a({'@click': this.onRouteClicked, class: this.route === 'all' ? 'selected' : ''}, 'All')]),
        li([a({'@click': this.onRouteClicked, class: this.route === 'active' ? 'selected' : ''}, 'Active')]),
        li([a({'@click': this.onRouteClicked, class: this.route === 'completed' ? 'selected' : ''}, 'Completed')]),
      ]),
      this.model.completedCount ? button({class: 'clear-completed', '@click': this.model.clearCompleted}, 'Clear completed') : null
    ])
  }
}
Register(TodoFooter)

export const todoFooter = function(arg0: TodoFooterProps) {
  return TodoFooter.vConstructor(arg0)
}