import { Register } from '../decorators/Register.js'
import { ProtoChain } from '../core/ProtoChain.js'
import { Binding } from '../core/Binding.js'
import { ChangeQueue } from '../core/ChangeQueue.js'
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose, removeSelfMutationListener, removeWindowMutationListener } from '../core/ReactiveProperty.js'
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js'
import { NodeArray } from '../core/NodeArray.js'
import { throttle, debounce, clearNodeQueue, CallbackFunction } from '../core/Queue.js'
import { ReactiveProperty } from '../decorators/Property.js'
import { IoElement } from '../elements/IoElement.js'

export type AnyConstructor = new (...args: any[]) => unknown
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>

export type ListenerDefinitions = {
  [key: string]: ListenerDefinitionLoose
}
export interface ReactiveNodeConstructor {
  ReactiveProperties?: ReactivePropertyDefinitions
  Properties?: Record<string, any>
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
  (event: CustomEvent<any>) => void) |
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


function isIoObject(value: any) {
  return (typeof value === 'object' && value !== null && (value._isNode || value._isIoElement))
}

function hasValueAtOtherProperty(node: ReactiveNode | IoElement, prop: ReactivePropertyInstance, value: any): boolean {
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

  static get Properties(): Record<string, any> {
    return {}
  }

  /**
   * Declares class-level event listeners wired at construction via {@link EventDispatcher}.
   * Subclass definitions replace parent handlers for the same event name (last wins).
   * Use {@link addEventListener} for additional listeners at runtime.
   */
  static get Listeners(): ListenerDefinitions {
    return {}
  }

  declare readonly _protochain: ProtoChain
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>
  declare readonly _bindings: Map<string, Binding<unknown>>
  declare readonly _changeQueue: ChangeQueue
  declare readonly _eventDispatcher: EventDispatcher
  declare readonly _parents: Array<ReactiveNode | IoElement>
  declare readonly _children: Array<ReactiveNode | IoElement>
  declare _hasWindowMutationListener: boolean
  declare _hasSelfMutationListener: boolean
  declare readonly _isNode: boolean
  declare _disposed: boolean

  constructor(args?: any) {
    super()
    this._protochain.init(this)

    Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)})
    Object.defineProperty(this, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()})
    Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()})
    Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)})
    Object.defineProperty(this, '_parents', {enumerable: false, configurable: true, value: []})
    Object.defineProperty(this, '_children', {enumerable: false, configurable: true, value: []})
    Object.defineProperty(this, '_hasWindowMutationListener', {enumerable: false, configurable: true, writable: true, value: false})
    Object.defineProperty(this, '_hasSelfMutationListener', {enumerable: false, configurable: true, writable: true, value: false})

    this.init()

    initReactiveProperties(this)
    initProperties(this)

    this.applyProperties(typeof args === 'object' ? args : {}, true)

    NODES.active.add(this)

    this.ready()
    this.dispatchQueue()
  }
  // TODO: add types
  applyProperties(props: any, skipDispatch = false) {
    for (const name in props) {
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true)
      } else {
        if (!name.startsWith('@')) {
          this[name as keyof this] = props[name]
          debug: if (props[name] instanceof Binding) {
            console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on "${this.constructor.name}"`)
          }
        }
      }
    }
    this._eventDispatcher.applyPropListeners(props)
    if (!skipDispatch) this.dispatchQueue()
  }
  // TODO: add types
  setProperties(props: any) {
    setProperties(this, props)
  }
  setProperty(name: string, value: any, debounce = false) {
    if (this._disposed) return
    setProperty(this, name, value, debounce)
  }
  copy(node: ReactiveNode) {
    const primitiveProps: Record<string, any> = {}
    for (const name in node._reactiveProperties) {
      const prop = node._reactiveProperties.get(name)!.value
      if (prop._isNode) {
        primitiveProps[name].copy(prop)
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
  queue(name: string, value: any, oldValue: any) {
    this._changeQueue.queue(name, value, oldValue)
  }
  dispatchQueue(debounce = false) {
    dispatchQueue(this, debounce)
  }
  throttle(func: CallbackFunction, arg?: any, timeout = 1) {
    throttle(func, arg, this, timeout)
  }
  debounce(func: CallbackFunction, arg?: any, timeout = 1) {
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
  dispatch(type: string, detail: any = undefined, bubbles = false, src?: ReactiveNode | HTMLElement | Document | Window) {
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src)
  }
  addParent(parent: ReactiveNode | IoElement) {
    if ((parent as ReactiveNode)._isNode || (parent as IoElement)._isIoElement) {
      if (!this._parents.includes(parent)) {
        this._parents.push(parent)
        const children = (parent as ReactiveNode | IoElement)._children
        if (!children.includes(this)) children.push(this)
      }
    }
  }
  removeParent(parent: ReactiveNode | IoElement) {
    if (this._disposed) return
    if ((parent as ReactiveNode)._isNode || (parent as IoElement)._isIoElement) {
      const index = this._parents.indexOf(parent)
      if (index !== -1) {
        this._parents.splice(index, 1)
        const childIndex = parent._children.indexOf(this)
        if (childIndex !== -1) parent._children.splice(childIndex, 1)
      } else {
        debug: console.warn('ReactiveNode.removeParent(): Parent not found!', this, parent)
      }
    }
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
    if (property.value?._isNode) {
      property.value.addParent(node)
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
      initialValue = new initialValue()
    } else if (initialValue instanceof Array) {
      initialValue = initialValue.slice()
    } else if (typeof initialValue === 'object') {
      initialValue = Object.assign({}, initialValue)
    }
    (node as any)[name] = initialValue
  }
}
export function setProperties(node: ReactiveNode | IoElement, props: any) {
  for (const name in props) {
    if (!node._reactiveProperties.has(name)) {
      debug: console.warn(`Property "${name}" is not defined`, node)
      continue
    }
    node.setProperty(name, props[name], true)
  }
  node.dispatchQueue()
}
function applyPropertyBinding(node: ReactiveNode | IoElement, name: string, prop: ReactivePropertyInstance, value: any): boolean {
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

function applyNodeArrayAssignment(node: ReactiveNode | IoElement, name: string, prop: ReactivePropertyInstance, value: any): boolean {
  if (prop.type !== NodeArray || value.constructor !== Array) return false

  const nodeArray = prop.value as NodeArray<ReactiveNode>

  debug: if ((value as Array<any>).some(item => !item._isNode)) {
    console.error(`Node: Property "${name}" should be assigned as an Array of nodes!`, value)
  }
  debug: if (nodeArray.constructor !== NodeArray) {
    console.error(`Node: Property "${name}" should be initialized as a NodeArray!`, nodeArray)
  }

  nodeArray.withInternalOperation(() => {
    nodeArray.length = 0
    nodeArray.push(...value as Array<ReactiveNode>)
    if (value.length === 0) {
      nodeArray.dispatchMutation()
    }
  })
  return true
}

function disconnectPropertyValue(node: ReactiveNode | IoElement, prop: ReactivePropertyInstance, oldValue: any) {
  if (!hasValueAtOtherProperty(node, prop, oldValue)) {
    prop.observer.stop(oldValue)
    if (oldValue?._isNode && !oldValue._disposed) {
      oldValue.removeParent(node)
    }
  } else {
    prop.observer.observing = false
  }
}

function connectPropertyValue(node: ReactiveNode | IoElement, prop: ReactivePropertyInstance, value: any) {
  if (!hasValueAtOtherProperty(node, prop, value)) {
    prop.observer.start(value)
    if (value?._isNode) {
      value.addParent(node)
    }
  }
}

function debugPropertyType(node: ReactiveNode | IoElement, name: string, prop: ReactivePropertyInstance, value: any) {
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
      if ((value as Array<any>).some(item => !item._isNode)) {
        console.error(`Wrong type of property "${name}". NodeArray items should be nodes!`, value)
      }
    } else if (typeof prop.type === 'function') {
      if (!(value instanceof prop.type)) {
        console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, node)
      }
    }
  }
}

export function setProperty(node: ReactiveNode | IoElement, name: string, value: any, debounce = false) {
  const prop = node._reactiveProperties.get(name)!
  const oldValue = prop.value

  if (value === oldValue) return

  if (applyPropertyBinding(node, name, prop, value)) return
  if (applyNodeArrayAssignment(node, name, prop, value)) return

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

// TODO: Consider using global event bus for all mutation events!
export function dispatchMutation(node: ReactiveNode | IoElement, object: object | ReactiveNode, properties: string[]) {
  if (isIoObject(object)) {
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
      if (typeof (node as ReactiveNode)[handlerName] === 'function') {
        (node as any)[handlerName](event)
      }
      hasMutated = true
    }
  })
  return hasMutated
}
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
export function detachChildParents(node: ReactiveNode | IoElement) {
  for (let i = node._children.length; i--;) {
    const child = node._children[i]
    if ((child as ReactiveNode)._isNode && !child._disposed) {
      (child as ReactiveNode).removeParent(node)
    }
  }
}
export function dispose(node: ReactiveNode | IoElement) {
  debug: if (node._disposed) {
    console.warn('ReactiveNode.dispose(): Already disposed!', node.constructor.name)
  }

  if (node._disposed) return

  detachChildParents(node)
  clearNodeQueue(node)

  node._bindings.forEach((binding, name) => {
    binding.dispose()
    node._bindings.delete(name)
  })
  delete (node as any)._bindings

  node._changeQueue.dispose()
  delete (node as any)._changeQueue

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
  delete (node as any)._protochain

  // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
  node._eventDispatcher.dispose()
  delete (node as any)._eventDispatcher
  delete (node as any)._reactiveProperties

  if ((node as any)._parents) {
    (node as any)._parents.length = 0
    delete (node as any)._parents
  }
  if ((node as any)._children) {
    (node as any)._children.length = 0
    delete (node as any)._children
  }

  Object.defineProperty(node, '_disposed', {value: true})
};