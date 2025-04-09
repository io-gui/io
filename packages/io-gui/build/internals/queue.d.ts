import { IoNode } from '../nodes/node';
export type CallbackFunction = (arg?: any) => void;
export declare function nextQueue(): Promise<void>;
export declare function throttle(node: IoNode, func: CallbackFunction, arg?: any, timeout?: number): void;
//# sourceMappingURL=queue.d.ts.map