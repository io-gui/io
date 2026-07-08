let currentFrame = 0;
const bufferA = new Map();
const bufferB = new Map();
let nextBuffer = bufferA;
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
export async function nextFrame() {
    return new Promise((resolve) => {
        const callback = () => resolve();
        const key = getKey(callback, undefined);
        nextBuffer.set(key, { arg: undefined, frame: currentFrame + 1 });
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
        nextBuffer.set(key, { arg, frame: currentFrame + delay });
    }
    else {
        // Within delay period - only update arg, don't postpone
        const existing = nextBuffer.get(key);
        if (existing) {
            existing.arg = arg;
        }
    }
}
export function debounce(func, arg, node, delay = 1) {
    const key = getKey(func, node);
    nextBuffer.set(key, { arg, frame: currentFrame + delay });
}
/**
 * Removes pending callbacks for a specified node.
 */
export function clearNodeCallbacks(node) {
    for (const buffer of [bufferA, bufferB]) {
        for (const [key] of buffer) {
            if (key.node === node)
                buffer.delete(key);
        }
    }
    keysByNode.delete(node);
    throttleNextFrame.delete(node);
}
function advanceFrame() {
    currentFrame++;
    const currentBuffer = nextBuffer;
    nextBuffer = nextBuffer === bufferA ? bufferB : bufferA;
    for (const [key, options] of currentBuffer) {
        // Move callback to next frame if target frame not reached
        if (options.frame > currentFrame) {
            if (!nextBuffer.has(key)) {
                nextBuffer.set(key, options);
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
    currentBuffer.clear();
    requestAnimationFrame(advanceFrame);
}
requestAnimationFrame(advanceFrame);
