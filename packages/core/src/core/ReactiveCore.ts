import type { ReactiveNode } from '../nodes/ReactiveNode.js'
import type { IoElement } from '../elements/IoElement.js'
import { ChangeQueue } from './ChangeQueue.js'
import { EventDispatcher } from './EventDispatcher.js'

export type ReactiveOwner = ReactiveNode | IoElement

export function isReactiveOwner(value: unknown): value is ReactiveOwner {
  if (typeof value !== 'object' || value === null) return false
  const owner = value as ReactiveOwner
  return (owner as ReactiveNode)._isNode === true || (owner as IoElement)._isIoElement === true
}

export const isIoValue = isReactiveOwner

export function initReactiveOwnerInternals(owner: ReactiveOwner) {
  Object.defineProperty(owner, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(owner)})
  Object.defineProperty(owner, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()})
  Object.defineProperty(owner, '_bindings', {enumerable: false, configurable: true, value: new Map()})
  Object.defineProperty(owner, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(owner)})
  Object.defineProperty(owner, '_parents', {enumerable: false, configurable: true, value: []})
  Object.defineProperty(owner, '_children', {enumerable: false, configurable: true, value: []})
  Object.defineProperty(owner, '_hasWindowMutationListener', {enumerable: false, configurable: true, writable: true, value: false})
  Object.defineProperty(owner, '_hasSelfMutationListener', {enumerable: false, configurable: true, writable: true, value: false})
}

export function addParent(child: ReactiveOwner, parent: ReactiveOwner) {
  if (!isReactiveOwner(parent)) return
  if (!child._parents.includes(parent)) {
    child._parents.push(parent)
    if (!parent._children.includes(child)) parent._children.push(child)
  }
}

export function removeParent(child: ReactiveOwner, parent: ReactiveOwner) {
  if (child._disposed) return
  if (!isReactiveOwner(parent)) return
  const index = child._parents.indexOf(parent)
  if (index !== -1) {
    child._parents.splice(index, 1)
    const childIndex = parent._children.indexOf(child)
    if (childIndex !== -1) parent._children.splice(childIndex, 1)
  } else {
    debug: console.warn('ReactiveOwner.removeParent(): Parent not found!', child, parent)
  }
}

export function detachChildParents(owner: ReactiveOwner) {
  for (let i = owner._children.length; i--;) {
    const child = owner._children[i]
    if (isReactiveOwner(child) && !child._disposed) {
      removeParent(child, owner)
    }
  }
}
