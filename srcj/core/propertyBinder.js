/**
 * Binding object. It manages data binding between source and targets using `[property]-changed` events.
 */
export class Binding {
    /**
     * Creates a binding object for specified `node` and `property`.
     */
    constructor(node, property) {
        this.__property = '';
        this.__targets = [];
        this.__targetProperties = new WeakMap();
        this.__node = node;
        this.__property = property;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__property', { enumerable: false, writable: false });
        Object.defineProperty(this, '__targets', { enumerable: false, writable: false });
        Object.defineProperty(this, '__targetProperties', { enumerable: false, writable: false });
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
     * @param {IoNode} node - Target node.
     * @param {string} property - Target property.
     */
    addTarget(node, property, __nodeProperties) {
        // TODO: unhack passing __properties from constructor;
        const nodeProperties = node.__properties || __nodeProperties;
        nodeProperties[property].binding = this;
        nodeProperties.set(property, this.__node[this.__property]);
        const targetIoNode = node;
        if (this.__targets.indexOf(targetIoNode) === -1)
            this.__targets.push(targetIoNode);
        const targetProperties = this._getTargetProperties(targetIoNode);
        if (targetProperties.indexOf(property) === -1) {
            targetProperties.push(property);
            targetIoNode.addEventListener(`${property}-changed`, this._onTargetChanged);
        }
    }
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {IoNode} node - Target node.
     * @param {string} property - Target property.
     */
    removeTarget(node, property) {
        const targetIoNode = node;
        const targetProperties = this._getTargetProperties(targetIoNode);
        if (property) {
            const i = targetProperties.indexOf(property);
            if (i !== -1)
                targetProperties.splice(i, 1);
            targetIoNode.removeEventListener(`${property}-changed`, this._onTargetChanged);
        }
        else {
            for (let i = targetProperties.length; i--;) {
                targetIoNode.removeEventListener(`${targetProperties[i]}-changed`, this._onTargetChanged);
            }
            targetProperties.length = 0;
        }
        if (targetProperties.length === 0)
            this.__targets.splice(this.__targets.indexOf(targetIoNode), 1);
    }
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {IoNode} node - Target node.
     */
    _getTargetProperties(node) {
        let targetProperties = this.__targetProperties.get(node);
        if (targetProperties) {
            return targetProperties;
        }
        else {
            targetProperties = [];
            this.__targetProperties.set(node, targetProperties);
            return targetProperties;
        }
    }
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {event} ChangeEvent - Property change event.
     */
    _onTargetChanged(event) {
        debug: {
            if (this.__targets.indexOf(event.target) === -1) {
                console.error(`_onTargetChanged() should never fire when target is removed from binding.
          Please file an issue at https://github.com/arodic/iogui/issues.`);
                return;
            }
        }
        const oldValue = this.__node[this.__property];
        const value = event.detail.value;
        if (oldValue !== value) {
            // JavaScript is weird NaN != NaN
            if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)))
                return;
            this.__node[this.__property] = value;
        }
    }
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {event} ChangeEvent - Property change event.
     */
    _onSourceChanged(event) {
        debug: {
            if (event.target != this.__node) {
                console.error(`_onSourceChanged() should always originate form source node.
          Please file an issue at https://github.com/arodic/iogui/issues.`);
                return;
            }
        }
        const value = event.detail.value;
        for (let i = this.__targets.length; i--;) {
            const target = this.__targets[i];
            const targetProperties = this._getTargetProperties(target);
            for (let j = targetProperties.length; j--;) {
                const propName = targetProperties[j];
                const oldValue = target[propName];
                if (oldValue !== value) {
                    // JavaScript is weird NaN != NaN
                    if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)))
                        continue;
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
            this.removeTarget(this.__targets[i]);
        }
        this.__targets.length = 0;
        delete this.__node;
        delete this.__property;
        delete this.__targets;
        delete this.__targetProperties;
        delete this._onTargetChanged;
        delete this._onSourceChanged;
    }
}
/**
 * Manager for property bindings. It holds all bindings for a particular IoNode.
 */
export class PropertyBinder {
    /**
     * Creates binding manager for the specified node.
     * @param {IoNode} node - Owner node.
     */
    constructor(node) {
        this.__bindings = {};
        this.__node = node;
        Object.defineProperty(this, '__node', { enumerable: false, writable: false });
        Object.defineProperty(this, '__bindings', { enumerable: false, writable: false });
    }
    /**
     * Returns a binding to the specified property name or creates one if it does not exist.
     * @param {string} property - Property to bind.
     */
    bind(property) {
        this.__bindings[property] = this.__bindings[property] || new Binding(this.__node, property);
        return this.__bindings[property];
    }
    /**
     * Removes a binding for the specified property name.
     * @param {string} property - Property to unbind.
     */
    unbind(property) {
        if (this.__bindings[property])
            this.__bindings[property].dispose();
        delete this.__bindings[property];
    }
    /**
     * Disposes all bindings. Use this when node is no longer needed.
     */
    dispose() {
        for (let property in this.__bindings) {
            this.__bindings[property].dispose();
            delete this.__bindings[property];
        }
        delete this.__node;
        delete this.__bindings;
    }
}
//# sourceMappingURL=propertyBinder.js.map