"use strict";
if (typeof globalThis.requestAnimationFrame === 'undefined') {
    globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 0);
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}
if (typeof globalThis.HTMLElement === 'undefined') {
    globalThis.HTMLElement = class HTMLElement {
    };
}
//# sourceMappingURL=bench-setup.js.map