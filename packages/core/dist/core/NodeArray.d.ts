import { JsonArray, ReactiveObject } from '../nodes/ReactiveObject.js';
import { type ReactiveNode } from './ReactiveCore.js';
/**
 * Reactive array of {@link ReactiveObject} items owned by a parent node or element.
 *
 * Use `NodeArray` as the type for reactive properties that hold collections of child
 * nodes (for example `MenuOption.options`). The constructor registers the owner as
 * an observer; mutating methods (`push`, `splice`, indexed assignment, etc.) wire
 * parent/child links and dispatch `io-object-mutation` on the owner so change
 * handlers like `optionsMutated()` run automatically.
 *
 * Items must be {@link ReactiveObject} instances. The returned value from the
 * constructor is a proxied array — always use that reference, not the raw instance.
 *
 * @example
 * ```ts
 * @Property({ type: NodeArray, init: null })
 * declare options: NodeArray<MenuOption>
 * ```
 */
export declare class NodeArray<N extends ReactiveObject> extends Array<N> {
    node: ReactiveObject;
    private proxy;
    private _isInternalOperation;
    private _observers;
    static get [Symbol.species](): ArrayConstructor;
    /** @param node Owner that receives mutation events for this collection. */
    constructor(node: ReactiveObject, ...args: N[]);
    /** Run array mutations without dispatching `io-object-mutation` until complete. */
    withInternalOperation<T>(operation: () => T): T;
    splice(start: number, deleteCount: number, ...items: N[]): N[];
    push(...items: N[]): number;
    unshift(...items: N[]): number;
    pop(): N | undefined;
    shift(): N | undefined;
    reverse(): N[];
    sort(compareFn?: (a: N, b: N) => number): this;
    fill(value: N, start?: number, end?: number): this;
    copyWithin(target: number, start?: number, end?: number): this;
    /** Register an additional node to receive mutation events from this array. */
    addObserver(node: ReactiveNode): void;
    /** Stop delivering mutation events to a previously registered observer. */
    removeObserver(node: ReactiveNode): void;
    itemMutated(event: CustomEvent): void;
    dispatchMutation(): void;
    /** Serialize each item via its own {@link ReactiveObject.toJSON}. */
    toJSON(): JsonArray;
    /** Hydrate each item from wire-format JSON via {@link ReactiveObject.applyJSON}. */
    applyJSON(json: JsonArray): void;
    dispose(): void;
}
