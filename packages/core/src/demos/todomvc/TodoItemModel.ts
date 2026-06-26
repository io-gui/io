import { ReactiveObject, Register, Property } from '@io-gui/core'


export type TodoItemProps = {
  title: string
  completed: boolean
}

export class TodoItemModel extends ReactiveObject {

  @Property({type: String})
  declare title: string

  @Property({type: Boolean})
  declare completed: boolean

  toggle = () => {
    this.completed = !this.completed
  }

  delete = () => {
    this.dispatch('delete-item', {item: this}, true)
  }

}
Register(TodoItemModel)