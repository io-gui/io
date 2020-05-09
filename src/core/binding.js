/**
 * Binding object. It manages data binding between source and targets using `[prop]-changed` events.
 */
class Binding {
  /**
   * Creates a binding object with specified `sourceNode` and `sourceProp`.
   * @param {Node} sourceNode - Source node.
   * @param {string} sourceProp - Source property.
   */
  constructor(sourceNode, sourceProp) {
    Object.defineProperty(this, 'source', {value: sourceNode, configurable: true});
    Object.defineProperty(this, 'sourceProp', {value: sourceProp, configurable: true});
    Object.defineProperty(this, 'targets', {value: [], configurable: true});
    Object.defineProperty(this, 'targetProps', {value: new WeakMap(), configurable: true});
    this._onTargetChanged = this._onTargetChanged.bind(this);
    this._onSourceChanged = this._onSourceChanged.bind(this);
    this.source.addEventListener(this.sourceProp + '-changed', this._onSourceChanged);
  }
  set value(value) {
    this.source[this.sourceProp] = value;
  }
  get value() {
    return this.source[this.sourceProp];
  }
  /**
   * Adds a target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.
   * @param {Node} targetNode - Target node.
   * @param {string} targetProp - Target property.
   */
  addTarget(targetNode, targetProp) {
    const props = targetNode.__properties;
    if (props) {
      props[targetProp].binding = this;
      props.set(targetProp, this.source[this.sourceProp]);
    }

    if (this.targets.indexOf(targetNode) === -1) this.targets.push(targetNode);
    if (this.targetProps.has(targetNode)) {
      const targetProps = this.targetProps.get(targetNode);
      if (targetProps.indexOf(targetProp) === -1) {
        targetProps.push(targetProp);
        targetNode.addEventListener(targetProp + '-changed', this._onTargetChanged);
      }
    } else {
      this.targetProps.set(targetNode, [targetProp]);
      targetNode.addEventListener(targetProp + '-changed', this._onTargetChanged);
    }
  }
  /**
   * Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.
   * If `targetProp` is not specified, it removes all target properties.
   * @param {Node} targetNode - Target node.
   * @param {string} targetProp - Target property.
   */
  removeTarget(targetNode, targetProp) {
    if (this.targetProps.has(targetNode)) {
      const targetProps = this.targetProps.get(targetNode);
      if (targetProp) {
        const index = targetProps.indexOf(targetProp);
        if (index !== -1) {
          targetProps.splice(index, 1);
        }
        targetNode.removeEventListener(targetProp + '-changed', this._onTargetChanged);
      } else {
        for (let i = targetProps.length; i--;) {
          targetNode.removeEventListener(targetProps[i] + '-changed', this._onTargetChanged);
        }
        targetProps.length = 0;
      }
      if (targetProps.length === 0) this.targets.splice(this.targets.indexOf(targetNode), 1);
    }
  }
  /**
   * Event handler that updates source property when one of the targets emits `[prop]-changed` event.
   * @param {Object} event - Event object.
   * @param {Node} event.target - Event target (source node that emitted the event).
   * @param {Object} event.detail - Event detail.
   * @param {*} event.detail.value - New value.
   */
  _onTargetChanged(event) {
    if (this.targets.indexOf(event.target) === -1) {
      console.error(
        `_onTargetChanged() should never fire when target is removed from binding.
        Please file an issue at https://github.com/arodic/io/issues.`
      );
      return;
    }
    const oldValue = this.source[this.sourceProp];
    const value = event.detail.value;
    if (oldValue !== value) {
      // JavaScript is weird NaN != NaN
      if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) return;
      this.source[this.sourceProp] = value;
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[prop]-changed` event.
   * @param {Object} event - Event object.
   * @param {Node} event.target - Event target (source node that emitted the event).
   * @param {Object} event.detail - Event detail.
   * @param {*} event.detail.value - New value.
   */
  _onSourceChanged(event) {
    if (event.target != this.source) {
      console.error(
        `_onSourceChanged() should always originate form source node.
        Please file an issue at https://github.com/arodic/io/issues.`
      );
      return;
    }
    const value = event.detail.value;
    for (let i = this.targets.length; i--;) {
      const targetProps = this.targetProps.get(this.targets[i]);
      for (let j = targetProps.length; j--;) {
        const oldValue = this.targets[i][targetProps[j]];
        if (oldValue !== value) {
          // JavaScript is weird NaN != NaN
          if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue))) continue;
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
    this.source.removeEventListener(this.sourceProp + '-changed', this._onSourceChanged);
    for (let t in this.targets) {
      this.removeTarget(this.targets[t]);
      delete this.targets[t];
    }
    delete this.source;
    delete this.sourceProp;
    delete this.targets;
    delete this.targetProps;
    delete this._onTargetChanged;
    delete this._onSourceChanged;
  }
}

/**
 * Manager for `Node` property bindings. It holds all bindings for a particular Node.
 */
class Bindings {
  /**
   * Creates binding manager with a node reference.
   * @param {Node} node - Reference to the node.
   */
  constructor(node) {
    Object.defineProperty(this, '__node', {value: node, configurable: true});
  }
  /**
   * Returns a binding to the specified property name or creates one if it does not exist.
   * @param {string} prop - property name.
   * @return {Binding} Property binding.
   */
  bind(prop) {
    this[prop] = this[prop] || new Binding(this.__node, prop);
    return this[prop];
  }
  /**
   * Disposes a binding for the specified property name.
   * @param {string} prop - property name.
   */
  unbind(prop) {
    if (this[prop]) this[prop].dispose();
    delete this[prop];
  }
  /**
   * Disposes all bindings. Use this when node is no longer needed.
   */
  dispose() {
    for (let prop in this) {
      this[prop].dispose();
      delete this[prop];
    }
    delete this.__node;
  }
}

export {Bindings, Binding};
