import { Binding } from './Binding.js';
import { AnyConstructor, ReactiveNode } from '../nodes/ReactiveNode.js';
import { IoElement } from '../elements/IoElement.js';
/**
 * Configuration for a property of a ReactiveNode class.
 * @typedef {Object} ReactivePropertyDefinition
 * @property {*} [value] The property's value. Can be any type unless `type` is specified.
 * @property {AnyConstructor} [type] Constructor function defining the property's type.
 * @property {Binding} [binding] Binding object for two-way data synchronization.
 * @property {boolean} [reflect] Whether to reflect the property to an HTML attribute.
 * @property {*} [init] Initialization arguments for constructing initial value.
 */
export type ReactivePropertyDefinition = {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect?: boolean;
    init?: any;
};
/**
 * Allows loose definition of properties by specifying only partial definitions, such as default value, type or a binding object.
 * @typedef {(string|number|boolean|Array<*>|null|undefined|AnyConstructor|Binding|ReactivePropertyDefinition)} ReactivePropertyDefinitionLoose
 */
export type ReactivePropertyDefinitionLoose = string | number | boolean | Array<any> | null | undefined | AnyConstructor | Binding | ReactivePropertyDefinition;
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
export declare class ReactiveProtoProperty {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect?: boolean;
    init?: any;
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
    constructor(def: ReactivePropertyDefinitionLoose);
    /**
     * Assigns values of another ReactiveProtoProperty to itself, unless they are default values.
     * @param {ReactiveProtoProperty} protoProp Source ReactiveProtoProperty
     */
    assign(protoProp: ReactiveProtoProperty): void;
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
export type ObservationType = 'none' | 'io' | 'object' | 'nodearray';
/**
 * Manages mutation observation state for a reactive property.
 * - 'none': Primitives (String, Number, Boolean) - no mutation observation
 * - 'io': Io types (ReactiveNode, IoElement subclasses) - observe on the value itself
 * - 'nodearray': NodeArray - registers as observer, receives mutations via self-listener
 * - 'object': Non-Io objects (Object, Array, etc.) - observe via window (global event bus)
 */
export declare class Observer {
    private readonly node;
    private _hasSelfMutationListener;
    private _hasWindowMutationListener;
    type: ObservationType;
    observing: boolean;
    constructor(node: ReactiveNode | IoElement);
    start(value: any): void;
    stop(value: any): void;
    dispose(): void;
}
/**
 * ReactivePropertyInstance object constructed from `ReactiveProtoProperty`.
 */
export declare class ReactivePropertyInstance {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding;
    reflect: boolean;
    init?: any;
    readonly observer: Observer;
    /**
     * Creates the property configuration object and copies values from `ReactiveProtoProperty`.
     * @param node owner ReactiveNode instance
     * @param propDef ReactiveProtoProperty object
     */
    constructor(node: ReactiveNode | IoElement, propDef: ReactiveProtoProperty);
}
//# sourceMappingURL=ReactiveProperty.d.ts.map