import {ChangeEvent} from './changeQueue.js';
import {Properties} from './properties.js';
import {IoNode} from '../io-node.js';

/**
 * Binding object. It manages data binding between source and targets using `[property]-changed` events.
 */
export class Binding {
  private readonly node: IoNode;
  private readonly property: string = '';
  private readonly targets: Array<EventTarget> = [];
  private readonly targetProperties: WeakMap<EventTarget, string[]> = new WeakMap();
  /**
   * Creates a binding object for specified `node` and `property`.
   * @param {IoNode} node - Property owner node.
   * @param {string} property - Name of the property.
   */
  constructor(node: IoNode, property: string) {
    this.node = node;
    this.property = property;
    this.onTargetChanged = this.onTargetChanged.bind(this);
    this.onSourceChanged = this.onSourceChanged.bind(this);
    Object.defineProperty(this, 'node',             {enumerable: false, writable: false});
    Object.defineProperty(this, 'property',         {enumerable: false, writable: false});
    Object.defineProperty(this, 'targets',          {enumerable: false, writable: false});
    Object.defineProperty(this, 'targetProperties', {enumerable: false, writable: false});
    Object.defineProperty(this, 'onTargetChanged', {enumerable: false, writable: false});
    Object.defineProperty(this, 'onSourceChanged', {enumerable: false, writable: false});
    this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged as EventListener);
  }
  set value(value) {
    this.node[this.property] = value;
  }
  get value() {
    return this.node[this.property];
  }
  /**
   * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
   * @param {IoNode} node - Target node.
   * @param {string} property - Target property.
   * @param {Array.<string>} __nodeProperties - List of target property names.
   */
  addTarget(node: IoNode, property: string, __nodeProperties?: Properties) {
    // TODO: unhack passing __properties from constructor;
    const nodeProperties = node.__properties || __nodeProperties;
    nodeProperties.setBinding(property, this);
    nodeProperties.setValue(property, this.node[this.property]);

    const targetIoNode = node as unknown as EventTarget;
    if (this.targets.indexOf(targetIoNode) === -1) this.targets.push(targetIoNode);
    const targetProperties = this.getTargetProperties(targetIoNode);
    if (targetProperties.indexOf(property) === -1) {
      targetProperties.push(property);
      targetIoNode.addEventListener(`${property}-changed`, this.onTargetChanged as EventListener);
    }
  }
  /**
   * Removes target `node` and `property` and corresponding `[property]-changed` listener.
   * If `property` is not specified, it removes all target properties.
   * @param {IoNode} node - Target node.
   * @param {string} property - Target property.
   */
  removeTarget(node: IoNode, property?: string) {
    const targetIoNode = node as unknown as EventTarget;
    const targetProperties = this.getTargetProperties(targetIoNode);
    if (property) {
      const i = targetProperties.indexOf(property);
      if (i !== -1) targetProperties.splice(i, 1);
      targetIoNode.removeEventListener(`${property}-changed`, this.onTargetChanged as EventListener);
    } else {
      for (let i = targetProperties.length; i--;) {
        targetIoNode.removeEventListener(`${targetProperties[i]}-changed`, this.onTargetChanged as EventListener);
      }
      targetProperties.length = 0;
    }
    if (targetProperties.length === 0) this.targets.splice(this.targets.indexOf(targetIoNode), 1);
  }
  /**
   * Retrieves a list of target properties for specified target node.
   * @param {IoNode} node - Target node.
   * @return {Array.<string>} list of target property names.
   */
   private getTargetProperties(node: IoNode | EventTarget): string[] {
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
  private onTargetChanged(event: ChangeEvent) {
    debug: {
      if (this.targets.indexOf(event.target) === -1) {
        console.error(`onTargetChanged() should never fire when target is removed from binding.
          Please file an issue at https://github.com/arodic/iogui/issues.`); return;
      }
    }
    const oldValue = this.node[this.property];
    const value = event.detail.value;
    if (oldValue !== value) {
      // JavaScript is weird NaN != NaN
      if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) return;
      this.node[this.property] = value;
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
   private onSourceChanged(event: ChangeEvent) {
    debug: {
      if (event.target !== this.node as unknown as EventTarget) {
        console.error(`onSourceChanged() should always originate form source node.
          Please file an issue at https://github.com/arodic/iogui/issues.`); return;
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
          target[propName] = value;
        }
      }
    }
  }
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
    delete (this as any).onTargetChanged;
    delete (this as any).onSourceChanged;
  }
}

/**
 * Manager for property bindings. It holds all bindings for a particular IoNode.
 */
export class PropertyBinder {
  private readonly node: IoNode;
  private readonly __bindings: Record<string, Binding> = {};
  /**
   * Creates binding manager for the specified node.
   * @param {IoNode} node - Owner node.
   */
  constructor(node: IoNode) {
    this.node = node;
    Object.defineProperty(this, 'node',     {enumerable: false, writable: false});
    Object.defineProperty(this, '__bindings', {enumerable: false, writable: false});
  }
  /**
   * Returns a binding to the specified property name or creates one if it does not exist.
   * @param {string} property - Property to bind.
   * @return {Binding} Property binding object.
   */
  bind(property: string): Binding {
    this.__bindings[property] = this.__bindings[property] || new Binding(this.node, property);
    return this.__bindings[property];
  }
  /**
   * Removes a binding for the specified property name.
   * @param {string} property - Property to unbind.
   */
  unbind(property: string): void {
    if (this.__bindings[property]) this.__bindings[property].dispose();
    delete this.__bindings[property];
  }
  /**
   * Disposes all bindings. Use this when node is no longer needed.
   */
  dispose(): void {
    for (const property in this.__bindings) {
      this.__bindings[property].dispose();
      delete this.__bindings[property];
    }
    delete (this as any).node;
    delete (this as any).__bindings;
  }
}
