let currentFrame = 0;
const queue0 = new Map();
const queue1 = new Map();
let queue = queue0;
// Key registry - shared across both buffers
const keysByNode = new WeakMap();
const keysByFunc = new Map();
// Throttle: tracks when each node+func can next execute immediately
const throttleNextFrame = new WeakMap();
const throttleNextFrameGlobal = new Map();
function getKey(func, node) {
    if (node) {
        let funcMap = keysByNode.get(node);
        if (!funcMap) {
            funcMap = new Map();
            keysByNode.set(node, funcMap);
        }
        let key = funcMap.get(func);
        if (!key) {
            key = { node, func };
            funcMap.set(func, key);
        }
        return key;
    }
    else {
        let key = keysByFunc.get(func);
        if (!key) {
            key = { node: undefined, func };
            keysByFunc.set(func, key);
        }
        return key;
    }
}
/**
 * Returns a promise that resolves when the next frame is rendered.
 * @returns {Promise<void>}
 */
export async function nextQueue() {
    return new Promise((resolve) => {
        const key = getKey(resolve, undefined);
        queue.set(key, { arg: undefined, frame: currentFrame + 1 });
    });
}
/**
 * Throttles function execution with leading + trailing edge semantics.
 * - Executes immediately on first call (leading edge)
 * - Queues trailing call with latest argument
 * - Respects delay between executions
 */
export function throttle(func, arg, node, delay = 1) {
    if (node?._disposed)
        return;
    const key = getKey(func, node);
    // Check if we can execute immediately (leading edge)
    let nextAllowed;
    if (node) {
        nextAllowed = throttleNextFrame.get(node)?.get(func) ?? -Infinity;
    }
    else {
        nextAllowed = throttleNextFrameGlobal.get(func) ?? -Infinity;
    }
    if (currentFrame >= nextAllowed) {
        if (node) {
            let funcMap = throttleNextFrame.get(node);
            if (!funcMap) {
                funcMap = new Map();
                throttleNextFrame.set(node, funcMap);
            }
            funcMap.set(func, currentFrame + delay);
        }
        else {
            throttleNextFrameGlobal.set(func, currentFrame + delay);
        }
        try {
            if (arg !== undefined)
                func(arg);
            else
                func();
        }
        catch (e) {
            console.error(e);
        }
        // Queue trailing call (will execute after delay)
        queue.set(key, { arg, frame: currentFrame + delay });
    }
    else {
        // Within delay period - only update arg, don't postpone
        const existing = queue.get(key);
        if (existing) {
            existing.arg = arg;
        }
    }
}
export function debounce(func, arg, node, delay = 1) {
    const key = getKey(func, node);
    queue.set(key, { arg, frame: currentFrame + delay });
}
function executeQueue() {
    currentFrame++;
    const activeQueue = queue;
    queue = queue === queue0 ? queue1 : queue0;
    for (const [key, options] of activeQueue) {
        // Re-queue if target frame not reached
        if (options.frame > currentFrame) {
            if (!queue.has(key)) {
                queue.set(key, options);
            }
            continue;
        }
        if (key.node?._disposed)
            continue;
        try {
            if (options.arg !== undefined)
                key.func(options.arg);
            else
                key.func();
        }
        catch (e) {
            console.error(e);
        }
    }
    activeQueue.clear();
    requestAnimationFrame(executeQueue);
}
requestAnimationFrame(executeQueue);
//# sourceMappingURL=Queue.js.map