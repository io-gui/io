import { IoNode } from "../node";

export type CallbackFunction = (arg?: any) => void;


interface QueueOptions {
  node: IoNode | undefined;
  arg: any;
  timeout: number;
}

const queueSync: CallbackFunction[] = [];
const queue0: CallbackFunction[] = [];
const queue1: CallbackFunction[] = [];
const queueOptions0: WeakMap<CallbackFunction, QueueOptions> = new WeakMap();
const queueOptions1: WeakMap<CallbackFunction, QueueOptions> = new WeakMap();
let queue = queue0;
let queueOptions = queueOptions0;

export async function nextQueue(): Promise<void> {
  return new Promise((resolve) => {
    queue.push(resolve);
    queueOptions.set(resolve, {
      arg: undefined,
      timeout: Date.now() + 1,
      node: undefined,
    });
  });
}

export function throttle(node: IoNode, func: CallbackFunction, arg: any = undefined, timeout = 1) {
  if (timeout === 0) {
    if (queueSync.indexOf(func) === -1) {
      queueSync.push(func);
      try {
        func(arg);
      } catch (e) {
        console.error(e);
      }
      return;
    } else {
      timeout = 1;
    }
  }
  if (queue.indexOf(func) === -1) {
    queue.push(func);
  }
  if (!queueOptions.has(func)) {
    queueOptions.set(func, {
      node: node,
      arg: arg,
      timeout: Date.now() + timeout,
    });
  } else {
    queueOptions.get(func)!.arg = arg;
  }
}

function executeQueue () {
  queueSync.length = 0;

  const activeThrottleQueue = queue;
  const activeThrottleQueueOptions = queueOptions;
  queue = queue === queue0 ? queue1 : queue0;
  queueOptions = queueOptions === queueOptions0 ? queueOptions1 : queueOptions0;

  const time = Date.now();
  for (let i = 0; i < activeThrottleQueue.length; i++) {
    const func = activeThrottleQueue[i];
    const options = activeThrottleQueueOptions.get(func)!;
    activeThrottleQueueOptions.delete(func);

    if (options === undefined) {
      console.warn(func);
    }
    if (options.timeout > time) {
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