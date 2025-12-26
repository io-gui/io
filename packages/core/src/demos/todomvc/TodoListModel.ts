import { Node, NodeArray, Register, ReactiveProperty } from '@io-gui/core'
import { TodoItemModel } from './TodoItemModel.js'

export class TodoListModel extends Node {

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare items: TodoItemModel[]

  static get Listeners() {
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

  constructor(args: any) {
    args = { ...args }
    args.items = args.items.map((item: any) => new TodoItemModel({...item}))
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

  toJSON() {
    return {
      items: this.items.map(item => item.toJSON()),
    }
  }

  fromJSON(json: any) {
    this.setProperties({
      items: json.items.map((item: any) => new TodoItemModel(item)),
    })
    return this
  }
}
Register(TodoListModel)