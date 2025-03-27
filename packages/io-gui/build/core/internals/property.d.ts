import { Binding } from './binding';
import { Constructor, IoNode } from '../node';
/**
 * Configuration for a property of an IoNode class.
 * @typedef {Object} PropertyDefinition
 * @property {*} [value] The property's value. Can be any type unless `type` is specified.
 * @property {Constructor} [type] Constructor function defining the property's type.
 * @property {Binding} [binding] Binding object for two-way data synchronization.
 * @property {boolean} [reflect] Whether to reflect the property to an HTML attribute.
 * @property {*} [init] Initialization arguments for constructing initial value.
 */
export type PropertyDefinition = {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: boolean;
    init?: any;
};
/**
 * Allows loose definition of properties by specifying only partial definitions, such as default value, type or a binding object.
 * @typedef {(string|number|boolean|Array<*>|null|undefined|Constructor|Binding|PropertyDefinition)} PropertyDefinitionLoose
 */
export type PropertyDefinitionLoose = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDefinition;
/**
 * Instantiates a property definition object from a loosely or strongly typed property definition.
 * It facilitates merging of inherited property definitions from the prototype chain.
 * @class
 * @property {*} [value] The property's value. Can be any type.
 * @property {Constructor} [type] Constructor function defining the property's type.
 * @property {Binding} [binding] Binding object for two-way data synchronization.
 * @property {boolean} [reflect] Whether to reflect the property to an HTML attribute.
 * @property {*} [init] Initialization arguments for constructing initial values.
 */
export declare class ProtoProperty {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect?: boolean;
    init?: any;
    /**
     * Creates a property definition from various input types.
     * @param {PropertyDefinitionLoose} def Input definition which can be:
     * - `undefined` or `null`: Sets as value
     * - `Constructor`: Sets as type
     * - `Binding`: Sets value from binding and stores binding reference
     * - `PropertyDefinition`: Copies all defined fields
     * - Other values: Sets as value
     * @example
     * new ProtoProperty(String) // {type: String}
     * new ProtoProperty('hello') // {value: 'hello'}
     * new ProtoProperty({value: 42, type: Number}) // {value: 42, type: Number}
     * new ProtoProperty(new Binding(node, 'value')) // {value: node.value, binding: ...}
     */
    constructor(def: PropertyDefinitionLoose);
    /**
     * Assigns values of another ProtoProperty to itself, unless they are default values.
     * @param {ProtoProperty} protoProp Source ProtoProperty
     */
    assign(protoProp: ProtoProperty): void;
    /**
     * Creates a serializable representation of the property definition.
     * Handles special cases for better JSON serialization:
     * - Converts object values to their constructor names
     * - Converts function types to their names
     * - Only includes defined fields
     * @returns {object} A plain object suitable for JSON serialization
     */
    toJSON(): any;
}
/**
 * PropertyInstance object constructed from `ProtoProperty`.
 */
export declare class PropertyInstance {
    value?: any;
    type?: Constructor;
    binding?: Binding;
    reflect: boolean;
    init?: any;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param node owner IoNode instance
     * @param propDef ProtoProperty object
     */
    constructor(node: IoNode, propDef: ProtoProperty);
}
//# sourceMappingURL=property.d.ts.map