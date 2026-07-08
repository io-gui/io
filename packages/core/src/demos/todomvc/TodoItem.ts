import { ReactiveElement, Register, input, label, li, div, button, Property, ReactiveElementProps } from '@io-gui/core'
import { TodoItemModel } from './TodoItemModel.js'
import { TodoListModel } from './TodoListModel.js'

type TodoItemProps = ReactiveElementProps & {
  item?: TodoItemModel
  model?: TodoListModel
}

export class TodoItem extends ReactiveElement {

  static override get Style() {
    return /* css */`
      :host {
        display: contents;
      }
    `
  }

  @Property({type: TodoItemModel})
  declare item: TodoItemModel

  @Property({type: TodoListModel})
  declare model: TodoListModel

  @Property({value: false})
  declare editing: boolean

  declare private $input: HTMLInputElement
  declare private _originalTitle: string

  constructor(args: TodoItemProps = {}) {
    super(args)
  }

  itemMutated() {
    this.mutated()
  }

  override mutated() {
    this.render([
      li({class: 'todo ' + (this.item.completed ? 'completed ' : '') + (this.editing ? 'editing' : '')}, [
        div({class: 'view'}, [
          input({type: 'checkbox', class: 'toggle', checked: this.item.completed, '@click': this.item.toggle}),
          label({'@dblclick': this.onStartEdit}, this.item.title),
          button({class: 'destroy', '@click': this.item.delete}),
        ]),
        input({id: 'input', class: 'edit', value: this.item.title, '@blur': this.onBlur, '@keyup': this.onInputKey})
      ])
    ])
    this.$input = this.$['input'] as HTMLInputElement
  }

  onStartEdit() {
    this.editing = true
    this._originalTitle = this.item.title
    this.$input.focus()
  }

  onBlur() {
    const title = String(this.$input.value).trim()
    if (title) {
      this.item.title = title
    } else {
      this.item.title = this._originalTitle
    }
    this.editing = false
  }

  onInputKey(event: KeyboardEvent) {
    if (['Enter', 'Escape'].includes(event.key)) {
      this.$input.blur()
    }
  }
}
Register(TodoItem)

export const todoItem = function(arg0: TodoItemProps) {
  return TodoItem.vConstructor(arg0)
}