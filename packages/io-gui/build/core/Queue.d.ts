import { Node } from '../nodes/Node';
export type CallbackFunction = (arg?: any) => void;
export declare function nextQueue(): Promise<void>;
export declare function throttle(node: Node, func: CallbackFunction, arg?: any, timeout?: number): void;
//# sourceMappingURL=Queue.d.ts.map