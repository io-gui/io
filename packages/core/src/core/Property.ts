import { Binding } from './Binding.js'
import { isReactiveNode, type ReactiveNode } from './ReactiveCore.js'
import { AnyConstructor } from '../nodes/ReactiveObject.js'
import { NodeArray } from '../core/NodeArray.js'

export type PropertyDefinition= {
  value?: unknown
  type?: AnyConstructor
  binding?: Binding<unknown>
  reflect?: boolean
  init?: unknown
}

export type PropertyDefinitionLoose = string | number | boolean | unknown[] | null | undefined | AnyConstructor | Binding<unknown> | PropertyDefinition

/** Normalized reactive property definition merged from decorators and static getters. */
export class ProtoProperty {
  declare value?: unknown
  declare type?: AnyConstructor
  declare binding?: Binding<unknown>
  declare reflect?: boolean
  declare init?: unknown
  /**
   * Creates a property definition from various input types.
   * @param {PropertyDefinitionLoose} def Input definition which can be:
   * - `undefined` or `null`: Sets as value
   * - `AnyConstructor`: Sets as type
   * - `Binding`: Sets value from binding and stores binding reference
   * - `PropertyDefinition`: Copies all defined fields
   * - Other values: Sets as value
   * @example
   * new ProtoProperty(String) // {type: String}
   * new ProtoProperty('hello') // {value: 'hello'}
   * new ProtoProperty({value: 42, type: Number}) // {value: 42, type: Number}
   * new ProtoProperty(new Binding(node, 'value')) // {value: node.value, binding: ...}
   */
  constructor(def: PropertyDefinitionLoose) {
    if (def === undefined || def === null) {
      this.value = def
    } else if (typeof def === 'function') {
      this.type = def as AnyConstructor
    } else if (def instanceof Binding) {
      this.value = def.value
      this.binding = def
    } else if (def && def.constructor === Object) {
      const d = def as PropertyDefinition
      if (Object.hasOwn(d, 'value')) this.value = d.value
      if (Object.hasOwn(d, 'type')) this.type = d.type
      if (d.binding instanceof Binding) {
        this.binding = d.binding
        this.value = this.binding.value
      }
      if (Object.hasOwn(d, 'reflect')) this.reflect = d.reflect
      if (Object.hasOwn(d, 'init')) this.init = d.init
    } else if (!(def && def.constructor === Object)) {
      this.value = def
    }
  }
  /**
   * Assigns values of another ProtoProperty to itself, unless they are default values.
   * @param {ProtoProperty} protoProp Source ProtoProperty
   */
  assign(protoProp: ProtoProperty) {
    if (Object.hasOwn(protoProp, 'value')) this.value = protoProp.value
    if (Object.hasOwn(protoProp, 'type')) this.type = protoProp.type
    if (Object.hasOwn(protoProp, 'reflect')) this.reflect = protoProp.reflect
    if (Object.hasOwn(protoProp, 'init')) this.init = protoProp.init
    if (Object.hasOwn(protoProp, 'binding')) this.binding = protoProp.binding
  }
  /**
   * Creates a serializable representation of the property definition.
   * Handles special cases for better JSON serialization:
   * - Converts object values to their constructor names
   * - Converts function types to their names
   * - Only includes defined fields
   * @returns {object} A plain object suitable for JSON serialization
   */
  toJSON() {
    const json: {
      value?: unknown
      type?: AnyConstructor | string
      reflect?: boolean
      init?: unknown
      binding?: Binding<unknown>
    } = {
      value: this.value,
      type: this.type,
      reflect: this.reflect,
      init: this.init,
      binding: this.binding,
    }
    if (json.value && typeof json.value === 'object') {
      json.value = (json.value as object).constructor.name
    }
    if (json.type && typeof json.type === 'function') {
      json.type = json.type.name
    }
    return json
  }
}

function decodeInitArgument(item: unknown, node: ReactiveNode): unknown {
  if (item === 'this') {
    return node
  } else if (typeof item === 'string' && item.startsWith('this.')) {
    const keys = item.split('.')
    let target: unknown = node
    for (let i = 1; i < keys.length; i++) {
      if (typeof target === 'object' && target !== null) {
        target = (target as Record<string, unknown>)[keys[i]]
      } else {
        target = undefined
        break
      }
    }
    if (target) return target
    console.error(`PropertyInstance: Invalid path ${item}`)
  } else return item
}

export type ObservationType = 'none' | 'io' | 'object' | 'nodearray'

type MutationListenerNode = ReactiveNode & {
  _hasWindowMutationListener?: boolean
  _hasSelfMutationListener?: boolean
}

export function ensureWindowMutationListener(node: ReactiveNode) {
  const target = node as MutationListenerNode
  if (target._hasWindowMutationListener) return
  target._hasWindowMutationListener = true
  window.addEventListener('io-mutation', node.onPropertyMutated as unknown as EventListener)
}

export function removeWindowMutationListener(node: ReactiveNode) {
  const target = node as MutationListenerNode
  if (!target._hasWindowMutationListener) return
  target._hasWindowMutationListener = false
  window.removeEventListener('io-mutation', node.onPropertyMutated as unknown as EventListener)
}

export function ensureSelfMutationListener(node: ReactiveNode) {
  const target = node as MutationListenerNode
  if (target._hasSelfMutationListener) return
  target._hasSelfMutationListener = true
  node.addEventListener('io-mutation', node.onPropertyMutated)
}

export function removeSelfMutationListener(node: ReactiveNode) {
  const target = node as MutationListenerNode
  if (!target._hasSelfMutationListener) return
  target._hasSelfMutationListener = false
  node.removeEventListener('io-mutation', node.onPropertyMutated)
}

/**
 * Tracks mutation observation mode and listener wiring for one reactive property.
 * @see ObservationType
 */
export class Observer {
  declare private readonly node: ReactiveNode
  type: ObservationType = 'none'
  observing = false

  constructor(node: ReactiveNode) {
    Object.defineProperty(this, 'node', {enumerable: false, configurable: false, writable: false, value: node})
  }

  start(value: unknown) {
    if (this.observing) return
    if (!value || typeof value !== 'object') return

    if (isReactiveNode(value)) {
      this.type = 'io'
      this.observing = true
      value.addEventListener('io-mutation', this.node.onPropertyMutated)
    } else if (value instanceof NodeArray) {
      this.type = 'nodearray'
      this.observing = true
      value.addObserver(this.node)
      ensureSelfMutationListener(this.node)
    } else {
      this.type = 'object'
      this.observing = true
      ensureWindowMutationListener(this.node)
    }
  }

  stop(value: unknown) {
    if (isReactiveNode(value) && !value._disposed) {
      value.removeEventListener('io-mutation', this.node.onPropertyMutated)
    } else if (value instanceof NodeArray) {
      value.removeObserver(this.node)
    }
    this.observing = false
  }

  dispose() {}
}

/** Runtime reactive property: value, type, binding, reflect, and mutation observer. */
export class PropertyInstance {
  // Field value.
  value?: unknown
  // Constructor of the property value.
  type?: AnyConstructor
  // Binding object.
  binding?: Binding<unknown>
  // Reflects to HTML attribute.
  reflect = false
  // Initialize property with provided constructor arguments. `null` prevents initialization.
  init?: unknown = undefined
  // Mutation observation state for this property.
  readonly observer: Observer
  /**
   * Creates the property configuration object and copies values from `ProtoProperty`.
   * @param node owner ReactiveObject instance
   * @param propDef ProtoProperty object
   */
  constructor(node: ReactiveNode, propDef: ProtoProperty) {
    debug: {
      Object.keys(propDef).forEach(key => {
        if (['value', 'type', 'reflect', 'init', 'binding'].indexOf(key) === -1) {
          console.warn(`ProtoProperty: Invalid field ${key}`)
        }
      })
      if (propDef.type !== undefined) {
        if (typeof propDef.type !== 'function') console.warn('Incorrect type for "type" field')
      }
      if (propDef.type === NodeArray && propDef.init !== 'this') {
        console.warn('NodeArray property should be initialized with "this"')
      }
      if (propDef.binding !== undefined && propDef.binding.constructor !== Binding) console.warn('Incorrect type for "binding" field')
      if (propDef.reflect !== undefined && typeof propDef.reflect !== 'boolean') console.error(`Invalid reflect field ${propDef.reflect}!`)
    }

    this.value = propDef.value
    this.type = propDef.type
    this.binding = propDef.binding
    if (typeof propDef.reflect === 'boolean') this.reflect = propDef.reflect
    if (propDef.init !== undefined) this.init = propDef.init

    if (this.binding instanceof Binding) {
      this.value = this.binding.value
    } else if (this.value === undefined) {
      if (this.type === Boolean) this.value = false
      else if (this.type === String) this.value = ''
      else if (this.type === Number) this.value = 0
      else if (typeof this.type === 'function') {
        if (this.init !== undefined) {
          if (this.init instanceof Array) {
            const args = this.init.map(item => decodeInitArgument(item, node))
            this.value = new (this.type as new (...args: unknown[]) => object)(...args)
          } else if (this.init instanceof Object) {
            const initObj = this.init as Record<string, unknown>
            const args: Record<string, unknown> = {}
            Object.keys(initObj).forEach(key => {
              args[key] = decodeInitArgument(initObj[key], node)
            })
            this.value = new (this.type as new (args: Record<string, unknown>) => object)(args)
          } else if (this.init === null) {
            this.value = new (this.type as new () => object)()
          } else {
            const argument = decodeInitArgument(this.init, node)
            this.value = new (this.type as new (arg: unknown) => object)(argument)
          }
        }
      }
    }

    this.observer = new Observer(node)
    this.observer.start(this.value)

    debug: {
      if (this.value !== undefined && this.init !== undefined) {
        if (this.type === String || this.type === Number || this.type === Boolean) {
          if (this.type === Boolean && typeof this.value !== 'boolean' ||
              this.type === Number && typeof this.value !== 'number' ||
              this.type === String && typeof this.value !== 'string') {
            console.warn(`Field: Uninitialized value for type "${this.type.name}"!`)
          }
        } else {
          if (typeof this.type === 'function' && !(this.value instanceof this.type)) {
            console.warn(`Field: Incorrect value "${this.value}" for type "${this.type.name}"!`)
          }
        }
      }
    }
  }
}