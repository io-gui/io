import { ReactiveNode } from '../nodes/ReactiveNode.js';
import { IoElement } from '../elements/IoElement.js';
export type CallbackFunction = (arg?: unknown) => void;
/**
 * Returns a promise that resolves when the next frame is rendered.
 * @returns {Promise<void>}
 */
export declare function nextQueue(): Promise<void>;
/**
 * Throttles function execution with leading + trailing edge semantics.
 * - Executes immediately on first call (leading edge)
 * - Queues trailing call with latest argument
 * - Respects delay between executions
 */
export declare function throttle(func: CallbackFunction, arg?: unknown, node?: ReactiveNode | IoElement, delay?: number): void;
export declare function debounce(func: CallbackFunction, arg?: unknown, node?: ReactiveNode | IoElement, delay?: number): void;
/**
 * Removes pending queue and throttle state for a disposed node.
 */
export declare function clearNodeQueue(node: ReactiveNode | IoElement): void;
//# sourceMappingURL=Queue.d.ts.map