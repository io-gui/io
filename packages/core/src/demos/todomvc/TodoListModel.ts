import { ReactiveNode, NodeArray, Register, ReactiveProperty } from '@io-gui/core'
import { TodoItemModel, TodoItemProps } from './TodoItemModel.js'

export type TodoListProps = {
  items: TodoItemProps[]
}

export class TodoListModel extends ReactiveNode {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare items: TodoItemModel[]

  static override get Listeners() {
    return {
      'delete-item': 'onDeleteItem',
    }
  }

  onDeleteItem(event: any) {
    const item = event.path[0]
    const index = this.items.indexOf(item)
    this.items.splice(index, 1)
  }

  get filters() {
    return {
      all: () => true,
      active: (item: TodoItemModel) => !item.completed,
      completed: (item: TodoItemModel) => item.completed,
    }
  }

  get count() {
    return this.items.length
  }

  get completedCount() {
    return this.items.filter(item => item.completed).length
  }

  get activeCount() {
    return this.items.filter(item => !item.completed).length
  }

  get allCompleted() {
    return this.items.every(item => item.completed)
  }

  constructor(args: TodoListProps = {items: []}) {
    args.items = args.items.map(item => new TodoItemModel(item))
    super(args)
  }

  completeAll = () => {
    this.items.forEach(item => item.completed = true)
  }

  clearCompleted = () => {
    this.items = this.items.filter(item => !item.completed)
  }

  itemsMutated() {
    this.dispatchMutation()
  }

  override applyJSON(json: TodoListProps) {
    this.setProperty('items', json.items.map((item) => new TodoItemModel(item)))
    return this
  }

}
Register(TodoListModel)