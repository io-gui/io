import type { ReactiveNode } from './ReactiveCore.js';
export type CallbackFunction = (arg?: unknown) => void;
/**
 * Returns a promise that resolves when the next frame is rendered.
 * @returns {Promise<void>}
 */
export declare function nextFrame(): Promise<void>;
/**
 * Throttles function execution with leading + trailing edge semantics.
 * - Executes immediately on first call (leading edge)
 * - Queues trailing call with latest argument
 * - Respects delay between executions
 */
export declare function throttle(func: CallbackFunction, arg?: unknown, node?: ReactiveNode, delay?: number): void;
export declare function debounce(func: CallbackFunction, arg?: unknown, node?: ReactiveNode, delay?: number): void;
/**
 * Removes pending callbacks for a specified node.
 */
export declare function clearNodeCallbacks(node: ReactiveNode): void;
