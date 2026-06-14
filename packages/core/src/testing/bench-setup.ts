if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) =>
    setTimeout(() => callback(performance.now()), 0) as unknown as number
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id)
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver
}

if (typeof globalThis.HTMLElement === 'undefined') {
  globalThis.HTMLElement = class HTMLElement {} as typeof HTMLElement
}
