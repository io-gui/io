import { Node, Register, ReactiveProperty } from '@io-gui/core'

export class TodoItemModel extends Node {
  @ReactiveProperty({type: String})
  declare title: string

  @ReactiveProperty({type: Boolean})
  declare completed: boolean

  toggle = () => {
    this.completed = !this.completed
  }

  delete = () => {
    this.dispatch('delete-item', {item: this}, true)
  }

  toJSON() {
    return {
      title: this.title,
      completed: this.completed,
    }
  }

  fromJSON(json: any) {
    this.setProperties({
      title: json.title ?? '',
      completed: json.completed ?? false,
    })
    return this
  }
}
Register(TodoItemModel)