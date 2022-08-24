/**
 * Property binding class.
 * It facilitates data binding between source node/property and target nodes/properties
 * using `[property]-changed` events.
 */
export class Binding {
    node;
    property = '';
    targets = [];
    targetProperties = new WeakMap();
    /**
     * Creates a binding object for specified `node` and `property`.
     * @param {IoNode} node - Property owner node
     * @param {string} property - Name of the property
     */
    constructor(node, property) {
        this.node = node;
        this.property = property;
        this.onTargetChanged = this.onTargetChanged.bind(this);
        this.onSourceChanged = this.onSourceChanged.bind(this);
        this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged);
    }
    set value(value) {
        this.node[this.property] = value;
    }
    get value() {
        return this.node[this.property];
    }
    /**
     * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
     * @param {IoNode} node - Target node
     * @param {string} property - Target property
     */
    addTarget(node, property) {
        debug: {
            if (node._properties[property].binding && node._properties[property].binding !== this) {
                console.warn('Binding target alredy has binding!');
            }
        }
        node._properties[property].binding = this;
        node.setProperty(property, this.node[this.property]);
        const target = node;
        if (this.targets.indexOf(target) === -1)
            this.targets.push(target);
        const targetProperties = this.getTargetProperties(target);
        if (targetProperties.indexOf(property) === -1) {
            targetProperties.push(property);
            target.addEventListener(`${property}-changed`, this.onTargetChanged);
        }
        else {
            // console.warn('Binding target alredy added!'); WHY?
        }
    }
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {IoNode} node - Target node
     * @param {string} property - Target property
     */
    removeTarget(node, property) {
        const targetIoNode = node;
        const targetProperties = this.getTargetProperties(targetIoNode);
        if (property) {
            const i = targetProperties.indexOf(property);
            if (i !== -1)
                targetProperties.splice(i, 1);
            targetIoNode.removeEventListener(`${property}-changed`, this.onTargetChanged);
        }
        else {
            for (let i = targetProperties.length; i--;) {
                targetIoNode.removeEventListener(`${targetProperties[i]}-changed`, this.onTargetChanged);
            }
            targetProperties.length = 0;
        }
        if (targetProperties.length === 0)
            this.targets.splice(this.targets.indexOf(targetIoNode), 1);
    }
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {IoNode} node - Target node.
     * @return {Array.<string>} list of target property names.
     */
    getTargetProperties(node) {
        let targetProperties = this.targetProperties.get(node);
        if (targetProperties) {
            return targetProperties;
        }
        else {
            targetProperties = [];
            this.targetProperties.set(node, targetProperties);
            return targetProperties;
        }
    }
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onTargetChanged(event) {
        debug: {
            if (this.targets.indexOf(event.target) === -1) {
                console.error('onTargetChanged() should never fire when target is removed from binding. Please file an issue at https://github.com/arodic/iogui/issues.');
                return;
            }
        }
        const oldValue = this.node[this.property];
        const value = event.detail.value;
        if (oldValue !== value) {
            // JavaScript is weird NaN != NaN
            if ((typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue)))
                return;
            this.node[this.property] = value;
        }
    }
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onSourceChanged(event) {
        debug: {
            if (event.target !== this.node) {
                console.error('onSourceChanged() should always originate form source node. Please file an issue at https://github.com/arodic/iogui/issues.');
                return;
            }
        }
        const value = event.detail.value;
        for (let i = this.targets.length; i--;) {
            const target = this.targets[i];
            const targetProperties = this.getTargetProperties(target);
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
        this.node.removeEventListener(`${this.property}-changed`, this.onSourceChanged);
        for (let i = this.targets.length; i--;) {
            this.removeTarget(this.targets[i]);
        }
        this.targets.length = 0;
        delete this.node;
        delete this.property;
        delete this.targets;
        delete this.targetProperties;
        delete this.onTargetChanged;
        delete this.onSourceChanged;
    }
}
//# sourceMappingURL=binding.js.map