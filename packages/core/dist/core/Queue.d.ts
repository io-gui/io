import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';
export type CallbackFunction = (arg?: any) => void;
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
export declare function throttle(func: CallbackFunction, arg?: any, node?: Node | IoElement, delay?: number): void;
export declare function debounce(func: CallbackFunction, arg?: any, node?: Node | IoElement, delay?: number): void;
//# sourceMappingURL=Queue.d.ts.map