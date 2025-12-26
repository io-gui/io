import { Binding } from './Binding.js';
import { NodeArray } from '../core/NodeArray.js';
/**
 * Instantiates a property definition object from a loosely or strongly typed property definition.
 * It facilitates merging of inherited property definitions from the prototype chain.
 * @class
 * @property {*} [value] The property's value. Can be any type.
 * @property {AnyConstructor} [type] Constructor function defining the property's type.
 * @property {Binding} [binding] Binding object for two-way data synchronization.
 * @property {boolean} [reflect] Whether to reflect the property to an HTML attribute.
 * @property {*} [init] Initialization arguments for constructing initial values.
 */
export class ReactiveProtoProperty {
    /**
     * Creates a property definition from various input types.
     * @param {ReactivePropertyDefinitionLoose} def Input definition which can be:
     * - `undefined` or `null`: Sets as value
     * - `AnyConstructor`: Sets as type
     * - `Binding`: Sets value from binding and stores binding reference
     * - `ReactivePropertyDefinition`: Copies all defined fields
     * - Other values: Sets as value
     * @example
     * new ReactiveProtoProperty(String) // {type: String}
     * new ReactiveProtoProperty('hello') // {value: 'hello'}
     * new ReactiveProtoProperty({value: 42, type: Number}) // {value: 42, type: Number}
     * new ReactiveProtoProperty(new Binding(node, 'value')) // {value: node.value, binding: ...}
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
            this.binding = def;
        }
        else if (def && def.constructor === Object) {
            const d = def;
            if (Object.hasOwn(d, 'value'))
                this.value = d.value;
            if (Object.hasOwn(d, 'type'))
                this.type = d.type;
            if (d.binding instanceof Binding) {
                this.binding = d.binding;
                this.value = this.binding.value;
            }
            if (Object.hasOwn(d, 'reflect'))
                this.reflect = d.reflect;
            if (Object.hasOwn(d, 'init'))
                this.init = d.init;
        }
        else if (!(def && def.constructor === Object)) {
            this.value = def;
        }
    }
    /**
     * Assigns values of another ReactiveProtoProperty to itself, unless they are default values.
     * @param {ReactiveProtoProperty} protoProp Source ReactiveProtoProperty
     */
    assign(protoProp) {
        if (Object.hasOwn(protoProp, 'value'))
            this.value = protoProp.value;
        if (Object.hasOwn(protoProp, 'type'))
            this.type = protoProp.type;
        if (Object.hasOwn(protoProp, 'reflect'))
            this.reflect = protoProp.reflect;
        if (Object.hasOwn(protoProp, 'init'))
            this.init = protoProp.init;
        if (Object.hasOwn(protoProp, 'binding'))
            this.binding = protoProp.binding;
    }
    /**
     * Creates a serializable representation of the property definition.
     * Handles special cases for better JSON serialization:
     * - Converts object values to their constructor names
     * - Converts function types to their names
     * - Only includes defined fields
     * @returns {object} A plain object suitable for JSON serialization
     */
    toJSON() {
        const json = {
            value: this.value,
            type: this.type,
            reflect: this.reflect,
            init: this.init,
            binding: this.binding,
        };
        if (json.value && typeof json.value === 'object') {
            json.value = json.value.constructor.name;
        }
        if (json.type && typeof json.type === 'function') {
            json.type = json.type.name;
        }
        return json;
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
        console.error(`ReactivePropertyInstance: Invalid path ${item}`);
    }
    else
        return item;
}
/**
 * ReactivePropertyInstance object constructed from `ReactiveProtoProperty`.
 */
export class ReactivePropertyInstance {
    // Property value.
    value;
    // Constructor of the property value.
    type;
    // Binding object.
    binding;
    // Reflects to HTML attribute.
    reflect = false;
    // Initialize property with provided constructor arguments. `null` prevents initialization.
    init = undefined;
    /**
     * Creates the property configuration object and copies values from `ReactiveProtoProperty`.
     * @param node owner Node instance
     * @param propDef ReactiveProtoProperty object
     */
    constructor(node, propDef) {
        debug: {
            Object.keys(propDef).forEach(key => {
                if (['value', 'type', 'reflect', 'init', 'binding'].indexOf(key) === -1) {
                    console.warn(`ReactiveProtoProperty: Invalid field ${key}`);
                }
            });
            if (propDef.type !== undefined) {
                if (typeof propDef.type !== 'function')
                    console.warn('Incorrect type for "type" field');
            }
            if (propDef.type === NodeArray && propDef.init !== 'this') {
                console.warn('NodeArray property should be initialized with "this"');
            }
            if (propDef.binding !== undefined && propDef.binding.constructor !== Binding)
                console.warn('Incorrect type for "binding" field');
            if (propDef.reflect !== undefined && typeof propDef.reflect !== 'boolean')
                console.error(`Invalid reflect field ${propDef.reflect}!`);
        }
        this.value = propDef.value;
        this.type = propDef.type;
        this.binding = propDef.binding;
        if (typeof propDef.reflect === 'boolean')
            this.reflect = propDef.reflect;
        if (propDef.init !== undefined)
            this.init = propDef.init;
        if (this.binding instanceof Binding) {
            this.value = this.binding.value;
        }
        else if (this.value === undefined) {
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
                    else if (this.init === null) {
                        this.value = new this.type();
                    }
                    else {
                        const argument = decodeInitArgument(this.init, node);
                        this.value = new this.type(argument);
                    }
                }
            }
        }
        debug: {
            if (this.value !== undefined && this.init !== undefined) {
                if ([String, Number, Boolean].indexOf(this.type) !== -1) {
                    if (this.type === Boolean && typeof this.value !== 'boolean' ||
                        this.type === Number && typeof this.value !== 'number' ||
                        this.type === String && typeof this.value !== 'string') {
                        console.warn(`Property: Uninitialized value for type "${this.type.name}"!`);
                    }
                }
                else {
                    if (typeof this.type === 'function' && !(this.value instanceof this.type)) {
                        console.warn(`Property: Incorrect value "${this.value}" for type "${this.type.name}"!`);
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=ReactiveProperty.js.map