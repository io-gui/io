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

class MockElement {
  localName: string
  tagName: string
  className = ''
  style: Record<string, string> = {}
  textContent = ''
  children: MockElement[] = []
  childNodes: MockElement[] = []
  attributes: Record<string, string> = {}

  constructor(tag = 'div') {
    this.localName = tag
    this.tagName = tag.toUpperCase()
  }

  appendChild(child: MockElement) {
    this.children.push(child)
    this.childNodes.push(child)
    return child
  }

  removeChild(child: MockElement) {
    const index = this.children.indexOf(child)
    if (index !== -1) {
      this.children.splice(index, 1)
      this.childNodes.splice(index, 1)
    }
    return child
  }

  insertBefore(newEl: MockElement, ref: MockElement) {
    const index = this.children.indexOf(ref)
    if (index === -1) return this.appendChild(newEl)
    this.children.splice(index, 0, newEl)
    this.childNodes.splice(index, 0, newEl)
    return newEl
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = value
  }

  removeAttribute(name: string) {
    delete this.attributes[name]
  }

  getAttribute(name: string) {
    return this.attributes[name] ?? null
  }

  hasAttribute(name: string) {
    return Object.hasOwn(this.attributes, name)
  }

  addEventListener() {}
  removeEventListener() {}
  querySelectorAll() { return [] }
}

const customElementRegistry = new Map<string, CustomElementConstructor>()
const g = globalThis as typeof globalThis & {
  window: Window & typeof globalThis
  self: Window & typeof globalThis
  document: Document
  customElements: CustomElementRegistry
  localStorage: Storage
  CSSStyleSheet: typeof CSSStyleSheet
  HTMLElement: typeof HTMLElement
  Node: typeof Node
  EventTarget: typeof EventTarget
}

if (typeof g.window === 'undefined') {
  g.window = globalThis as Window & typeof globalThis
}

if (typeof g.self === 'undefined') {
  g.self = g.window
}

if (typeof g.addEventListener !== 'function') {
  g.addEventListener = () => {}
  g.removeEventListener = () => {}
  g.dispatchEvent = () => true
}

if (typeof g.window.matchMedia !== 'function') {
  g.window.matchMedia = (() => ({
    matches: false,
    media: '',
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return true },
  })) as typeof window.matchMedia
}

if (typeof g.localStorage === 'undefined') {
  const store = new Map<string, string>()
  g.localStorage = {
    get length() { return store.size },
    key(index: number) { return [...store.keys()][index] ?? null },
    getItem(key: string) { return store.has(key) ? store.get(key)! : null },
    setItem(key: string, value: string) { store.set(key, String(value)) },
    removeItem(key: string) { store.delete(key) },
    clear() { store.clear() },
  }
}

if (typeof g.location === 'undefined') {
  g.location = { hash: '' } as Location
}

if (typeof g.customElements === 'undefined') {
  g.customElements = {
    define(name: string, ctor: CustomElementConstructor) {
      customElementRegistry.set(name, ctor)
    },
    get(name: string) {
      return customElementRegistry.get(name)
    },
    whenDefined(name: string) {
      const ctor = customElementRegistry.get(name)
      return ctor ? Promise.resolve(ctor) : Promise.reject(new Error(`Unknown element: ${name}`))
    },
  } as CustomElementRegistry
}

if (typeof g.document === 'undefined') {
  g.document = {
    adoptedStyleSheets: [],
    body: { style: { setProperty() {} } },
    createElement(tag: string) {
      return new MockElement(tag) as unknown as HTMLElement
    },
    createDocumentFragment() {
      return new MockElement('fragment') as unknown as DocumentFragment
    },
    createTextNode(text: string) {
      return { nodeValue: text, nodeName: '#text', nodeType: 3 } as unknown as Text
    },
  } as unknown as Document
}

if (typeof g.CSSStyleSheet === 'undefined') {
  g.CSSStyleSheet = class CSSStyleSheet {
    cssRules = [{ style: { setProperty() {} } }]
    replaceSync() {}
  } as unknown as typeof CSSStyleSheet
}

if (typeof g.HTMLElement === 'undefined') {
  g.HTMLElement = MockElement as unknown as typeof HTMLElement
}

if (typeof g.Node === 'undefined') {
  g.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 } as unknown as typeof Node
}

if (typeof g.EventTarget === 'undefined') {
  g.EventTarget = class EventTarget {
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true }
  } as typeof EventTarget
}
