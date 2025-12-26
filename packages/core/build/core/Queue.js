let currentFrame = 0;
const queueSync = [];
const queue0 = [];
const queue1 = [];
const queueOptions0 = new WeakMap();
const queueOptions1 = new WeakMap();
let queue = queue0;
let queueOptions = queueOptions0;
/**
 * Returns a promise that resolves when the next frame is rendered.
 * Used for testing purposes.
 * @returns {Promise<void>}
 */
export async function nextQueue() {
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
export function throttle(func, arg, node, delay = 1) {
    if (queue.indexOf(func) === -1) {
        queue.push(func);
    }
    if (!queueOptions.has(func)) {
        queueOptions.set(func, {
            arg: arg,
            node: node,
            frame: currentFrame + delay,
        });
    }
    else {
        const options = queueOptions.get(func);
        options.arg = arg;
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
export function debounce(func, arg, node, delay = 1) {
    if (queue.indexOf(func) === -1) {
        queue.push(func);
    }
    if (!queueOptions.has(func)) {
        queueOptions.set(func, {
            arg: arg,
            node: node,
            frame: currentFrame + delay,
        });
    }
    else {
        const options = queueOptions.get(func);
        options.arg = arg;
        options.frame = currentFrame + delay;
    }
}
/**
 * Executes the queue of throttled/debounced functions.
 * Internally it swaps between two queues to avoid allocating new queue items to a queue that is currently being executed.
 * Therfore, functions queued from another queued function will always move to the next queue.
 */
function executeQueue() {
    currentFrame++;
    const activeQueue = queue;
    const activeQueueOptions = queueOptions;
    queue = queue === queue0 ? queue1 : queue0;
    queueOptions = queueOptions === queueOptions0 ? queueOptions1 : queueOptions0;
    for (let i = 0; i < activeQueue.length; i++) {
        const func = activeQueue[i];
        const options = activeQueueOptions.get(func);
        activeQueueOptions.delete(func);
        if (options === undefined) {
            console.warn(func);
            continue;
        }
        if (options.frame > currentFrame) {
            if (queue.indexOf(func) === -1) {
                queue.push(func);
            }
            if (!queueOptions.has(func)) {
                queueOptions.set(func, options);
            }
            continue;
        }
        if (options.node?._disposed)
            continue;
        try {
            if (options.arg !== undefined)
                func(options.arg);
            else
                func();
        }
        catch (e) {
            console.error(e);
        }
    }
    queueSync.length = 0;
    activeQueue.length = 0;
    requestAnimationFrame(executeQueue);
}
requestAnimationFrame(executeQueue);
//# sourceMappingURL=Queue.js.map