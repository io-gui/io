import {Node} from '../node.js';
import {ChangeEvent} from './changeQueue.js';
import {Properties} from '../properties.js';

/**
 * Binding object. It manages data binding between source and targets using `[property]-changed` events.
 */
export class Binding {
  private __node: Node;
  private __property: string = '';
  private __targets: Array<EventTarget> = [];
  private __targetProperties: WeakMap<EventTarget, string[]> = new WeakMap();
  /**
   * Creates a binding object for specified `node` and `property`.
   */
  constructor(node: Node, property: string) {
    this.__node = node;
    this.__property = property;
    Object.defineProperty(this, '__node',             {enumerable: false});
    Object.defineProperty(this, '__property',         {enumerable: false});
    Object.defineProperty(this, '__targets',          {enumerable: false});
    Object.defineProperty(this, '__targetProperties', {enumerable: false});
    this._onTargetChanged = this._onTargetChanged.bind(this);
    this._onSourceChanged = this._onSourceChanged.bind(this);
    this.__node.addEventListener(`${this.__property}-changed`, this._onSourceChanged);
  }
  set value(value) {
    this.__node[this.__property] = value;
  }
  get value() {
    return this.__node[this.__property];
  }
  /**
   * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
   * @param {Node} node - Target node.
   * @param {string} property - Target property.
   */
  addTarget(node: Node, property: string, __nodeProperties?: Properties) {
    // TODO: unhack passing __properties from constructor;
    const nodeProperties = node.__properties || __nodeProperties;
    nodeProperties[property].binding = this;
    nodeProperties.set(property, this.__node[this.__property]);

    const targetNode = node as unknown as EventTarget;
    if (this.__targets.indexOf(targetNode) === -1) this.__targets.push(targetNode);
    const targetProperties = this._getTargetProperties(targetNode);
    if (targetProperties.indexOf(property) === -1) {
      targetProperties.push(property);
      targetNode.addEventListener(`${property}-changed`, this._onTargetChanged as EventListener);
    }
  }
  /**
   * Removes target `node` and `property` and corresponding `[property]-changed` listener.
   * If `property` is not specified, it removes all target properties.
   * @param {Node} node - Target node.
   * @param {string} property - Target property.
   */
  removeTarget(node: Node, property?: string) {
    const targetNode = node as unknown as EventTarget;
    const targetProperties = this._getTargetProperties(targetNode);
    if (property) {
      const i = targetProperties.indexOf(property);
      if (i !== -1) targetProperties.splice(i, 1);
      targetNode.removeEventListener(`${property}-changed`, this._onTargetChanged as EventListener);
    } else {
      for (let i = targetProperties.length; i--;) {
        targetNode.removeEventListener(`${targetProperties[i]}-changed`, this._onTargetChanged as EventListener);
      }
      targetProperties.length = 0;
    }
    if (targetProperties.length === 0) this.__targets.splice(this.__targets.indexOf(targetNode), 1);
  }
  /**
   * Retrieves a list of target properties for specified target node.
   * @param {Node} node - Target node.
   */
   private _getTargetProperties(node: Node | EventTarget): string[] {
    let targetProperties = this.__targetProperties.get(node as unknown as EventTarget);
    if (targetProperties) {
      return targetProperties;
    } else {
      targetProperties = [];
      this.__targetProperties.set(node as unknown as EventTarget, targetProperties);
      return targetProperties;
    }
  }
  /**
   * Event handler that updates source property when one of the targets emits `[property]-changed` event.
   * @param {event} ChangeEvent - Property change event.
   */
  private _onTargetChanged(event: ChangeEvent) {
    debug: {
      if (this.__targets.indexOf(event.target) === -1) {
        console.error(`_onTargetChanged() should never fire when target is removed from binding.
          Please file an issue at https://github.com/arodic/iogui/issues.`); return;
      }
    }
    const oldValue = this.__node[this.__property];
    const value = event.detail.value;
    if (oldValue !== value) {
      // JavaScript is weird NaN != NaN
      if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) return;
      this.__node[this.__property] = value;
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
   * @param {event} ChangeEvent - Property change event.
   */
   private _onSourceChanged(event: ChangeEvent) {
    debug: {
      if (event.target != this.__node as unknown as EventTarget) {
        console.error(`_onSourceChanged() should always originate form source node.
          Please file an issue at https://github.com/arodic/iogui/issues.`); return;
      }
    }
    const value = event.detail.value;
    for (let i = this.__targets.length; i--;) {
      const target = this.__targets[i];
      const targetProperties = this._getTargetProperties(target);
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
    this.__node.removeEventListener(`${this.__property}-changed`, this._onSourceChanged);
    for (let i = this.__targets.length; i--;) {
      this.removeTarget(this.__targets[i] as unknown as Node);
    }
    this.__targets.length = 0;
    delete (this as any).__node;
    delete (this as any).__property;
    delete (this as any).__targets;
    delete (this as any).__targetProperties;
    delete (this as any)._onTargetChanged;
    delete (this as any)._onSourceChanged;
  }
}

/**
 * Manager for property bindings. It holds all bindings for a particular Node.
 */
export class BindingManager {
  __node: Node;
  __bindings: Record<string, Binding> = {};
  /**
   * Creates binding manager with a node reference.
   * @param {Node} node - Owner node.
   */
  constructor(node: Node) {
    this.__node = node;
    Object.defineProperty(this, '__node', {enumerable: false});
  }
  /**
   * Returns a binding to the specified property name or creates one if it does not exist.
   * @param {string} property - Property to bind.
   */
  bind(property: string): Binding {
    this.__bindings[property] = this.__bindings[property] || new Binding(this.__node, property);
    return this.__bindings[property];
  }
  /**
   * Disposes a binding for the specified property name.
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
    for (let property in this.__bindings) {
      this.__bindings[property].dispose();
      delete this.__bindings[property];
    }
    delete (this as any).__node;
    delete (this as any).__bindings;
  }
}
