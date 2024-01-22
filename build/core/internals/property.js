import { Binding } from './binding.js';
/**
 * Finalized property definition created from property declaration.
 */
export class ProtoProperty {
    value;
    type;
    binding;
    reflect;
    reactive;
    observe;
    init;
    /**
     * Takes a loosely typed property declaration and returns full property definition with unscpecified fileds inferred.
     * @param {PropertyDeclarationLoose} def Loosely typed property definition
     */
    constructor(def) {
        if (def === undefined || def === null) {
            this.value = def;
        }
        else if (typeof def === 'function') {
            this.type = def;
        }
        else if (def instanceof Binding) {
            this.value = def.value;
            this.type = (def.value !== undefined && def.value !== null) ? def.value.constructor : undefined;
            this.binding = def;
        }
        else if (def && def.constructor === Object) {
            const d = def;
            this.value = d.value !== undefined ? d.value : undefined;
            this.type = d.type !== undefined ? d.type : (d.value !== undefined && d.value !== null) ? d.value.constructor : undefined;
            if (d.binding instanceof Binding) {
                this.binding = d.binding;
                this.value = this.binding.value;
            }
            if (d.reflect !== undefined)
                this.reflect = d.reflect;
            if (d.reactive !== undefined)
                this.reactive = d.reactive;
            if (d.observe !== undefined)
                this.observe = d.observe;
            if (d.init !== undefined)
                this.init = d.init;
        }
        else if (!(def && def.constructor === Object)) {
            this.value = def;
            this.type = def.constructor;
        }
    }
    /**
     * Assigns values of another ProtoProperty to itself, unless they are default values.
     * @param {ProtoProperty} protoProp Source ProtoProperty
     */
    assign(protoProp) {
        if (protoProp.value !== undefined)
            this.value = protoProp.value;
        if (protoProp.type !== undefined)
            this.type = protoProp.type;
        if (protoProp.reflect !== undefined)
            this.reflect = protoProp.reflect;
        if (protoProp.reactive !== undefined)
            this.reactive = protoProp.reactive;
        if (protoProp.observe !== undefined)
            this.observe = protoProp.observe;
        if (protoProp.init !== undefined)
            this.init = protoProp.init;
        if (protoProp.binding !== undefined)
            this.binding = protoProp.binding;
    }
}
function decodeInitArgument(item, node) {
    if (item === 'this') {
        return node;
    }
    else if (typeof item === 'string' && item.startsWith('this.')) {
        const keys = item.split('.');
        let target = node;
        for (let i = 1; i < keys.length; i++) {
            target = target[keys[i]];
        }
        if (target)
            return target;
        debug: {
            console.warn(`PropertyInstance: Invalid path ${item}`);
        }
    }
    else
        return item;
}
/**
 * PropertyInstance object constructed from `ProtoProperty`.
 */
export class PropertyInstance {
    // Property value.
    value = undefined;
    // Constructor of the property value.
    type;
    // Binding object.
    binding;
    // Reflects to HTML attribute.
    reflect = false;
    // Enables change handlers and events.
    reactive = true;
    // Observe object mutations for this property.
    observe = false;
    // Initialize property with provided constructor arguments. `null` prevents initialization.
    init = undefined;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param node owner IoNode instance
     * @param propDef ProtoProperty object
     */
    constructor(node, propDef) {
        debug: {
            Object.keys(propDef).forEach(key => {
                if (['value', 'type', 'reflect', 'reactive', 'observe', 'init', 'binding'].indexOf(key) === -1) {
                    console.warn(`ProtoProperty: Invalid field ${key}`);
                }
            });
            if (propDef.type !== undefined) {
                if (typeof propDef.type !== 'function')
                    console.warn('Incorrect type for "type" field');
            }
            if (propDef.binding !== undefined && propDef.binding.constructor !== Binding)
                console.warn('Incorrect type for "binding" field');
            if (propDef.reflect !== undefined && typeof propDef.reflect !== 'boolean')
                console.error(`Invalid reflect field ${propDef.reflect}!`);
            if (propDef.reactive !== undefined && typeof propDef.reactive !== 'boolean')
                console.warn('Incorrect type for "reactive" field');
            if (propDef.observe !== undefined && typeof propDef.observe !== 'boolean')
                console.warn('Incorrect type for "observe" field');
        }
        // TODO: Consider not allowing shared object instances as initial values.
        this.value = propDef.value;
        this.type = propDef.type;
        this.binding = propDef.binding;
        if (propDef.reflect !== undefined)
            this.reflect = propDef.reflect;
        if (propDef.reactive !== undefined)
            this.reactive = propDef.reactive;
        if (propDef.observe !== undefined)
            this.observe = propDef.observe;
        if (propDef.init !== undefined)
            this.init = propDef.init;
        if (this.binding instanceof Binding) {
            this.value = this.binding.value;
        }
        else if ((this.value === undefined || this.value === null) && this.init !== null) {
            if (this.type === Boolean)
                this.value = false;
            else if (this.type === String)
                this.value = '';
            else if (this.type === Number)
                this.value = 0;
            else if (typeof this.type === 'function') {
                if (this.init !== undefined) {
                    if (this.init instanceof Array) {
                        const args = this.init.map(item => decodeInitArgument(item, node));
                        this.value = new this.type(...args);
                    }
                    else if (this.init instanceof Object) {
                        const args = {};
                        Object.keys(this.init).forEach(key => {
                            args[key] = decodeInitArgument(this.init[key], node);
                        });
                        this.value = new this.type(args);
                    }
                    else {
                        const argument = decodeInitArgument(this.init, node);
                        this.value = new this.type(argument);
                    }
                    // TODO: Consider other ways of encoding initial values.
                }
                else {
                    this.value = new this.type();
                }
            }
        }
        debug: {
            if (this.value !== undefined && this.value !== null) {
                if ([String, Number, Boolean].indexOf(this.type) !== -1) {
                    if (this.type === Boolean && typeof this.value !== 'boolean' ||
                        this.type === Number && typeof this.value !== 'number' ||
                        this.type === String && typeof this.value !== 'string') {
                        console.warn(`Property: Incorrect value ${this.value} type for property ${name}!`);
                    }
                }
                else {
                    if (typeof this.type === 'function' && !(this.value instanceof this.type)) {
                        console.warn(`Property: Incorrect value ${this.value} type for property ${name}!`);
                    }
                }
            }
        }
    }
}
export const PropertyDecorators = new WeakMap();
/**
 * Allows property declarations using decorator pattern.
 * @param propertyDefinition Property declaration.
 * @return Property decorator function.
 */
export const Property = function (propertyDefinition) {
    return (target, propertyName) => {
        const constructor = target.constructor;
        const _Properties = PropertyDecorators.get(constructor) || {};
        PropertyDecorators.set(constructor, _Properties);
        _Properties[propertyName] = propertyDefinition;
    };
};
//# sourceMappingURL=property.js.map