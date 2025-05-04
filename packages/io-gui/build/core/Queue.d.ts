import { Node } from '../nodes/Node';
export type CallbackFunction = (arg?: any) => void;
/**
 * Returns a promise that resolves when the next frame is rendered.
 * @returns {Promise<void>}
 */
export declare function nextQueue(): Promise<void>;
/**
 * Throttles function execution once per frame (rAF).
 * @param {CallbackFunction} func - Function to throttle.
 * @param {*} [arg] - Optional argument for throttled function.
 * @param {Node} [node] - Node instance.
 * @param {number} [delay] - Delay in frames.
 */
export declare function throttle(func: CallbackFunction, arg?: any, node?: Node, delay?: number): void;
/**
 * Debounces function execution to next frame (rAF).
 * @param {CallbackFunction} func - Function to debounce.
 * @param {*} [arg] - Optional argument for debounced function.
 * @param {Node} [node] - Node instance.
 * @param {number} [delay] - Delay in frames.
 */
export declare function debounce(func: CallbackFunction, arg?: any, node?: Node, delay?: number): void;
//# sourceMappingURL=Queue.d.ts.map