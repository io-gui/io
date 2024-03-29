import {ChangeEvent} from './changeQueue.js';
import {IoNode} from '../node.js';

/**
 * Property binding class.
 * It facilitates data binding between source node/property and target nodes/properties
 * using `[property]-changed` events.
 */
export class Binding {
  readonly node: IoNode;
  readonly property: string = '';
  readonly targets: Array<EventTarget> = [];
  readonly targetProperties: WeakMap<EventTarget, string[]> = new WeakMap();
  /**
   * Creates a binding object for specified `node` and `property`.
   * @param {IoNode} node - Property owner node
   * @param {string} property - Name of the property
   */
  constructor(node: IoNode, property: string) {
    this.node = node;
    this.property = property;
    this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged as EventListener);
  }
  set value(value) {
    this.node[this.property] = value;
  }
  get value() {
    return this.node[this.property];
  }
  toJSON() {
    // Custom serialization to avoid serializing nodes.
    return JSON.stringify({
      property: this.property,
      targetProperties: this.targetProperties,
    });
  }
  /**
   * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
   * @param {IoNode} node - Target node
   * @param {string} property - Target property
   */
  addTarget(node: IoNode, property: string) {
    const propertyInstance = node._properties.get(property)!;
    debug: {
      if (propertyInstance.binding && propertyInstance.binding !== this) {
        console.warn('Binding target alredy has a binding!');
      }
    }
    propertyInstance.binding = this;
    node.setProperty(property, this.node[this.property], true);
    const target = node as unknown as EventTarget;
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    const targetProperties = this.getTargetProperties(target);
    if (targetProperties.indexOf(property) === -1) {
      targetProperties.push(property);
      target.addEventListener(`${property}-changed`, this.onTargetChanged as EventListener);
    } else debug: {
      console.warn('Binding target alredy added!');
    }
  }
  /**
   * Removes target `node` and `property` and corresponding `[property]-changed` listener.
   * If `property` is not specified, it removes all target properties.
   * @param {IoNode} node - Target node
   * @param {string} property - Target property
   */
  removeTarget(node: IoNode, property?: string) {
    const targetProperties = this.getTargetProperties(node);
    if (property) {
      const i = targetProperties.indexOf(property);
      if (i !== -1) targetProperties.splice(i, 1);
      node.removeEventListener(`${property}-changed`, this.onTargetChanged as EventListener);
      node._properties.get(property)!.binding = undefined;
    } else {
      for (let i = targetProperties.length; i--;) {
        node.removeEventListener(`${targetProperties[i]}-changed`, this.onTargetChanged as EventListener);
        node._properties.get(targetProperties[i])!.binding = undefined;
      }
      targetProperties.length = 0;
    }
    if (targetProperties.length === 0) this.targets.splice(this.targets.indexOf(node as unknown as EventTarget), 1);
  }
  /**
   * Retrieves a list of target properties for specified target node.
   * @param {IoNode} node - Target node.
   * @return {Array.<string>} list of target property names.
   */
   getTargetProperties(node: IoNode | EventTarget): string[] {
    let targetProperties = this.targetProperties.get(node as unknown as EventTarget);
    if (targetProperties) {
      return targetProperties;
    } else {
      targetProperties = [];
      this.targetProperties.set(node as unknown as EventTarget, targetProperties);
      return targetProperties;
    }
  }
  /**
   * Event handler that updates source property when one of the targets emits `[property]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
  onTargetChanged = (event: ChangeEvent) => {
    debug: {
      if (this.targets.indexOf(event.target) === -1) {
        console.error('onTargetChanged() should never fire when target is removed from binding. Please file an issue at https://github.com/arodic/iogui/issues.'); return;
      }
    }
    const oldValue = this.node[this.property];
    const value = event.detail.value;
    if (oldValue !== value) {
      // JavaScript is weird NaN != NaN
      if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) return;
      // this.node[this.property] = value;
      this.node.setProperty(this.property, value);
    }
  };
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
  onSourceChanged = (event: ChangeEvent) => {
    debug: {
      if (event.target !== this.node as unknown as EventTarget) {
        console.error('onSourceChanged() should always originate form source node. Please file an issue at https://github.com/arodic/iogui/issues.'); return;
      }
    }
    const value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      const target = this.targets[i];
      const targetProperties = this.getTargetProperties(target);
      for (let j = targetProperties.length; j--;) {
        const propName = targetProperties[j] as keyof (typeof target);
        const oldValue = target[propName];
        if (oldValue !== value) {
          // JavaScript is weird NaN != NaN
          if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) continue;
          // target[propName] = value;
          (target as any).setProperty(propName, value);
        }
      }
    }
  };
  /**
   * Dispose of the binding by removing all targets and listeners.
   * Use this when node is no longer needed.
   */
  dispose() {
    this.node.removeEventListener(`${this.property}-changed`, this.onSourceChanged as EventListener);
    for (let i = this.targets.length; i--;) {
      this.removeTarget(this.targets[i] as unknown as IoNode);
    }
    this.targets.length = 0;
    delete (this as any).node;
    delete (this as any).property;
    delete (this as any).targets;
    delete (this as any).targetProperties;
  }
}
