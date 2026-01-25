import { ReactiveNode } from '../nodes/ReactiveNode.js';
import { IoElement } from '../elements/IoElement.js';
export declare class NodeArray<N extends ReactiveNode> extends Array<N> {
    node: ReactiveNode | IoElement;
    private proxy;
    private _isInternalOperation;
    private _observers;
    static get [Symbol.species](): ArrayConstructor;
    constructor(node: ReactiveNode | IoElement, ...args: any[]);
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
    addObserver(node: ReactiveNode | IoElement): void;
    removeObserver(node: ReactiveNode | IoElement): void;
    itemMutated(event: CustomEvent): void;
    dispatchMutation(): void;
}
//# sourceMappingURL=NodeArray.d.ts.map