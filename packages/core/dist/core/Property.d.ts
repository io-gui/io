import { Binding } from './Binding.js';
import { type ReactiveNode } from './ReactiveCore.js';
import { AnyConstructor } from '../nodes/ReactiveObject.js';
export type PropertyDefinition = {
    value?: unknown;
    type?: AnyConstructor;
    binding?: Binding<unknown>;
    reflect?: boolean;
    init?: unknown;
};
export type PropertyDefinitionLoose = string | number | boolean | unknown[] | null | undefined | AnyConstructor | Binding<unknown> | PropertyDefinition;
/** Normalized reactive property definition merged from decorators and static getters. */
export declare class ProtoProperty {
    value?: unknown;
    type?: AnyConstructor;
    binding?: Binding<unknown>;
    reflect?: boolean;
    init?: unknown;
    /**
     * Creates a property definition from various input types.
     * @param {PropertyDefinitionLoose} def Input definition which can be:
     * - `undefined` or `null`: Sets as value
     * - `AnyConstructor`: Sets as type
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
    toJSON(): {
        value?: unknown;
        type?: AnyConstructor | string;
        reflect?: boolean;
        init?: unknown;
        binding?: Binding<unknown>;
    };
}
export type ObservationType = 'none' | 'io' | 'object' | 'nodearray';
export declare function ensureWindowMutationListener(node: ReactiveNode): void;
export declare function removeWindowMutationListener(node: ReactiveNode): void;
export declare function ensureSelfMutationListener(node: ReactiveNode): void;
export declare function removeSelfMutationListener(node: ReactiveNode): void;
/**
 * Tracks mutation observation mode and listener wiring for one reactive property.
 * @see ObservationType
 */
export declare class Observer {
    private readonly node;
    type: ObservationType;
    observing: boolean;
    constructor(node: ReactiveNode);
    start(value: unknown): void;
    stop(value: unknown): void;
    dispose(): void;
}
/** Runtime reactive property: value, type, binding, reflect, and mutation observer. */
export declare class PropertyInstance {
    value?: unknown;
    type?: AnyConstructor;
    binding?: Binding<unknown>;
    reflect: boolean;
    init?: unknown;
    readonly observer: Observer;
    /**
     * Creates the property configuration object and copies values from `ProtoProperty`.
     * @param node owner ReactiveObject instance
     * @param propDef ProtoProperty object
     */
    constructor(node: ReactiveNode, propDef: ProtoProperty);
}
