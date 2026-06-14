import { Register } from '../decorators/Register.js'
import { ProtoChain } from '../core/ProtoChain.js'
import { Binding } from '../core/Binding.js'
import type { ChangeQueue } from '../core/ChangeQueue.js'
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose, removeSelfMutationListener, removeWindowMutationListener } from '../core/ReactiveProperty.js'
import type { EventDispatcher } from '../core/EventDispatcher.js'
import { NodeArray } from '../core/NodeArray.js'
import { throttle, debounce, clearNodeQueue, CallbackFunction } from '../core/Queue.js'
import { addParent, detachChildParents, initReactiveOwnerInternals, isIoValue, removeParent, DisposableInternals } from '../core/ReactiveCore.js'
import { ReactiveProperty } from '../decorators/Property.js'
import { IoElement } from '../elements/IoElement.js'
import type { ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js'

export type AnyConstructor = new (...args: never[]) => object

/** Instantiates a property type constructor with runtime constructor arguments. */
export function constructType(ctor: AnyConstructor, ...args: unknown[]): object {
  return new (ctor as new (...args: unknown[]) => object)(...args)
}
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>
export type PropertyValues = Record<string, unknown>

export type ListenerDefinitions = {
  [key: string]: ListenerDefinitionLoose
}
export interface ReactiveNodeConstructor {
  ReactiveProperties?: ReactivePropertyDefinitions
  Properties?: Record<string, unknown>
  Listeners?: ListenerDefinitions
  Style?: string
  name?: string
  prototype: ReactiveNodeConstructor | object | HTMLElement
}

export interface Json {
  [key: string]: string | number | boolean | Json | Json[]
}

export const NODES = {
  active: new Set<ReactiveNode>(),
  disposed: new WeakSet<ReactiveNode>(),
}

export type ReactivityType = 'immediate' | 'throttled' | 'debounced'

// Utility type to add Binding to all properties of a type
export type WithBinding<T> = T | Binding<T>

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never
type AnyEventHandler = (
  (event: CustomEvent) => void) |
  ((event: PointerEvent) => void) |
  ((event: KeyboardEvent) => void) |
  ((event: MouseEvent) => void) |
  ((event: TouchEvent) => void) |
  ((event: WheelEvent) => void) |
  ((event: InputEvent) => void) |
  ((event: ClipboardEvent) => void) |
  ((event: DragEvent) => void) |
  ((event: FocusEvent) => void) |
  ((event: TransitionEvent) => void) |
  ((event: AnimationEvent) => void) |
  ((event: ErrorEvent) => void) |
  ((event: Event) => void)

export type ReactiveNodeProps = {
  reactivity?: ReactivityType
  [key: prefix<string, '@'>]: string | AnyEventHandler
}

function hasValueAtOtherProperty(node: ReactiveNode | IoElement, prop: ReactivePropertyInstance, value: unknown): boolean {
  let found = false
  node._reactiveProperties.forEach((p) => {
    if (p !== prop && p.value === value) found = true
  })
  return found
}

/**
 * Base class for reactive data models and state containers.
 *
 * ReactiveNode provides the core Io-Gui reactive property system without DOM
 * integration. Subclass it for domain models (for example menu options, layout
 * tabs, or theme state). Property changes dispatch change events and invoke
 * matching handlers; object mutations can propagate via {@link dispatchMutation}.
 *
 * Use {@link bind} for two-way synchronization between properties. Nodes register
 * with {@link Register} and declare reactive properties via static
 * `ReactiveProperties` or `@ReactiveProperty` decorators.
 *
 * @see IoElement for the DOM-integrated counterpart
 */
@Register
export class ReactiveNode extends Object {

  @ReactiveProperty({type: String, value: 'immediate'})
  declare reactivity: ReactivityType

  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {}
  }

  static get Properties(): Record<string, unknown> {
    return {}
  }

  /** Class-level listeners wired at construction; subclass overrides same event name (last wins). */
  static get Listeners(): ListenerDefinitions {
    return {}
  }

  declare readonly _protochain: ProtoChain
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>
  declare readonly _bindings: Map<string, Binding<unknown>>
  declare readonly _changeQueue: ChangeQueue
  declare readonly _eventDispatcher: EventDispatcher
  declare readonly _children: Array<ReactiveNode | IoElement>
  declare readonly _parents: Array<ReactiveNode | IoElement>
  declare _hasWindowMutationListener: boolean
  declare _hasSelfMutationListener: boolean
  declare readonly _isNode: boolean
  declare _disposed: boolean

  constructor(args?: unknown) {
    super()
    this._protochain.init(this)

    initReactiveOwnerInternals(this)

    this.init()

    initReactiveProperties(this)
    initProperties(this)

    this.applyProperties((typeof args === 'object' && args !== null ? args : {}) as PropertyValues, true)

    NODES.active.add(this)

    this.ready()
    this.dispatchQueue()
  }
  applyProperties(props: PropertyValues, skipDispatch = false) {
    for (const name in props) {
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true)
      } else {
        if (!name.startsWith('@')) {
          (this as Record<string, unknown>)[name] = props[name]
          debug: if (props[name] instanceof Binding) {
            console.warn(`ReactiveNode: Not a ReactiveProperty! Cannot set binding to "${name}" property on "${this.constructor.name}"`)
          }
        }
      }
    }
    this._eventDispatcher.applyPropListeners(props)
    if (!skipDispatch) this.dispatchQueue()
  }
  setProperties(props: PropertyValues) {
    setProperties(this, props)
  }
  setProperty(name: string, value: unknown, debounce = false) {
    if (this._disposed) return
    setProperty(this, name, value, debounce)
  }
  copy(node: ReactiveNode) {
    const primitiveProps: PropertyValues = {}
    for (const name in node._reactiveProperties) {
      const prop = node._reactiveProperties.get(name)!.value
      const ownValue = this._reactiveProperties.get(name)!.value
      if (isIoValue(prop) && ownValue instanceof ReactiveNode) {
        ownValue.copy(prop as ReactiveNode)
      } else {
        primitiveProps[name] = prop
      }
    }
    this.setProperties(primitiveProps)
  }

  toJSON(): Json {
    const out: Json = {}
    for (const key of this._reactiveProperties.keys()) {
      if (key === 'reactivity') continue
      const value = this._reactiveProperties.get(key as string)!.value
      if (value instanceof Object && typeof value.toJSON === 'function') {
        out[key] = value.toJSON()
      } else if (typeof value === 'number') {
        out[key] = value
      }
    }
    return out
  }

  applyJSON(json: Json) {
    const primitiveProps: Json = {}
    for (const name in json) {
      const propDef = this._reactiveProperties.get(name as string)!
      const value = propDef.value
      const type = propDef.type
      if (value instanceof Object) {
        if (typeof value.applyJSON === 'function') {
          value.applyJSON(json[name])
        } else {
          console.warn(`ReactiveNode.applyJSON(): Property "${name}" does not have applyJSON() method implemented!`)
          continue
        }
      } else {
        debug: {
          if (type === json.constructor) {
            console.warn(`ReactiveNode.applyJSON(): Property "${name}" is not a ${type.name}!`, json)
            continue
          }
        }
        primitiveProps[name] = json[name]
      }
    }
    this.setProperties(primitiveProps)
    return this
  }

  init() {}
  ready() {}
  changed() {}
  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
  queue(name: string, value: unknown, oldValue: unknown) {
    this._changeQueue.queue(name, value, oldValue)
  }
  dispatchQueue(debounce = false) {
    dispatchQueue(this, debounce)
  }
  throttle(func: CallbackFunction, arg?: unknown, timeout = 1) {
    throttle(func, arg, this, timeout)
  }
  debounce(func: CallbackFunction, arg?: unknown, timeout = 1) {
    debounce(func, arg, this, timeout)
  }
  onPropertyMutated(event: CustomEvent) {
    return onPropertyMutated(this, event)
  }
  dispatchMutation(object: object | ReactiveNode = this, properties: string[] = []) {
    dispatchMutation(this, object, properties)
  }
  bind<K extends keyof this & string>(name: K): Binding<this[K]>
  bind(name: string): Binding<unknown>
  bind(name: string): Binding<unknown> {
    return bind(this, name)
  }
  unbind<K extends keyof this & string>(name: K): void
  unbind(name: string): void
  unbind(name: string): void {
    unbind(this, name)
  }
  addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.addEventListener(type, listener as EventListener, options)
  }
  removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.removeEventListener(type, listener as EventListener, options)
  }
  dispatch(type: string, detail: unknown = undefined, bubbles = false, src?: ReactiveNode | HTMLElement | Document | Window) {
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src)
  }
  addParent(parent: ReactiveNode | IoElement) {
    addParent(this, parent)
  }
  removeParent(parent: ReactiveNode | IoElement) {
    removeParent(this, parent)
  }
  dispose() {
    dispose(this)
    NODES.active.delete(this)
    NODES.disposed.add(this)
  }
  Register(ioNodeConstructor: typeof ReactiveNode) {
    Object.defineProperty(ioNodeConstructor.prototype, '_isNode', {enumerable: false, value: true, writable: false})
    Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)})
  }
}

export function initReactiveProperties(node: ReactiveNode | IoElement) {
  for (const name in node._protochain.reactiveProperties) {
    Object.defineProperty(node, name, {
      get: function() {
        return node._reactiveProperties.get(name)!.value
      },
      set: function(value) {
        node.setProperty(name, value)
      },
      configurable: true,
      enumerable: true,
    })
    const property = new ReactivePropertyInstance(node, node._protochain.reactiveProperties[name])
    node._reactiveProperties.set(name, property)
    if (property.binding) property.binding.addTarget(node, name)

    property.observer.start(property.value)
    if (isIoValue(property.value)) {
      (property.value as ReactiveNode | IoElement).addParent(node)
    }

    if (node instanceof IoElement) {
      if (property.reflect && property.value !== undefined && property.value !== null) {
        node.setAttribute(name, property.value)
      }
    }
  }
}
export function initProperties(node: ReactiveNode | IoElement) {
  for (const name in node._protochain.properties) {
    let initialValue = node._protochain.properties[name]
    if (typeof initialValue === 'function') {
      initialValue = constructType(initialValue as AnyConstructor)
    } else if (initialValue instanceof Array) {
      initialValue = initialValue.slice()
    } else if (typeof initialValue === 'object') {
      initialValue = Object.assign({}, initialValue)
    }
    (node as unknown as Record<string, unknown>)[name] = initialValue
  }
}
export function setProperties(node: ReactiveNode | IoElement, props: PropertyValues) {
  for (const name in props) {
    if (!node._reactiveProperties.has(name)) {
      debug: console.warn(`Property "${name}" is not defined`, node)
      continue
    }
    node.setProperty(name, props[name], true)
  }
  node.dispatchQueue()
}
function applyPropertyBinding(node: ReactiveNode | IoElement, name: string, prop: ReactivePropertyInstance, value: unknown) {
  if (!(value instanceof Binding)) return false

  const binding = value
  const oldBinding = prop.binding
  if (binding !== oldBinding) {
    if (oldBinding) {
      oldBinding.removeTarget(node, name)
    }
    binding.addTarget(node, name)
    // NOTE: binding.addTarget() triggers setProperty() again with the resolved value.
    return true
  }

  // NOTE: Remedy for batch-set via change() > template() > setProperties() with existing bindings.
  return true
}

function applyNodeArrayAssignment(name: string, prop: ReactivePropertyInstance, value: unknown) {
  if (prop.type !== NodeArray || !Array.isArray(value) || value instanceof NodeArray) return false

  const nodeArray = prop.value as NodeArray<ReactiveNode>

  debug: if (value.some(item => !isIoValue(item))) {
    console.error(`Node: Property "${name}" should be assigned as an Array of nodes!`, value)
  }
  debug: if (nodeArray.constructor !== NodeArray) {
    console.error(`Node: Property "${name}" should be initialized as a NodeArray!`, nodeArray)
  }

  nodeArray.withInternalOperation(() => {
    nodeArray.length = 0
    nodeArray.push(...value as ReactiveNode[])
    if (value.length === 0) {
      nodeArray.dispatchMutation()
    }
  })
  return true
}

function disconnectPropertyValue(node: ReactiveNode | IoElement, prop: ReactivePropertyInstance, oldValue: unknown) {
  if (!hasValueAtOtherProperty(node, prop, oldValue)) {
    prop.observer.stop(oldValue)
    if (isIoValue(oldValue) && !oldValue._disposed) {
      (oldValue as ReactiveNode | IoElement).removeParent(node)
    }
  } else {
    prop.observer.observing = false
  }
}

function connectPropertyValue(node: ReactiveNode | IoElement, prop: ReactivePropertyInstance, value: unknown) {
  if (!hasValueAtOtherProperty(node, prop, value)) {
    prop.observer.start(value)
    if (isIoValue(value)) {
      (value as ReactiveNode | IoElement).addParent(node)
    }
  }
}

function debugPropertyType(node: ReactiveNode | IoElement, name: string, prop: ReactivePropertyInstance, value: unknown) {
  debug: {
    if (prop.type === String) {
      if (typeof value !== 'string') {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    } else if (prop.type === Number) {
      if (typeof value !== 'number') {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    } else if (prop.type === Boolean) {
      if (typeof value !== 'boolean') {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    } else if (prop.type === Array) {
      if (!(value instanceof Array)) {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    } else if (prop.type === Object) {
      if (value instanceof Array) {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    } else if (prop.type === NodeArray) {
      if (!(value instanceof NodeArray)) {
        console.error(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
      if ((value as unknown[]).some(item => !isIoValue(item))) {
        console.error(`Wrong type of property "${name}". NodeArray items should be nodes!`, value)
      }
    } else if (typeof prop.type === 'function') {
      if (!(value instanceof prop.type)) {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    }
  }
}

/** Assigns a reactive property, queuing change dispatch unless debounced. */
export function setProperty(node: ReactiveNode | IoElement, name: string, value: unknown, debounce = false) {
  const prop = node._reactiveProperties.get(name)!
  const oldValue = prop.value

  if (value === oldValue) return

  if (applyPropertyBinding(node, name, prop, value)) return
  if (applyNodeArrayAssignment(name, prop, value)) return

  disconnectPropertyValue(node, prop, oldValue)
  prop.value = value
  connectPropertyValue(node, prop, value)
  debugPropertyType(node, name, prop, value)

  node.queue(name, value, oldValue)
  node.dispatchQueue(debounce)
}
export function dispatchQueue(node: ReactiveNode | IoElement, debounce = false) {
  if (node.reactivity === 'debounced' || debounce || node._changeQueue.dispatching) {
    node.debounce(node._changeQueue.dispatch)
  } else if (node.reactivity === 'throttled') {
    node.throttle(node._changeQueue.dispatch)
  } else if (node.reactivity === 'immediate') {
    node._changeQueue.dispatch()
  }
  debug: if (['immediate', 'throttled', 'debounced'].indexOf(node.reactivity) === -1) {
    console.warn(`ReactiveNode.dispatchQueue(): Invalid reactivity property value: "${node.reactivity}".
      Expected one of: "immediate", "throttled", "debounced".`)
  }
}

/** Dispatches `io-object-mutation` for in-place object or nested Io value changes. */
export function dispatchMutation(node: ReactiveNode | IoElement, object: object | ReactiveNode, properties: string[]) {
  if (isIoValue(object)) {
    node.dispatch('io-object-mutation', {object, properties})
  } else {
    node.dispatch('io-object-mutation', {object, properties}, false, window)
  }
}
export function onPropertyMutated(node: ReactiveNode | IoElement, event: CustomEvent) {
  const object = event.detail.object

  let hasMutated = false
  node._reactiveProperties.forEach((prop, name) => {
    if (prop.observer.observing && prop.value === object) {
      const handlerName = name + 'Mutated' as keyof ReactiveNode
      const handler = (node as ReactiveNode)[handlerName]
      if (typeof handler === 'function') {
        (handler as (event: CustomEvent) => void)(event)
      }
      hasMutated = true
    }
  })
  return hasMutated
}
/** Returns or creates a two-way {@link Binding} for the named reactive property. */
export function bind<TNode extends ReactiveNode | IoElement, K extends keyof TNode & string>(node: TNode, name: K): Binding<TNode[K]>
export function bind(node: ReactiveNode | IoElement, name: string): Binding<unknown>
export function bind(node: ReactiveNode | IoElement, name: string): Binding<unknown> {
  debug: if (!node._reactiveProperties.has(name)) {
    console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`)
  }
  if (!node._bindings.has(name)) {
    node._bindings.set(name, new Binding(node, name))
  }
  return node._bindings.get(name)! as Binding<unknown>
}
/** Disposes and removes the binding for the named reactive property. */
export function unbind<TNode extends ReactiveNode | IoElement, K extends keyof TNode & string>(node: TNode, name: K): void
export function unbind(node: ReactiveNode | IoElement, name: string): void
export function unbind(node: ReactiveNode | IoElement, name: string): void {
  const binding = node._bindings.get(name)
  if (binding) {
    binding.dispose()
    node._bindings.delete(name)
  }
  const property = node._reactiveProperties.get(name)
  property?.binding?.removeTarget(node, name)
}
export { detachChildParents } from '../core/ReactiveCore.js'
/** Tears down bindings, listeners, queues, and parent links for a reactive owner. */
export function dispose(node: ReactiveNode | IoElement) {
  debug: if (node._disposed) {
    console.warn('ReactiveNode.dispose(): Already disposed!', node.constructor.name)
  }

  if (node._disposed) return

  detachChildParents(node)
  clearNodeQueue(node)

  const mutable = node as DisposableInternals

  node._bindings.forEach((binding, name) => {
    binding.dispose()
    node._bindings.delete(name)
  })
  delete mutable._bindings

  node._changeQueue.dispose()
  delete mutable._changeQueue

  node._reactiveProperties.forEach((property, name) => {
    property.binding?.removeTarget(node, name)
    property.observer.stop(property.value)
    property.observer.dispose()
  })

  removeWindowMutationListener(node)
  removeSelfMutationListener(node)

  for (const name in node._protochain.properties) {
    delete (node as ReactiveNode)[name as keyof ReactiveNode]
  }
  delete mutable._protochain

  // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
  node._eventDispatcher.dispose()
  delete mutable._eventDispatcher
  delete mutable._reactiveProperties

  if (mutable._parents) {
    mutable._parents.length = 0
    delete mutable._parents
  }
  if (mutable._children) {
    mutable._children.length = 0
    delete mutable._children
  }

  Object.defineProperty(node, '_disposed', {value: true})
};