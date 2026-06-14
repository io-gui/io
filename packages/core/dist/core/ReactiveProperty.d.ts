import { Binding } from './Binding.js';
import { AnyConstructor, ReactiveNode } from '../nodes/ReactiveNode.js';
import { IoElement } from '../elements/IoElement.js';
export type ReactivePropertyDefinition = {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding<unknown>;
    reflect?: boolean;
    init?: any;
};
export type ReactivePropertyDefinitionLoose = string | number | boolean | Array<any> | null | undefined | AnyConstructor | Binding<unknown> | ReactivePropertyDefinition;
/** Normalized reactive property definition merged from decorators and static getters. */
export declare class ReactiveProtoProperty {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding<unknown>;
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
export declare function ensureWindowMutationListener(node: ReactiveNode | IoElement): void;
export declare function removeWindowMutationListener(node: ReactiveNode | IoElement): void;
export declare function ensureSelfMutationListener(node: ReactiveNode | IoElement): void;
export declare function removeSelfMutationListener(node: ReactiveNode | IoElement): void;
/**
 * Tracks mutation observation mode and listener wiring for one reactive property.
 * @see ObservationType
 */
export declare class Observer {
    private readonly node;
    type: ObservationType;
    observing: boolean;
    constructor(node: ReactiveNode | IoElement);
    start(value: any): void;
    stop(value: any): void;
    dispose(): void;
}
/** Runtime reactive property: value, type, binding, reflect, and mutation observer. */
export declare class ReactivePropertyInstance {
    value?: any;
    type?: AnyConstructor;
    binding?: Binding<unknown>;
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