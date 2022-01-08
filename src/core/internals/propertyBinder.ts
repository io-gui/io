import {ChangeEvent} from './changeQueue.js';
import {Properties} from './property.js';
import {IoNode} from '../io-node.js';

/**
 * Property binding class.
 * It manages data binding with target nodes/properties using `[property]-changed` events.
 */
export class Binding {
  public readonly node: IoNode;
  public readonly property: string = '';
  public readonly targets: Array<EventTarget> = [];
  public readonly targetProperties: WeakMap<EventTarget, string[]> = new WeakMap();
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
   * @param {Array.<string>} [_nodeProperties] - Properties object.
   */
  addTarget(node: IoNode, property: string, _nodeProperties?: Properties) {
    // TODO: unhack passing _properties from constructor;
    const nodeProperties = node._properties || _nodeProperties;
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
  private readonly _node: IoNode;
  private readonly _bindings: Record<string, Binding> = {};
  /**
   * Creates binding manager for the specified node.
   * @param {IoNode} node - Owner node.
   */
  constructor(node: IoNode) {
    this._node = node;
    Object.defineProperty(this, '_node',     {enumerable: false, writable: false});
    Object.defineProperty(this, '_bindings', {enumerable: false, writable: false});
  }
  /**
   * Returns a binding to the specified property name or creates one if it does not exist.
   * @param {string} property - Property to bind.
   * @return {Binding} Property binding object.
   */
  bind(property: string): Binding {
    this._bindings[property] = this._bindings[property] || new Binding(this._node, property);
    return this._bindings[property];
  }
  /**
   * Removes a binding for the specified property name.
   * @param {string} property - Property to unbind.
   */
  unbind(property: string): void {
    if (this._bindings[property]) this._bindings[property].dispose();
    delete this._bindings[property];
  }
  /**
   * Disposes all bindings. Use this when node is no longer needed.
   */
  dispose(): void {
    for (const property in this._bindings) {
      this._bindings[property].dispose();
      delete this._bindings[property];
    }
    delete (this as any)._node;
    delete (this as any)._bindings;
  }
}
