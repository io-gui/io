import { IoElement, Register, input, label, li, div, button, ReactiveProperty, IoElementProps } from 'io-core'
import { TodoItemModel } from './TodoItemModel.js'
import { TodoListModel } from './TodoListModel.js'

type TodoItemProps = IoElementProps & {
  item?: TodoItemModel
  model?: TodoListModel
}

export class TodoItem extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: contents;
    }
    `
  }

  @ReactiveProperty({type: TodoItemModel})
  declare item: TodoItemModel

  @ReactiveProperty({type: TodoListModel})
  declare model: TodoListModel

  @ReactiveProperty({value: false})
  declare editing: boolean

  private $input!: HTMLInputElement
  private _originalTitle!: string

  constructor(args: TodoItemProps = {}) { super(args) }

  itemMutated() {
    this.changed()
  }

  changed() {
    this.render([
      li({class: 'todo ' + (this.item.completed ? 'completed ' : '') + (this.editing ? 'editing' : '')}, [
        div({class: 'view'}, [
          input({type: 'checkbox', class: 'toggle', checked: this.item.completed, '@click': this.item.toggle}),
          label({'@dblclick': this.onStartEdit}, this.item.title),
          button({class: 'destroy', '@click': this.item.delete}),
        ]),
        input({id: 'input-' + this.item.title, class: 'edit', value: this.item.title, '@blur': this.onBlur, '@keyup': this.onInputKey})
      ])
    ])
    this.$input = this.querySelector('input.edit') as HTMLInputElement
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

  onInputKey(event: CustomEvent) {
    const keyboardEvent = event.detail as KeyboardEvent
    if (['Enter', 'Escape'].includes(keyboardEvent.key)) {
      this.$input.blur()
    }
  }
}
Register(TodoItem)

export const todoItem = function(arg0: TodoItemProps) {
  return TodoItem.vConstructor(arg0)
}