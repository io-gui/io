import { isReactiveNode } from './ReactiveCore.js'
import type { ReactiveNode } from './ReactiveCore.js'
import { enterBindingEpoch, leaveBindingEpoch } from './Binding.js'

export interface Change<T = unknown> {
  property: string
  value: T
  oldValue: T
}

export interface Changes {
  [property: string]: Change
}

export interface ChangeEvent extends Omit<CustomEvent<Change>, 'target'> {
  readonly target: ReactiveNode
  readonly detail: Change
  readonly path: ReactiveNode[]
}

type ChangeHandler = (change: Change) => void

/**
 * FIFO property-change queue for {@link ReactiveNode}.
 * Coalesces repeated writes to the same property, then dispatches handlers and events.
 * Holds a {@link Binding} wave open for the whole pass so parallel binding networks
 * settle before any target `mutated()` / `io-mutation`.
 */
export class ChangeQueue {
  declare readonly node: ReactiveNode
  #changes = new Map<string, Change>()
  dispatchedChange = false
  dispatching = false
  /**
   * Creates change queue for the specified owner instance of `ReactiveNode`.
   * @param {ReactiveNode} node - Owner node.
   */
  constructor(node: ReactiveNode) {
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
   * Queues a property change; coalesces by property name and cancels when value equals original oldValue.
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
  /** Dispatches queued changes, invokes handlers, then `mutated()` and mutation dispatch. */
  dispatch() {
    if (this.dispatching === true) {
      debug: console.error('ChangeQueue: dispatching already in progress!')
      return
    }
    this.dispatching = true
    // Hold one binding wave across all *-changed in this pass so parallel
    // networks settle before any spoke flush; close before this node's mutated().
    enterBindingEpoch()
    let properties: string[]
    try {
      properties = this.#dispatchQueuedChanges()
      this.#changes.clear()
    } finally {
      leaveBindingEpoch()
    }
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
    this.node.dispatch(property + '-changed', change)
    properties.push(property)
  }
  #invokeChanged() {
    try {
      this.node.mutated()
    } catch (error) {
      console.error(`Error in ${this.node.constructor.name}.mutated():`, error)
    }
  }
  #invokeMutation(properties: string[]) {
    if (isReactiveNode(this.node)) {
      this.node.dispatchMutation(this.node, properties)
    }
  }
  /**
   * Clears the queue and removes the node reference for garbage collection.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.#changes.clear()
    Object.defineProperty(this, 'changes', {value: undefined, configurable: true})
    delete (this as {node?: ReactiveNode}).node
  }
}
