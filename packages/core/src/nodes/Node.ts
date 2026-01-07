import { Register } from '../decorators/Register.js'
import { ProtoChain } from '../core/ProtoChain.js'
import { Binding } from '../core/Binding.js'
import { ChangeQueue } from '../core/ChangeQueue.js'
import { ReactivePropertyInstance, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js'
import { EventDispatcher, ListenerDefinitionLoose, AnyEventListener } from '../core/EventDispatcher.js'
import { NodeArray } from '../core/NodeArray.js'
import { throttle, debounce, CallbackFunction } from '../core/Queue.js'
import { ReactiveProperty } from '../decorators/Property.js'
import { IoElement } from '../elements/IoElement.js'

export type AnyConstructor = new (...args: any[]) => unknown
export type ReactivePropertyDefinitions = Record<string, ReactivePropertyDefinitionLoose>

export type ListenerDefinitions = {
  [key: string]: ListenerDefinitionLoose
}
export interface NodeConstructor {
  ReactiveProperties?: ReactivePropertyDefinitions
  Properties?: Record<string, any>
  Listeners?: ListenerDefinitions
  Style?: string
  name?: string
  prototype: NodeConstructor | object | HTMLElement
}

export const NODES = {
  active: new Set<Node>(),
  disposed: new WeakSet<Node>(),
}

export type ReactivityType = 'immediate' | 'throttled' | 'debounced'

// Utility type to add Binding to all properties of a type
export type WithBinding<T> = T | Binding

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never
type AnyEventHandler = ((event: CustomEvent<any>) => void) | ((event: PointerEvent) => void) | ((event: KeyboardEvent) => void) | ((event: MouseEvent) => void) | ((event: TouchEvent) => void) | ((event: WheelEvent) => void) | ((event: InputEvent) => void) | ((event: ClipboardEvent) => void) | ((event: DragEvent) => void) | ((event: FocusEvent) => void) | ((event: TransitionEvent) => void) | ((event: AnimationEvent) => void) | ((event: ErrorEvent) => void) | ((event: Event) => void)

export type NodeProps = {
  reactivity?: ReactivityType
  [key: prefix<string, '@'>]: string | AnyEventHandler
}


function isIoObject(value: any) {
  return (typeof value === 'object' && value !== null && (value._isNode || value._isIoElement))
}

function isNonIoObject(value: any) {
  return (typeof value === 'object' && value !== null && !(value._isNode || value._isIoElement))
}

@Register
export class Node extends Object {

  @ReactiveProperty({type: String, value: 'immediate'})
  declare reactivity: ReactivityType

  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {}
  }

  static get Properties(): Record<string, any> {
    return {}
  }

  static get Listeners(): ListenerDefinitions {
    return {}
  }

  declare readonly _protochain: ProtoChain
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>
  declare readonly _bindings: Map<string, Binding>
  declare readonly _changeQueue: ChangeQueue
  declare readonly _eventDispatcher: EventDispatcher
  declare _hasWindowMutationListener: boolean
  declare readonly _parents: Array<Node>
  declare readonly _isNode: boolean
  declare readonly _isIoElement: boolean
  declare _disposed: boolean

  constructor(args?: any) {
    super()
    this._protochain.init(this)

    Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)})
    Object.defineProperty(this, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()})
    Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()})
    Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)})
    Object.defineProperty(this, '_hasWindowMutationListener', {enumerable: false, configurable: true, writable: true, value: false})
    Object.defineProperty(this, '_parents', {enumerable: false, configurable: true, value: []})

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
  init() {}
  ready() {}
  changed() {}
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
  };
  dispatchMutation(object: object | Node = this, properties: string[] = []) {
    if (isIoObject(object) || (object as IoElement)._isIoElement) {
      this.dispatch('io-object-mutation', {object, properties})
    } else {
      this.dispatch('io-object-mutation', {object, properties}, false, window)
    }
  }
  bind(name: string): Binding {
    return bind(this, name)
  }
  unbind(name: string): void {
    unbind(this, name)
  }
  addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.addEventListener(type, listener as EventListener, options)
  }
  removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.removeEventListener(type, listener as EventListener, options)
  }
  dispatch(type: string, detail: any = undefined, bubbles = false, src?: Node | HTMLElement | Document | Window) {
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src)
  }
  // TODO: test!
  // TODO: Consider bubbling up to elements!
  addParent(parent: Node) {
    if (parent._isNode) {
      this._parents.push(parent)
    }
  }
  removeParent(parent: Node) {
    if (parent._isNode) {
      debug: if (!this._parents.includes(parent)) {
        console.error('Node.removeParent(): Parent not found!', this, parent)
      }
      this._parents.splice(this._parents.indexOf(parent), 1)
    }
  }
  dispose() {
    dispose(this)
    NODES.active.delete(this)
    NODES.disposed.add(this)
  }
  Register(ioNodeConstructor: typeof Node) {
    Object.defineProperty(ioNodeConstructor, '_isNode', {enumerable: false, value: true, writable: false})
    Object.defineProperty(ioNodeConstructor.prototype, '_isNode', {enumerable: false, value: true, writable: false})
    Object.defineProperty(ioNodeConstructor, '_isIoElement', {enumerable: false, value: false, writable: false})
    Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', {enumerable: false, value: false, writable: false})
    Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)})
  }
}

export function initReactiveProperties(node: Node | IoElement) {
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

    startPropertyObservation(node, property)

    if (node instanceof IoElement) {
      if (property.reflect && property.value !== undefined && property.value !== null) {
        node.setAttribute(name, property.value)
      }
    }
  }
}
export function initProperties(node: Node | IoElement) {
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
export function setProperties(node: Node | IoElement, props: any) {
  for (const name in props) {
    if (!node._reactiveProperties.has(name)) {
      debug: console.warn(`Property "${name}" is not defined`, node)
      continue
    }
    node.setProperty(name, props[name], true)
  }
  node.dispatchQueue()
}
export function setProperty(node: Node | IoElement, name: string, value: any, debounce = false) {
  const prop = node._reactiveProperties.get(name)!
  const oldValue = prop.value

  if (value !== oldValue) {
    const binding = (value instanceof Binding) ? value : null
    if (binding) {
      const oldBinding = prop.binding
      if (binding !== oldBinding) {
        if (oldBinding) {
          oldBinding.removeTarget(node, name)
        }
        binding.addTarget(node, name)
        // NOTE: We return here because binding.setTarget() will trigger execution of setProperty() again.
        return
      } else {
        // NOTE: This was a remedy for an old bug that might not be relevant anymore.
        // Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings,
        // it used to cause all but one of those properties to be reset to original value once parent changed.
        // This ugly hack fixed the bug by setting binding value from target when binding already exists.
        // TODO: keep an eye on this and remove if not needed.
        // binding.value = value = prop.value;
        return
      }
    }

    // TODO: test!
    // TODO: Document magic!
    if (prop.type === NodeArray && value.constructor === Array) {
      const nodeArray = prop.value as NodeArray<Node>

      debug: if ((value as Array<any>).some(item => !item._isNode)) {
        console.error(`Node: Property "${name}" should be assigned as an Array of nodes!`, value)
      }
      debug: if (nodeArray.constructor !== NodeArray) {
        console.error(`Node: Property "${name}" should be initialized as a NodeArray!`, nodeArray)
      }

      // TODO: test, benchmark!
      nodeArray.withInternalOperation(() => {
        nodeArray.length = 0
        nodeArray.push(...value as Array<Node>)
        if (value.length === 0) {
          nodeArray.dispatchMutation()
        }
      })
      return
    }

    const oldIsIo = isIoObject(oldValue)
    const newIsIo = isIoObject(value)

    // Stop observing the old Io value before changing
    if (prop.observer.observing && oldIsIo && !oldValue._disposed) {
      let hasOldValueAtOtherProperty = false
      node._reactiveProperties.forEach((property) => {
        if (property !== prop && property.value === oldValue) hasOldValueAtOtherProperty = true
      })
      if (!hasOldValueAtOtherProperty) {
        prop.observer.observing = false
        oldValue.removeEventListener('io-object-mutation', node.onPropertyMutated)
        if (oldValue._isNode) {
          oldValue.removeParent(node)
        }
      }
    }

    prop.value = value

    // Start observing the new Io value
    if (newIsIo) {
      let hasNewValueAtOtherProperty = false
      node._reactiveProperties.forEach((property) => {
        if (property !== prop && property.value === value) hasNewValueAtOtherProperty = true
      })
      if (!hasNewValueAtOtherProperty) {
        prop.observer.observing = true
        value.addEventListener('io-object-mutation', node.onPropertyMutated)
        if (value._isNode) {
          value.addParent(node)
        }
      }
    } else if (prop.observer.type === 'object' && !prop.observer.observing && isNonIoObject(value)) {
      // Start object observation if not already observing
      startPropertyObservation(node, prop)
    }

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
    if (oldValue !== value) {
      node.queue(name, value, oldValue)
      node.dispatchQueue(debounce)
    }
  }
}
export function dispatchQueue(node: Node | IoElement, debounce = false) {
  if (node.reactivity === 'debounced' || debounce || node._changeQueue.dispatching) {
    node.debounce(node._changeQueue.dispatch)
  } else if (node.reactivity === 'throttled') {
    node.throttle(node._changeQueue.dispatch)
  } else if (node.reactivity === 'immediate') {
    node._changeQueue.dispatch()
  }
  debug: if (['immediate', 'throttled', 'debounced'].indexOf(node.reactivity) === -1) {
    console.warn(`Node.dispatchQueue(): Invalid reactivity property value: "${node.reactivity}". Expected one of: "immediate", "throttled", "debounced".`)
  }
}
export function onPropertyMutated(node: Node | IoElement, event: CustomEvent) {
  const object = event.detail.object

  let hasMutated = false
  node._reactiveProperties.forEach((prop, name) => {
    if (prop.observer.observing && prop.value === object) {
      const handlerName = name + 'Mutated' as keyof Node
      if (typeof (node as Node)[handlerName] === 'function') {
        (node as any)[handlerName](event)
      }
      hasMutated = true
    }
  })
  return hasMutated
}
export function startPropertyObservation(node: Node | IoElement, property: ReactivePropertyInstance) {
  if (property.observer.observing) return
  if (!property.value) return

  // Determine observation mode based on actual value (not just declared type)
  // This allows backward compatibility with type-mismatched assignments
  const valueIsIo = isIoObject(property.value)
  const valueIsNonIo = isNonIoObject(property.value)

  if (valueIsIo) {
    // Io values: observe on the value itself
    let hasSameValueAtOtherProperty = false
    node._reactiveProperties.forEach((p) => {
      if (p !== property && p.value === property.value) hasSameValueAtOtherProperty = true
    })
    if (!hasSameValueAtOtherProperty) {
      property.observer.observing = true
      property.value.addEventListener('io-object-mutation', node.onPropertyMutated)
    }
  } else if (valueIsNonIo && property.observer.type === 'object') {
    // Non-Io object values with object-typed properties: observe via window
    property.observer.observing = true
    if (!node._hasWindowMutationListener) {
      node._hasWindowMutationListener = true
      window.addEventListener('io-object-mutation', node.onPropertyMutated as unknown as EventListener)
    }
  }
}

export function stopPropertyObservation(node: Node | IoElement, property: ReactivePropertyInstance) {
  if (!property.observer.observing) return

  if (isIoObject(property.value) && !property.value._disposed) {
    property.value.removeEventListener('io-object-mutation', node.onPropertyMutated)
  }
  // Note: We don't remove window listener here - it's done at dispose time
  property.observer.observing = false
}

/**
 * Enables mutation observation for a property regardless of its current value.
 * Useful for components that need to observe mutations on properties that may be
 * initially undefined or need observation before being assigned a value.
 */
export function enablePropertyObservation(node: Node | IoElement, propertyName: string) {
  const prop = node._reactiveProperties.get(propertyName)
  if (!prop) {
    debug: console.warn(`enablePropertyObservation: Property "${propertyName}" not found`)
    return
  }
  if (prop.observer.observing) return

  // For object-typed properties, enable window listener even if value is null/undefined
  if (prop.observer.type === 'object') {
    prop.observer.observing = true
    if (!node._hasWindowMutationListener) {
      node._hasWindowMutationListener = true
      window.addEventListener('io-object-mutation', node.onPropertyMutated as unknown as EventListener)
    }
  } else if (isIoObject(prop.value)) {
    // If current value is Io, observe it
    prop.observer.observing = true
    prop.value.addEventListener('io-object-mutation', node.onPropertyMutated)
  } else {
    // Mark as observing so future value changes are tracked
    prop.observer.observing = true
  }
}

export function bind(node: Node | IoElement, name: string) {
  debug: if (!node._reactiveProperties.has(name)) {
    console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`)
  }
  if (!node._bindings.has(name)) {
    node._bindings.set(name, new Binding(node, name))
  }
  return node._bindings.get(name)! as Binding
}
export function unbind(node: Node | IoElement, name: string) {
  const binding = node._bindings.get(name)
  if (binding) {
    binding.dispose()
    node._bindings.delete(name)
  }
  const property = node._reactiveProperties.get(name)
  property?.binding?.removeTarget(node, name)
}
export function dispose(node: Node | IoElement) {
  debug: if (node._disposed) {
    console.warn('Node.dispose(): Already disposed!', node.constructor.name)
  }

  if (node._disposed) return

  node._bindings.forEach((binding, name) => {
    binding.dispose()
    node._bindings.delete(name)
  })
  delete (node as any)._bindings

  // Remove window mutation listener if attached
  if (node._hasWindowMutationListener) {
    window.removeEventListener('io-object-mutation', node.onPropertyMutated as unknown as EventListener)
    node._hasWindowMutationListener = false
  }
  delete (node as any)._protochain

  node._changeQueue.dispose()
  delete (node as any)._changeQueue

  // Stop observing all properties and cleanup
  const removedIoValues: Node[] = []
  node._reactiveProperties.forEach((property, name) => {
    property.binding?.removeTarget(node, name)
    if (property.observer.observing && property.observer.type === 'io') {
      if (isIoObject(property.value) && !removedIoValues.includes(property.value) && !property.value._disposed) {
        property.value.removeEventListener('io-object-mutation', node.onPropertyMutated)
        removedIoValues.push(property.value)
      }
    }
    property.observer.observing = false
  })

  for (const name in node._protochain.properties) {
    delete (node as Node)[name as keyof Node]
  }

  // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
  node._eventDispatcher.dispose()
  delete (node as any)._eventDispatcher
  delete (node as any)._reactiveProperties

  if ((node as any)._parents) {
    (node as any)._parents.length = 0
    delete (node as any)._parents
  }

  Object.defineProperty(node, '_disposed', {value: true})
};