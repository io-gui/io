import { ReactiveNode, Register, ReactiveProperty } from '@io-gui/core'


export type TodoItemProps = {
  title: string
  completed: boolean
}

export class TodoItemModel extends ReactiveNode {

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

}
Register(TodoItemModel)