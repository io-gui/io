/** Manager for IoNode bindings. */
export class NodeBindings {
  /**
   * Creates binding manager for IoNode.
   * @param node {IoNode} Reference to the node/element itself.
   */
  constructor(node) {
    Object.defineProperty(this, 'node', {value: node, configurable: true});
  }
  /**
   * Returns a binding to the specified property.
   * @param prop {string} property name.
   */
  get(prop) {
    this[prop] = this[prop] || new Binding(this.node, prop);
    return this[prop];
  }
  /**
   * Disposes all bindings.
   * Use this when node is no longer needed.
   */
  dispose() {
    for (let b in this) {
      this[b].dispose();
      delete this[b];
    }
    delete this.node;
  }
}

/**
 * Binding object. It manages data binding between source and targets using `[prop]-changed` events.
 */
export class Binding {
  /**
   * Creates a binding object with specified `sourceNode` and `sourceProp`.
   * @param sourceNode {IoNode} Source node.
   * @param sourceProp {string} Source property.
   */
  constructor(sourceNode, sourceProp) {
    this.source = sourceNode;
    this.sourceProp = sourceProp;
    this.targets = [];
    this.targetsMap = new WeakMap();
    this.updateSource = this.updateSource.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.source.addEventListener(this.sourceProp + '-changed', this.updateTargets);
  }
  /**
   * Adds a target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.
   * @param targetNode {IoNode} Target node.
   * @param targetProp {string} Target property.
   */
  addTarget(target, targetProp) {
    if (this.targets.indexOf(target) === -1) this.targets.push(target);
    if (this.targetsMap.has(target)) {
      const targetProps = this.targetsMap.get(target);
      if (targetProps.indexOf(targetProp) === -1) {
        targetProps.push(targetProp);
        target.addEventListener(targetProp + '-changed', this.updateSource);
      }
    } else {
      this.targetsMap.set(target, [targetProp]);
      target.addEventListener(targetProp + '-changed', this.updateSource);
    }
  }
  /**
   * Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.
   * If `targetProp` is not specified, it removes all target properties.
   * @param targetNode {IoNode} Target node.
   * @param targetProp {string} Target property.
   */
  removeTarget(targetNode, targetProp) {
    if (this.targetsMap.has(targetNode)) {
      const targetProps = this.targetsMap.get(targetNode);
      if (targetProp) {
        const index = targetProps.indexOf(targetProp);
        if (index !== -1) {
          targetProps.splice(index, 1);
        }
        targetNode.removeEventListener(targetProp + '-changed', this.updateSource);
      } else {
        for (let i = targetProps.length; i--;) {
          targetNode.removeEventListener(targetProps[i] + '-changed', this.updateSource);
        }
        targetProps.length = 0;
      }
      if (targetProps.length === 0) this.targets.splice(this.targets.indexOf(targetNode), 1);
    }
  }
  /**
   * Event handler that updates source property when one of the targets emits `[prop]-changed` event.
   */
  updateSource(event) {
    if (this.targets.indexOf(event.target) === -1) {
      console.warn(
        `io error: updateSource() should never fire when target is removed from binding.
        Please file an issue at https://github.com/arodic/io/issues.`
      );
      return;
    }
    const value = event.detail.value;
    if (this.source[this.sourceProp] !== value) {
      this.source[this.sourceProp] = value;
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[prop]-changed` event.
   */
  updateTargets(event) {
    if (event.target != this.source) {
      console.warn(
        `io error: updateTargets() should always originate form source node.
        Please file an issue at https://github.com/arodic/io/issues.`
      );
      return;
    }
    const value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      const targetProps = this.targetsMap.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        let oldValue = this.targets[i][targetProps[j]];
        if (oldValue !== value) {
          // JavaScript is weird NaN != NaN
          if (typeof value == 'number' && typeof oldValue == 'number' && isNaN(value) && isNaN(oldValue)) continue;
          this.targets[i][targetProps[j]] = value;
        }
      }
    }
  }
  /**
   * Dispose of the binding by removing all targets and listeners.
   * Use this when node is no longer needed.
   */
  dispose() {
    this.source.removeEventListener(this.sourceProp + '-changed', this.updateTargets);
    for (let t in this.targets) {
      this.removeTarget(this.targets[t]);
      delete this.targets[t];
    }
  }
}
