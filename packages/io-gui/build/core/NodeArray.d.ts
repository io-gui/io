import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';
export declare class NodeArray<N extends Node> extends Array<N> {
    node: Node | IoElement;
    private proxy;
    private _isInternalOperation;
    static get [Symbol.species](): ArrayConstructor;
    constructor(node: Node | IoElement, ...args: any[]);
    withInternalOperation<T>(operation: () => T, dispatch?: boolean): T;
    splice(start: number, deleteCount: number, ...items: N[]): N[];
    push(...items: N[]): number;
    unshift(...items: N[]): number;
    pop(): N | undefined;
    shift(): N | undefined;
    reverse(): N[];
    sort(compareFn?: (a: N, b: N) => number): this;
    fill(): this;
    copyWithin(): this;
    itemMutated(event: CustomEvent): void;
    dispatchMutation(): void;
}
//# sourceMappingURL=NodeArray.d.ts.map