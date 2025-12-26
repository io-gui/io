// This helper checks if both values are NaN because NaN === NaN is false.
const bothAreNaNs = function (value, oldValue) {
    return typeof value === 'number' && isNaN(value) && typeof oldValue === 'number' && isNaN(oldValue);
};
const isTypeCompatible = (type1, type2) => {
    // Handle primitive types
    if (type1 === type2)
        return true;
    // Handle class inheritance
    if (typeof type1 === 'function' && typeof type2 === 'function') {
        return type1 instanceof type2 || type2 instanceof type1;
    }
    return false;
};
/**
 * This class is used internally by the framework to enable two-way data synchronization between reactive properties.
 * It manages bindings between a source node's reactive property and one or more target nodes and reactive properties.
 * It uses hub-and-spoke pub/sub event system and maintains data consistency by automatically propagating changes to all bound nodes and properties.
 *
 * Key features:
 * - Listens for `[propName]-changed` events to detect changes
 * - Supports one-to-many property bindings
 * - Prevents circular update loops
 * - Automatically cleans up listeners when disposed
 *
 * @example
 * const binding = new Binding<number>(nodeA, 'value');
 * binding.addTarget(nodeB, 'value');
 */
export class Binding {
    node;
    property;
    targets = [];
    targetProperties = new WeakMap();
    /**
     * Creates a binding object for specified source `node` and `property`.
     * It attaches a `[propName]-changed` listener to the source node.
     * @param {Node | IoElement} node - Source node
     * @param {string} property - Name of the sourceproperty
     */
    constructor(node, property) {
        debug: {
            if (!node._isNode && !node._isIoElement)
                console.warn('Source node is not a Node or IoElement instance!');
            if (!node._reactiveProperties.has(property))
                console.warn(`Source node does not have a reactive property "${property}"!`);
        }
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
     * Adds a target node and property.
     * Sets itself as the binding reference on the target `ReactivePropertyInstance`.
     * Adds a `[propName]-changed` listener to the target node.
     * @param {Node | IoElement} target - Target node
     * @param {string} property - Target property
     */
    addTarget(target, property) {
        const targetProps = this.getTargetProperties(target);
        debug: {
            if (!target._isNode && !target._isIoElement)
                console.warn('Target node is not a Node or IoElement instance!');
            if (!target._reactiveProperties.has(property))
                console.warn(`Target node does not have a reactive property "${property}"!`);
            if (targetProps.indexOf(property) !== -1)
                console.error(`Target property "${property}" already added!`);
        }
        if (this.targets.indexOf(target) === -1)
            this.targets.push(target);
        if (targetProps.indexOf(property) === -1) {
            targetProps.push(property);
            const targetP = target._reactiveProperties.get(property);
            if (targetP.binding && targetP.binding !== this) {
                debug: {
                    console.warn('Improper usage detected!');
                    console.info('Target property is already a target of another binding. Undinding previous binding!');
                }
                targetP.binding.removeTarget(target, property);
            }
            targetP.binding = this;
            debug: {
                const srcP = this.node._reactiveProperties.get(this.property);
                const valueMismatch = srcP.value !== undefined && targetP.value !== undefined && typeof srcP.value !== typeof targetP.value;
                const typeMismatch = srcP.type !== undefined && targetP.type !== undefined && !isTypeCompatible(srcP.type, targetP.type);
                if (valueMismatch || typeMismatch) {
                    console.warn(`Source property "${this.property}" does not match type of target property "${property}"!`);
                    console.info(`Source "${this.property}" value: ${srcP.value} type: ${srcP.type} typeof: ${typeof srcP.value}`);
                    console.info(`Target "${property}" value: ${targetP.value} type: ${targetP.type} typeof: ${typeof targetP.value}`);
                }
            }
            target.addEventListener(`${property}-changed`, this.onTargetChanged);
            target.setProperty(property, this.value, true);
        }
    }
    /**
     * Removes target node and property.
     * If `property` is not specified, it removes all target properties.
     * Removes binding reference from the target `ReactivePropertyInstance`.
     * Removes `[propName]-changed` listener from the target node.
     * @param {Node | IoElement} target - Target node
     * @param {string} property - Target property
     */
    removeTarget(target, property) {
        const targetProperties = this.getTargetProperties(target);
        if (property) {
            const i = targetProperties.indexOf(property);
            debug: if (i === -1) {
                console.error('Target property not found!');
            }
            targetProperties.splice(i, 1);
            const propertyInstance = target._reactiveProperties.get(property);
            debug: if (propertyInstance.binding !== this) {
                console.error('Target property has a different binding!');
            }
            propertyInstance.binding = undefined;
            target.removeEventListener(`${property}-changed`, this.onTargetChanged);
        }
        else {
            for (let i = targetProperties.length; i--;) {
                const prop = targetProperties[i];
                const propertyInstance = target._reactiveProperties.get(prop);
                debug: if (propertyInstance.binding !== this) {
                    console.error('Target property has a different binding!');
                }
                propertyInstance.binding = undefined;
                target.removeEventListener(`${prop}-changed`, this.onTargetChanged);
            }
            targetProperties.length = 0;
        }
        if (targetProperties.length === 0)
            this.targets.splice(this.targets.indexOf(target), 1);
    }
    /**
     * Event handler that updates source property when one of the targets emits `[propName]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onTargetChanged(event) {
        debug: if (this.targets.indexOf(event.target) === -1) {
            console.error('onTargetChanged() should never fire if target is not accounted for!');
        }
        const oldValue = this.value;
        const value = event.detail.value;
        if (oldValue !== value) {
            if (bothAreNaNs(value, oldValue))
                return;
            this.node[this.property] = value;
        }
    }
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[propName]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onSourceChanged(event) {
        debug: if (event.target !== this.node) {
            console.error('onSourceChanged() should always originate form source node!');
        }
        const value = event.detail.value;
        for (let i = this.targets.length; i--;) {
            const target = this.targets[i];
            const targetProperties = this.getTargetProperties(target);
            for (let j = targetProperties.length; j--;) {
                const propName = targetProperties[j];
                const oldValue = target[propName];
                if (oldValue !== value) {
                    if (bothAreNaNs(value, oldValue))
                        continue;
                    target[propName] = value;
                }
            }
        }
    }
    /**
     * Returns a list of target properties for specified target node.
     * @param {Node | IoElement} target - Target node.
     * @return {Properties} list of target property names.
     */
    getTargetProperties(target) {
        if (!this.targetProperties.has(target))
            this.targetProperties.set(target, []);
        return this.targetProperties.get(target);
    }
    /**
     * Returns a JSON representation of the binding.
     * This is required for `JSON.stringify(protoProperties)` in `ProtoChain`.
     * @return {string} JSON representation of the binding.
     */
    toJSON() {
        const targetProperties = [];
        for (let i = 0; i < this.targets.length; i++) {
            const target = this.targets[i];
            const props = this.getTargetProperties(target);
            targetProperties[i] = props;
        }
        return {
            node: this.node.constructor.name,
            property: this.property,
            targets: this.targets.map(t => t.constructor.name),
            targetProperties: targetProperties,
        };
    }
    /**
     * Disposes the binding and removes all targets and listeners.
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
    }
}
//# sourceMappingURL=Binding.js.map