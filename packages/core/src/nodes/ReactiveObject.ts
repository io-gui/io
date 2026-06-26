import { Register } from '../decorators/Register.js'
import { ProtoChain } from '../core/ProtoChain.js'
import { Binding } from '../core/Binding.js'
import type { ChangeQueue } from '../core/ChangeQueue.js'
import { PropertyInstance, PropertyDefinitionLoose, removeSelfMutationListener, removeWindowMutationListener } from '../core/Property.js'
import type { EventDispatcher } from '../core/EventDispatcher.js'
import { NodeArray } from '../core/NodeArray.js'
import { throttle, debounce, clearNodeCallbacks, CallbackFunction } from '../core/FrameScheduler.js'
import { addParent, detachChildParents, initReactiveNodeInternals, isReactiveNode, removeParent, DisposableInternals, type ReactiveNode } from '../core/ReactiveCore.js'
import { Property } from '../decorators/Property.js'
import { ReactiveElement } from '../elements/ReactiveElement.js'
import type { ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js'

export type AnyConstructor = new (...args: never[]) => object

/** Instantiates a property type constructor with runtime constructor arguments. */
export function constructType(ctor: AnyConstructor, ...args: unknown[]): object {
  return new (ctor as new (...args: unknown[]) => object)(...args)
}
export type PropertyDefinitions = Record<string, PropertyDefinitionLoose>
export type PropertyValues = Record<string, unknown>

export type ListenerDefinitions = {
  [key: string]: ListenerDefinitionLoose
}
export interface ReactiveNodeConstructor {
  Properties?: PropertyDefinitions
  Fields?: Record<string, unknown>
  Listeners?: ListenerDefinitions
  Style?: string
  name?: string
  prototype: ReactiveNodeConstructor | object | HTMLElement
}

export type JsonPrimitive = string | number | boolean | null
export type JsonObject = { [key: string]: Json }
export type JsonArray = Json[]
export type Json = JsonPrimitive | JsonObject | JsonArray

export const NODES = {
  active: new Set<ReactiveObject>(),
  disposed: new WeakSet<ReactiveObject>(),
}

export type DispatchTiming = 'immediate' | 'throttled' | 'debounced'

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

export type ReactiveObjectProps = {
  dispatchTiming?: DispatchTiming
  [key: prefix<string, '@'>]: string | AnyEventHandler
}

function hasValueAtOtherProperty(node: ReactiveNode, prop: PropertyInstance, value: unknown): boolean {
  let found = false
  node._properties.forEach((p) => {
    if (p !== prop && p.value === value) found = true
  })
  return found
}

/**
 * Base class for reactive data models and state containers.
 *
 * ReactiveObject provides the core Io-Gui reactive property system without DOM
 * integration. Subclass it for domain models (for example menu options, layout
 * tabs, or theme state). Field changes dispatch change events and invoke
 * matching handlers; object mutations can propagate via {@link dispatchMutation}.
 *
 * Use {@link bind} for two-way synchronization between properties. Nodes register
 * with {@link Register} and declare reactive properties via static
 * `Properties` or `@Property` decorators.
 *
 * @see ReactiveElement for the DOM-integrated counterpart
 */
@Register
export class ReactiveObject extends Object {

  @Property({type: String, value: 'immediate'})
  declare dispatchTiming: DispatchTiming

  static get Properties(): PropertyDefinitions {
    return {}
  }

  static get Fields(): Record<string, unknown> {
    return {}
  }

  /** Class-level listeners wired at construction; subclass overrides same event name (last wins). */
  static get Listeners(): ListenerDefinitions {
    return {}
  }

  declare readonly _protochain: ProtoChain
  declare readonly _properties: Map<string, PropertyInstance>
  declare readonly _bindings: Map<string, Binding<unknown>>
  declare readonly _changeQueue: ChangeQueue
  declare readonly _eventDispatcher: EventDispatcher
  declare readonly _children: Array<ReactiveNode>
  declare readonly _parents: Array<ReactiveNode>
  declare _hasWindowMutationListener: boolean
  declare _hasSelfMutationListener: boolean
  declare readonly _isReactiveObject: boolean
  declare _disposed: boolean

  constructor(args?: unknown) {
    super()
    this._protochain.init(this)

    initReactiveNodeInternals(this)

    this.init()

    initProperties(this)
    initFields(this)

    this.applyProperties((typeof args === 'object' && args !== null ? args : {}) as PropertyValues, true)

    NODES.active.add(this)

    this.ready()
    this.dispatchQueue()
  }
  applyProperties(props: PropertyValues, skipDispatch = false) {
    for (const name in props) {
      if (this._properties.has(name)) {
        this.setProperty(name, props[name], true)
      } else {
        if (!name.startsWith('@')) {
          (this as Record<string, unknown>)[name] = props[name]
          debug: if (props[name] instanceof Binding) {
            console.warn(`ReactiveObject: Not a Property! Cannot set binding to "${name}" property on "${this.constructor.name}"`)
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
  copy(node: ReactiveObject) {
    const primitiveProps: PropertyValues = {}
    for (const name in node._properties) {
      const prop = node._properties.get(name)!.value
      const ownValue = this._properties.get(name)!.value
      if (isReactiveNode(prop) && ownValue instanceof ReactiveObject) {
        ownValue.copy(prop as ReactiveObject)
      } else {
        primitiveProps[name] = prop
      }
    }
    this.setProperties(primitiveProps)
  }

  toJSON(): Json {
    const out: JsonObject = {}
    for (const key of this._properties.keys()) {
      if (key === 'dispatchTiming') continue
      const value = this._properties.get(key as string)!.value
      if (typeof value === 'object' && value !== null && typeof (value as { toJSON?: () => Json }).toJSON === 'function') {
        out[key] = (value as { toJSON: () => Json }).toJSON()
      } else if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
        out[key] = value
      }
    }
    return out
  }

  applyJSON(json: Json) {
    const jsonObject = json as JsonObject
    const primitiveProps: JsonObject = {}
    for (const name in jsonObject) {
      const propDef = this._properties.get(name as string)!
      const value = propDef.value
      const type = propDef.type
      if (typeof value === 'object' && value !== null) {
        if (typeof (value as { applyJSON?: (json: unknown) => void }).applyJSON === 'function') {
          (value as { applyJSON: (json: unknown) => void }).applyJSON(jsonObject[name])
        } else {
          console.warn(`ReactiveObject.applyJSON(): Field "${name}" does not have applyJSON() method implemented!`)
          continue
        }
      } else {
        debug: {
          if (type && jsonObject[name]?.constructor !== type) {
            console.warn(`ReactiveObject.applyJSON(): Field "${name}" is not a ${type.name}!`, json)
            continue
          }
        }
        primitiveProps[name] = jsonObject[name]
      }
    }
    this.setProperties(primitiveProps)
    return this
  }

  init() {}
  ready() {}
  mutated() {}
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
  dispatchMutation(object: object | ReactiveObject = this, properties: string[] = []) {
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
  dispatch(type: string, detail: unknown = undefined, bubbles = false, src?: ReactiveObject | HTMLElement | Document | Window) {
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src as ReactiveObject)
  }
  addParent(parent: ReactiveNode) {
    addParent(this, parent)
  }
  removeParent(parent: ReactiveNode) {
    removeParent(this, parent)
  }
  dispose() {
    dispose(this)
    NODES.active.delete(this)
    NODES.disposed.add(this)
  }
  Register(ioNodeConstructor: typeof ReactiveObject) {
    Object.defineProperty(ioNodeConstructor.prototype, '_isReactiveObject', {enumerable: false, value: true, writable: false})
    Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)})
  }
}

export function initProperties(node: ReactiveNode) {
  for (const name in node._protochain.properties) {
    Object.defineProperty(node, name, {
      get: function() {
        return node._properties.get(name)!.value
      },
      set: function(value) {
        node.setProperty(name, value)
      },
      configurable: true,
      enumerable: true,
    })
    const property = new PropertyInstance(node, node._protochain.properties[name])
    node._properties.set(name, property)
    if (property.binding) property.binding.addTarget(node, name)

    property.observer.start(property.value)
    if (isReactiveNode(property.value)) {
      (property.value as ReactiveNode).addParent(node)
    }

    if (node instanceof ReactiveElement) {
      if (property.reflect && property.value !== undefined && property.value !== null) {
        node.setAttribute(name, property.value as string | number | boolean)
      }
    }
  }
}
export function initFields(node: ReactiveNode) {
  for (const name in node._protochain.fields) {
    let initialValue = node._protochain.fields[name]
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
export function setProperties(node: ReactiveNode, props: PropertyValues) {
  for (const name in props) {
    if (!node._properties.has(name)) {
      debug: console.warn(`Field "${name}" is not defined`, node)
      continue
    }
    node.setProperty(name, props[name], true)
  }
  node.dispatchQueue()
}
function applyPropertyBinding(node: ReactiveNode, name: string, prop: PropertyInstance, value: unknown) {
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

function applyNodeArrayAssignment(name: string, prop: PropertyInstance, value: unknown) {
  if (prop.type !== NodeArray || !Array.isArray(value) || value instanceof NodeArray) return false

  const nodeArray = prop.value as NodeArray<ReactiveObject>

  debug: if (value.some(item => !isReactiveNode(item))) {
    console.error(`Node: Field "${name}" should be assigned as an Array of nodes!`, value)
  }
  debug: if (nodeArray.constructor !== NodeArray) {
    console.error(`Node: Field "${name}" should be initialized as a NodeArray!`, nodeArray)
  }

  nodeArray.splice(0, nodeArray.length, ...(value as ReactiveObject[]))
  return true
}

function disconnectPropertyValue(node: ReactiveNode, prop: PropertyInstance, oldValue: unknown) {
  if (!hasValueAtOtherProperty(node, prop, oldValue)) {
    prop.observer.stop(oldValue)
    if (isReactiveNode(oldValue) && !oldValue._disposed) {
      (oldValue as ReactiveNode).removeParent(node)
    }
  } else {
    prop.observer.observing = false
  }
}

function connectPropertyValue(node: ReactiveNode, prop: PropertyInstance, value: unknown) {
  if (!hasValueAtOtherProperty(node, prop, value)) {
    prop.observer.start(value)
    if (isReactiveNode(value)) {
      (value as ReactiveNode).addParent(node)
    }
  }
}

function debugPropertyType(node: ReactiveNode, name: string, prop: PropertyInstance, value: unknown) {
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
      if ((value as unknown[]).some(item => !isReactiveNode(item))) {
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
export function setProperty(node: ReactiveNode, name: string, value: unknown, debounce = false) {
  const prop = node._properties.get(name)!
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
export function dispatchQueue(node: ReactiveNode, debounce = false) {
  if (node.dispatchTiming === 'debounced' || debounce || node._changeQueue.dispatching) {
    node.debounce(node._changeQueue.dispatch)
  } else if (node.dispatchTiming === 'throttled') {
    node.throttle(node._changeQueue.dispatch)
  } else if (node.dispatchTiming === 'immediate') {
    node._changeQueue.dispatch()
  }
  debug: if (['immediate', 'throttled', 'debounced'].indexOf(node.dispatchTiming) === -1) {
    console.warn(`ReactiveObject.dispatchQueue(): Invalid dispatchTiming property value: "${node.dispatchTiming}".
      Expected one of: "immediate", "throttled", "debounced".`)
  }
}

/** Dispatches `io-mutation` for in-place object or nested Io value changes. */
export function dispatchMutation(node: ReactiveNode, object: object | ReactiveObject, properties: string[]) {
  if (isReactiveNode(object)) {
    node.dispatch('io-mutation', {object, properties})
  } else {
    node.dispatch('io-mutation', {object, properties}, false, window)
  }
}
export function onPropertyMutated(node: ReactiveNode, event: CustomEvent) {
  const object = event.detail.object

  let hasMutated = false
  node._properties.forEach((prop, name) => {
    if (prop.observer.observing && prop.value === object) {
      const handlerName = name + 'Mutated' as keyof ReactiveObject
      const handler = (node as ReactiveObject)[handlerName]
      if (typeof handler === 'function') {
        (handler as (event: CustomEvent) => void)(event)
      }
      hasMutated = true
    }
  })
  return hasMutated
}
/** Returns or creates a two-way {@link Binding} for the named reactive property. */
export function bind<TNode extends ReactiveNode, K extends keyof TNode & string>(node: TNode, name: K): Binding<TNode[K]>
export function bind(node: ReactiveNode, name: string): Binding<unknown>
export function bind(node: ReactiveNode, name: string): Binding<unknown> {
  debug: if (!node._properties.has(name)) {
    console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`)
  }
  if (!node._bindings.has(name)) {
    node._bindings.set(name, new Binding(node, name))
  }
  return node._bindings.get(name)! as Binding<unknown>
}
/** Disposes and removes the binding for the named reactive property. */
export function unbind<TNode extends ReactiveNode, K extends keyof TNode & string>(node: TNode, name: K): void
export function unbind(node: ReactiveNode, name: string): void
export function unbind(node: ReactiveNode, name: string): void {
  const binding = node._bindings.get(name)
  if (binding) {
    binding.dispose()
    node._bindings.delete(name)
  }
  const property = node._properties.get(name)
  property?.binding?.removeTarget(node, name)
}
export { detachChildParents } from '../core/ReactiveCore.js'
/** Tears down bindings, listeners, queues, and parent links for a reactive owner. */
export function dispose(node: ReactiveNode) {
  debug: if (node._disposed) {
    console.warn('ReactiveObject.dispose(): Already disposed!', node.constructor.name)
  }

  if (node._disposed) return

  node._properties.forEach((property) => {
    if (property.value instanceof NodeArray) {
      property.value.dispose()
    }
  })

  detachChildParents(node)
  clearNodeCallbacks(node)

  const mutable = node as DisposableInternals

  node._bindings.forEach((binding, name) => {
    binding.dispose()
    node._bindings.delete(name)
  })
  delete mutable._bindings

  node._changeQueue.dispose()
  delete mutable._changeQueue

  node._properties.forEach((property, name) => {
    property.binding?.removeTarget(node, name)
    property.observer.stop(property.value)
    property.observer.dispose()
  })

  removeWindowMutationListener(node)
  removeSelfMutationListener(node)

  for (const name in node._protochain.fields) {
    delete (node as ReactiveObject)[name as keyof ReactiveObject]
  }
  delete mutable._protochain

  // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
  node._eventDispatcher.dispose()
  delete mutable._eventDispatcher
  delete mutable._properties

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