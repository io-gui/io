import { ReactiveNode } from '../nodes/ReactiveNode.js'
import { IoElement } from '../elements/IoElement.js'

export interface Change<T = unknown> {
  property: string
  value: T
  oldValue: T
}

export interface Changes {
  [property: string]: Change
}

export interface ChangeEvent extends Omit<CustomEvent<Change>, 'target'> {
  readonly target: ReactiveNode | IoElement
  readonly detail: Change
  readonly path: ReactiveNode[]
}

type ChangeHandler = (change: Change) => void

/**
 * This class is used internally by the framework to manage property changes in `ReactiveNode` and `IoElement` nodes.
 *
 * This class implements a First-In-First-Out (FIFO) queue that:
 * - Collects property changes and their associated values
 * - Coalesces multiple changes to the same property
 * - Dispatches change events (e.g., '[propName]-changed')
 * - Invokes corresponding change handlers (e.g., [propName]Changed())
 * - Triggers a final 'changed()' handler after processing all changes
 * - Triggers a final 'dispatchMutation()' handler after processing all changes
 *
 * The queue helps optimize performance by batching multiple property changes
 * and preventing redundant updates when the same property changes multiple
 * times within a single execution cycle.
 *
 * @example
 * const node = new ReactiveNode();
 * const changeQueue = new ChangeQueue(node);
 * changeQueue.queue('prop1', 1, 0);
 * changeQueue.queue('prop1', 2, 1);
 * changeQueue.dispatch();
 */
export class ChangeQueue {
  declare readonly node: ReactiveNode | IoElement
  #changes = new Map<string, Change>()
  dispatchedChange = false
  dispatching = false
  /**
   * Creates change queue for the specified owner instance of `ReactiveNode`.
   * @param {ReactiveNode} node - Owner node.
   */
  constructor(node: ReactiveNode | IoElement) {
    this.node = node
    Object.defineProperty(this, 'dispatch', {
      value: this.dispatch.bind(this),
      enumerable: false,
      writable: false,
      configurable: false,
    })
  }
  get changes(): Change[] {
    return [...this.#changes.values()]
  }
  /**
   * Adds property change payload to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated in-queue.
   * If the new value is the same as the original value, the change is removed from the queue.
   * @param {string} property - Property name.
   * @param {unknown} value Property value.
   * @param {unknown} oldValue Old property value.
   */
  queue(property: string, value: unknown, oldValue: unknown) {
    debug: if (value === oldValue) {
      console.warn('ChangeQueue: queuing change with same value and oldValue!')
    }
    const existing = this.#changes.get(property)
    if (!existing) {
      this.#changes.set(property, {property, value, oldValue})
    } else if (value === existing.oldValue) {
      this.#changes.delete(property)
    } else {
      existing.value = value
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue:
   *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
   *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
   * After all changes are dispatched it invokes `.changed()` function of the owner node instance and fires `'changed'` event.
   */
  dispatch() {
    if (this.dispatching === true) {
      debug: console.error('ChangeQueue: dispatching already in progress!')
      return
    }
    this.dispatching = true
    const properties = this.#dispatchQueuedChanges()
    this.#changes.clear()
    if (this.dispatchedChange) {
      this.#invokeChanged()
      this.#invokeMutation(properties)
    }
    this.dispatchedChange = false
    this.dispatching = false
  }
  #dispatchQueuedChanges(): string[] {
    const properties: string[] = []
    let i = 0
    let order = [...this.#changes.keys()]
    while (i < order.length) {
      const change = this.#changes.get(order[i])
      if (change) {
        this.#processChange(change, properties)
      }
      i++
      if (this.#changes.size > order.length) {
        order = [...this.#changes.keys()]
      }
    }
    return properties
  }
  #processChange(change: Change, properties: string[]) {
    const property = change.property
    if (change.value === change.oldValue) return
    this.dispatchedChange = true
    const handlerName = property + 'Changed'
    const handler = (this.node as unknown as Record<string, ChangeHandler | undefined>)[handlerName]
    if (handler) {
      try {
        handler(change)
      } catch (error) {
        console.error(`Error in ${this.node.constructor.name}.${handlerName}():`, error)
      }
    }
    this.node.dispatch(property + '-changed' as any, change)
    properties.push(property)
  }
  #invokeChanged() {
    try {
      this.node.changed()
    } catch (error) {
      console.error(`Error in ${this.node.constructor.name}.changed():`, error)
    }
  }
  #invokeMutation(properties: string[]) {
    if ((this.node as ReactiveNode)._isNode) {
      (this.node as ReactiveNode).dispatchMutation(this.node, properties)
    }
  }
  /**
   * Clears the queue and removes the node reference for garbage collection.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.#changes.clear()
    Object.defineProperty(this, 'changes', {value: undefined, configurable: true})
    delete (this as {node?: ReactiveNode | IoElement}).node
  }
}
