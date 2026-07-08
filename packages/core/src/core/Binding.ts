import { ChangeEvent } from './ChangeQueue.js'
import { ReactiveObject } from '../nodes/ReactiveObject.js'
import { ReactiveElement } from '../elements/ReactiveElement.js'
import { ReactiveNode } from './ReactiveCore.js'

// TODO: Improve types!
type Fields = string[]
type TargetProperties = WeakMap<ReactiveNode, Fields>

// This helper checks if both values are NaN because NaN === NaN is false.
const bothAreNaNs = function(value: unknown, oldValue: unknown) {
  return typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)
}

const isTypeCompatible = (type1: unknown, type2: unknown) => {
  // Handle primitive types
  if (type1 === type2) return true
  // Handle class inheritance
  if (typeof type1 === 'function' && typeof type2 === 'function') {
    return type1.prototype instanceof type2 || type2.prototype instanceof type1
  }
  return false
}
/**
 * Hub-and-spoke two-way sync between reactive properties via `[propName]-changed` events.
 * @example binding.addTarget(nodeB, 'value')
 */
export class Binding<T = unknown> {
  readonly node: ReactiveNode
  readonly property: string
  readonly targets: Set<ReactiveNode> = new Set()
  readonly targetProperties: TargetProperties = new WeakMap()
  constructor(node: ReactiveNode, property: string) {
    debug: {
      if (!(node as ReactiveObject)._isReactiveObject && !(node as ReactiveElement)._isReactiveElement) console.warn('Source node is not a ReactiveObject or ReactiveElement instance!')
      if (!node._properties.has(property)) console.warn(`Source node does not have a reactive property "${property}"!`)
    }
    this.node = node
    this.property = property
    this.onSourceChanged = this.onSourceChanged.bind(this)
    this.onTargetChanged = this.onTargetChanged.bind(this)
    this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged)
  }
  set value(value: T) {
    this.node.setProperty(this.property, value)
  }
  get value(): T {
    return this.node._properties.get(this.property)!.value as T
  }
  /**
   * Adds a target node and property.
   * Sets itself as the binding reference on the target `PropertyInstance`.
   * Adds a `[propName]-changed` listener to the target node.
   * @param {ReactiveNode} target - Target node
   * @param {string} property - Target property
   */
  addTarget(target: ReactiveNode, property: string) {
    const targetProps = this.getTargetProperties(target)

    debug: {
      if (!(target as ReactiveObject)._isReactiveObject && !(target as ReactiveElement)._isReactiveElement) console.warn('Target node is not a ReactiveObject or ReactiveElement instance!')
      if (!target._properties.has(property)) console.warn(`Target node does not have a reactive property "${property}"!`)
      if (targetProps.indexOf(property) !== -1) console.error(`Target property "${property}" already added!`)
    }

    if (!this.targets.has(target)) this.targets.add(target)
    if (targetProps.indexOf(property) === -1) {
      targetProps.push(property)

      const targetP = target._properties.get(property)!
      if (targetP.binding && targetP.binding !== this) {
        debug: {
          console.warn('Improper usage detected!')
          console.info('Target property is already a target of another binding. Undinding previous binding!')
        }
        targetP.binding.removeTarget(target, property)
      }
      targetP.binding = this

      debug: {
        const srcP = this.node._properties.get(this.property)!
        const valueMismatch = srcP.value !== undefined && targetP.value !== undefined && typeof srcP.value !== typeof targetP.value
        const typeMismatch = srcP.type !== undefined && targetP.type !== undefined && !isTypeCompatible(srcP.type, targetP.type)
        if (valueMismatch || typeMismatch) {
          console.warn(`Source property "${this.property}" does not match type of target property "${property}"!`)
          console.info(`Source "${this.property}" value: ${srcP.value} type: ${srcP.type} typeof: ${typeof srcP.value}`)
          console.info(`Target "${property}" value: ${targetP.value} type: ${targetP.type} typeof: ${typeof targetP.value}`)
        }
      }

      target.addEventListener(`${property}-changed`, this.onTargetChanged)
      target.setProperty(property, this.value, true)
    }
  }
  /**
   * Removes target node and property.
   * If `property` is not specified, it removes all target properties.
   * Removes binding reference from the target `PropertyInstance`.
   * Removes `[propName]-changed` listener from the target node.
   * @param {ReactiveNode} target - Target node
   * @param {string} property - Target property
   */
  removeTarget(target: ReactiveNode, property?: string) {
    const targetProperties = this.getTargetProperties(target)

    if (property) {

      const i = targetProperties.indexOf(property)
      debug: if (i === -1) {
        console.error('Target property not found!')
      }
      targetProperties.splice(i, 1)

      const propertyInstance = target._properties.get(property)!
      debug: if (propertyInstance.binding !== this) {
        console.error('Target property has a different binding!')
      }
      propertyInstance.binding = undefined
      target.removeEventListener(`${property}-changed`, this.onTargetChanged)

    } else {

      for (let i = targetProperties.length; i--;) {
        const prop = targetProperties[i]
        const propertyInstance = target._properties.get(prop)!
        debug: if (propertyInstance.binding !== this) {
          console.error('Target property has a different binding!')
        }
        propertyInstance.binding = undefined
        target.removeEventListener(`${prop}-changed`, this.onTargetChanged)
      }
      targetProperties.length = 0

    }

    if (targetProperties.length === 0) this.targets.delete(target)
  }
  /**
   * Event handler that updates source property when one of the targets emits `[propName]-changed` event.
   * @param {ChangeEvent} event - Field change event.
   */
  onTargetChanged(event: ChangeEvent){
    debug: if (!this.targets.has(event.target as ReactiveNode)) {
      console.error('onTargetChanged() should never fire if target is not accounted for!')
    }
    const oldValue = this.value
    const value = event.detail.value
    if (oldValue !== value) {
      if (bothAreNaNs(value, oldValue)) return
      this.node.setProperty(this.property, value)
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[propName]-changed` event.
   * @param {ChangeEvent} event - Field change event.
   */
  onSourceChanged(event: ChangeEvent) {
    debug: if (event.target !== this.node) {
      console.error('onSourceChanged() should always originate form source node!')
    }
    const value = event.detail.value
    for (const target of this.targets) {
      const targetProperties = this.getTargetProperties(target)
      for (let j = targetProperties.length; j--;) {
        const propName = targetProperties[j]
        const oldValue = target._properties.get(propName)!.value
        if (oldValue !== value) {
          if (bothAreNaNs(value, oldValue)) continue
          target.setProperty(propName, value)
        }
      }
    }
  }
  /**
   * Returns a list of target properties for specified target node.
   * @param {ReactiveNode} target - Target node.
   * @return {Fields} list of target property names.
   */
  getTargetProperties(target: ReactiveNode): Fields {
    if (!this.targetProperties.has(target)) this.targetProperties.set(target, [])
    return this.targetProperties.get(target)!
  }
  /**
   * Returns a JSON representation of the binding.
   * This is required for `JSON.stringify(protoProperties)` in `ProtoChain`.
   * @return {string} JSON representation of the binding.
   */
  toJSON() {
    const targetProperties: Fields[] = []
    const targetNames: string[] = []
    for (const target of this.targets) {
      targetNames.push(target.constructor.name)
      targetProperties.push(this.getTargetProperties(target))
    }
    return {
      node: this.node.constructor.name,
      property: this.property,
      targets: targetNames,
      targetProperties: targetProperties,
    }
  }
  /**
   * Disposes the binding and removes all targets and listeners.
   */
  dispose() {
    this.node.removeEventListener(`${this.property}-changed`, this.onSourceChanged)
    for (const target of this.targets) {
      this.removeTarget(target)
    }
    this.targets.clear()
    delete (this as Record<string, unknown>).node
    delete (this as Record<string, unknown>).property
    delete (this as Record<string, unknown>).targets
    delete (this as Record<string, unknown>).targetProperties
  }
}
