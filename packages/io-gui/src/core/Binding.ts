import { ChangeEvent } from './ChangeQueue';
import { Node } from '../nodes/Node';

type Properties = string[];
type TargetProperties = WeakMap<Node, Properties>;

// This helper checks if both values are NaN to prevent infinite update loops.
const bothAreNaNs = function(value: any, oldValue: any) {
  return typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue);
};

/**
 * Property binding class that enables two-way data synchronization between `Node` and `IoElement` nodes.
 *
 * It manages bindings between a source node's property and one or more target nodes and properties.
 * Using a hub-and-spoke pub/sub event system, it maintains data consistency by automatically propagating
 * changes to all bound nodes and properties.
 *
 * Key features:
 * - Listens for `[propName]-changed` events to detect changes
 * - Sets properties using `node.setProperty(propName, value)` method
 * - Supports one-to-many property bindings
 * - Prevents circular update loops
 * - Automatically cleans up listeners when disposed
 *
 * Note: `debug: {}` code blocks are used in dev/debug builds for sanity checks.
 * They print error messages if unexpected state is detected.
 * In theory, they should never be reached.
 *
 * @example
 * // Create a two-way binding between nodeA.value and nodeB.value
 * const binding = new Binding(nodeA, 'value');
 * binding.addTarget(nodeB, 'value');
 */
export class Binding {
  readonly node: Node;
  readonly property: string = '';
  readonly targets: Node[] = [];
  readonly targetProperties: TargetProperties = new WeakMap();
  /**
   * Creates a binding object for specified source `node` and `property`.
   * It attaches a `[propName]-changed` listener to the source node.
   * @param {Node} node - Source node
   * @param {string} property - Name of the sourceproperty
   */
  constructor(node: Node, property: string) {
    this.node = node;
    this.property = property;
    this.onSourceChanged = this.onSourceChanged.bind(this);
    this.onTargetChanged = this.onTargetChanged.bind(this);
    this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged);
  }
  set value(value) {
    this.node[this.property] = value;
  }
  get value() {
    return this.node[this.property];
  }
  /**
   * Returns a JSON representation of the binding.
   * This is required for `JSON.stringify(protoProperties)` in `ProtoChain` to work more accurately.
   * NOTE: this does not provide completely accurate signiture of the binding but it's good enough.
   * @return {string} JSON representation of the binding.
   */
  toJSON() {
    const targetProperties: Record<string, Properties> = {};
    for (let i = 0; i < this.targets.length; i++) {
      const target = this.targets[i];
      const props = this.getTargetProperties(target);
      targetProperties[target.constructor.name] = props;
    }
    return {
      node: this.node.constructor.name,
      property: this.property,
      targets: this.targets.map(t => t.constructor.name),
      targetProperties: targetProperties,
    };
  }
  /**
   * Helper function to get target properties from WeakMap
   * Retrieves a list of target properties for specified target node.
   * @param {Node} target - Target node.
   * @return {Properties} list of target property names.
   */
  getTargetProperties(target: Node): Properties {
    if (!this.targetProperties.has(target)) this.targetProperties.set(target, []);
    return this.targetProperties.get(target)!;
  }
  /**
   * Adds a target node and property.
   * Sets itself as the binding reference on the target `PropertyInstance`.
   * Adds a `[propName]-changed` listener to the target node.
   * @param {Node} target - Target node
   * @param {string} property - Target property
   */
  addTarget(target: Node, property: string) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);

    const targetProperties = this.getTargetProperties(target);

    if (targetProperties.indexOf(property) === -1) {
      targetProperties.push(property);

      const propertyInstance = target._properties.get(property)!;
      if (propertyInstance.binding && propertyInstance.binding !== this) {
        debug: {
          console.warn('Binding: improper usage detected!');
          console.info('Binding: target property is already a target of another binding. Undinding previous binding!');
        }
        propertyInstance.binding.removeTarget(target, property);
      }
      propertyInstance.binding = this;
      target.addEventListener(`${property}-changed`, this.onTargetChanged);
      target.setProperty(property, this.node[this.property], true);

    } else debug: {

      console.error('Binding: target property already added!');

    }
  }
  /**
   * Removes target node and property.
   * If `property` is not specified, it removes all target properties.
   * Removes binding reference from the target `PropertyInstance`.
   * Removes `[propName]-changed` listener from the target node.
   * @param {Node} target - Target node
   * @param {string} property - Target property
   */
  removeTarget(target: Node, property?: string) {
    const targetProperties = this.getTargetProperties(target);

    if (property) {

      const i = targetProperties.indexOf(property);
      debug: if (i === -1) {
        console.error('Binding: target property not found!');
      }
      targetProperties.splice(i, 1);

      const propertyInstance = target._properties.get(property)!;
      debug: if (propertyInstance.binding !== this) {
        console.error('Binding: target property has a different binding!');
      }
      propertyInstance.binding = undefined;
      target.removeEventListener(`${property}-changed`, this.onTargetChanged);

    } else {

      for (let i = targetProperties.length; i--;) {
        const prop = targetProperties[i];
        const propertyInstance = target._properties.get(prop)!;
        debug: if (propertyInstance.binding !== this) {
          console.error('Binding: target property has a different binding!');
        }
        propertyInstance.binding = undefined;
        target.removeEventListener(`${prop}-changed`, this.onTargetChanged);
      }
      targetProperties.length = 0;

    }

    if (targetProperties.length === 0) this.targets.splice(this.targets.indexOf(target), 1);
  }
  /**
   * Event handler that updates source property when one of the targets emits `[propName]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
  onTargetChanged(event: ChangeEvent){
    debug: if (this.targets.indexOf(event.target) === -1) {
      console.error('onTargetChanged() should never fire if target is not accounted for');
    }
    const oldValue = this.node[this.property];
    const value = event.detail.value;
    if (oldValue !== value) {
      if (bothAreNaNs(value, oldValue)) return;
      this.node.setProperty(this.property, value);
    }
  };
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[propName]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
  onSourceChanged(event: ChangeEvent) {
    debug: if (event.target !== this.node) {
      console.error('onSourceChanged() should always originate form source node.');
    }
    const value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      const target = this.targets[i];
      const targetProperties = this.getTargetProperties(target);
      for (let j = targetProperties.length; j--;) {
        const propName = targetProperties[j];
        const oldValue = target[propName];
        if (oldValue !== value) {
          if (bothAreNaNs(value, oldValue)) continue;
          target.setProperty(propName, value);
        }
      }
    }
  };
  /**
   * Dispose of the binding by removing all targets and listeners.
   * Use this when node is no longer needed.
   */
  dispose() {
    this.node.removeEventListener(`${this.property}-changed`, this.onSourceChanged);
    for (let i = this.targets.length; i--;) {
      this.removeTarget(this.targets[i]);
    }
    this.targets.length = 0;
    delete (this as any).node;
    delete (this as any).property;
    delete (this as any).targets;
    delete (this as any).targetProperties;
  }
}
