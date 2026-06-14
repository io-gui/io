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
class MockElement {
    constructor(tag = 'div') {
        this.localName = tag;
        this.tagName = tag.toUpperCase();
        this.className = '';
        this.style = {};
        this.textContent = '';
        this.children = [];
        this.childNodes = [];
        this.attributes = {};
    }
    appendChild(child) {
        this.children.push(child);
        this.childNodes.push(child);
        return child;
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            this.childNodes.splice(index, 1);
        }
        return child;
    }
    insertBefore(newEl, ref) {
        const index = this.children.indexOf(ref);
        if (index === -1)
            return this.appendChild(newEl);
        this.children.splice(index, 0, newEl);
        this.childNodes.splice(index, 0, newEl);
        return newEl;
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    removeAttribute(name) {
        delete this.attributes[name];
    }
    getAttribute(name) {
        return this.attributes[name] ?? null;
    }
    hasAttribute(name) {
        return Object.hasOwn(this.attributes, name);
    }
    addEventListener() { }
    removeEventListener() { }
    querySelectorAll() { return []; }
}
const customElementRegistry = new Map();
if (typeof globalThis.window === 'undefined') {
    globalThis.window = globalThis;
}
if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
}
if (typeof globalThis.addEventListener !== 'function') {
    globalThis.addEventListener = () => { };
    globalThis.removeEventListener = () => { };
    globalThis.dispatchEvent = () => true;
}
if (typeof globalThis.window.matchMedia !== 'function') {
    globalThis.window.matchMedia = () => ({ matches: false, addEventListener() { }, removeEventListener() { } });
}
if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map();
    globalThis.localStorage = {
        getItem(key) { return store.has(key) ? store.get(key) : null; },
        setItem(key, value) { store.set(key, String(value)); },
        removeItem(key) { store.delete(key); },
        clear() { store.clear(); },
    };
}
if (typeof globalThis.customElements === 'undefined') {
    globalThis.customElements = {
        define(name, ctor) {
            customElementRegistry.set(name, ctor);
        },
        get(name) {
            return customElementRegistry.get(name);
        },
        whenDefined(name) {
            return customElementRegistry.has(name) ? Promise.resolve() : Promise.reject();
        },
    };
}
if (typeof globalThis.document === 'undefined') {
    globalThis.document = {
        adoptedStyleSheets: [],
        body: { style: { setProperty() { } } },
        createElement(tag) {
            return new MockElement(tag);
        },
        createDocumentFragment() {
            return new MockElement('fragment');
        },
        createTextNode(text) {
            return { nodeValue: text, nodeName: '#text', nodeType: 3 };
        },
    };
}
if (typeof globalThis.CSSStyleSheet === 'undefined') {
    globalThis.CSSStyleSheet = class CSSStyleSheet {
        constructor() {
            this.cssRules = [{ style: { setProperty() { } } }];
        }
        replaceSync() { }
    };
}
if (typeof globalThis.HTMLElement === 'undefined') {
    globalThis.HTMLElement = MockElement;
}
if (typeof globalThis.Node === 'undefined') {
    globalThis.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };
}
if (typeof globalThis.EventTarget === 'undefined') {
    globalThis.EventTarget = class EventTarget {
        addEventListener() { }
        removeEventListener() { }
        dispatchEvent() { return true; }
    };
}
//# sourceMappingURL=bench-setup.js.map