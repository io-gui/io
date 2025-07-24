import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';

export type CallbackFunction = (arg?: any) => void;

interface QueueOptions {
  node: Node | IoElement | undefined;
  arg: any;
  frame: number;
}

let currentFrame = 0;

const queueSync: CallbackFunction[] = [];
const queue0: CallbackFunction[] = [];
const queue1: CallbackFunction[] = [];
const queueOptions0: WeakMap<CallbackFunction, QueueOptions> = new WeakMap();
const queueOptions1: WeakMap<CallbackFunction, QueueOptions> = new WeakMap();
let queue = queue0;
let queueOptions = queueOptions0;

/**
 * Returns a promise that resolves when the next frame is rendered.
 * Used for testing purposes.
 * @returns {Promise<void>}
 */
export async function nextQueue(): Promise<void> {
  return new Promise((resolve) => {
    queue.push(resolve);
    queueOptions.set(resolve, {
      arg: undefined,
      node: undefined,
      frame: currentFrame + 1,
    });
  });
}

/**
 * Throttles function execution once per frame (rAF).
 * @param {CallbackFunction} func - Function to throttle.
 * @param {*} [arg] - Optional argument for throttled function.
 * @param {Node | IoElement} [node] - Node instance.
 * @param {number} [delay] - Delay in frames.
 *
 * @example
 * throttle(someFunction, 'someArg', someNode);
 */
export function throttle(func: CallbackFunction, arg?: any, node?: Node | IoElement, delay = 1) {
  if (queueSync.indexOf(func) === -1) {
    queueSync.push(func);
    if (node?._disposed) return;
    try {
      func(arg);
    } catch (e) {
      console.error(e);
    }
    return;
  }
  if (queue.indexOf(func) === -1) {
    queue.push(func);
  }
  if (!queueOptions.has(func)) {
    queueOptions.set(func, {
      arg: arg,
      node: node,
      frame: currentFrame + delay,
    });
  } else {
    queueOptions.get(func)!.arg = arg;
  }
}

/**
 * Debounces function execution to next frame (rAF).
 * @param {CallbackFunction} func - Function to debounce.
 * @param {*} [arg] - Optional argument for debounced function.
 * @param {Node | IoElement} [node] - Node instance.
 * @param {number} [delay] - Delay in frames.
 *
 * @example
 * debounce(someFunction, 'someArg', someNode);
 */
export function debounce(func: CallbackFunction, arg?: any, node?: Node | IoElement, delay = 1) {
  if (queue.indexOf(func) === -1) {
    queue.push(func);
  }
  if (!queueOptions.has(func)) {
    queueOptions.set(func, {
      arg: arg,
      node: node,
      frame: currentFrame + delay,
    });
  } else {
    const options = queueOptions.get(func)!;
    options.arg = arg;
    options.node = node;
    options.frame = currentFrame + delay;
  }
}

/**
 * Executes the queue of throttled/debounced functions.
 * Internally it swaps between two queues to avoid allocating new queue items to a queue that is currently being executed.
 * Therfore, functions queued from another queued function will always move to the next queue.
 */
function executeQueue () {
  queueSync.length = 0;
  currentFrame++;

  const activeThrottleQueue = queue;
  const activeThrottleQueueOptions = queueOptions;
  queue = queue === queue0 ? queue1 : queue0;
  queueOptions = queueOptions === queueOptions0 ? queueOptions1 : queueOptions0;

  for (let i = 0; i < activeThrottleQueue.length; i++) {
    const func = activeThrottleQueue[i];
    const options = activeThrottleQueueOptions.get(func)!;
    activeThrottleQueueOptions.delete(func);

    if (options === undefined) {
      console.warn(func);
    }
    if (options.frame > currentFrame) {
      if (queue.indexOf(func) === -1) {
        queue.push(func);
      }
      queueOptions.set(func, options);
      continue;
    }

    if (options.node?._disposed) continue;
    try {
      if (options.arg !== undefined) func(options.arg);
      else func();
    } catch (e) {
      console.error(e);
    }
  }
  activeThrottleQueue.length = 0;
  requestAnimationFrame(executeQueue);
}
requestAnimationFrame(executeQueue);