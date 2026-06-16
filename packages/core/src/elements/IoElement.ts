import { Property, ReactiveProperty } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { ProtoChain } from '../core/ProtoChain.js'
import { applyNativeElementProps, constructElement, disposeChildren, filterVDOMElements, VDOMElement, VDOMChild, toVDOM, NativeElementProps, clearNativeElementChildren, releaseSubtreeEventDispatchers, TEXT_TAG, getNodeVDOMTag } from '../vdom/VDOM.js'
import { ReactiveNode, ReactivityType, dispose, bind, unbind, dispatchMutation, onPropertyMutated, setProperty, dispatchQueue, setProperties, initReactiveProperties, initProperties, ReactivePropertyDefinitions, ListenerDefinitions, PropertyValues } from '../nodes/ReactiveNode.js'
import { addParent, initReactiveOwnerInternals, removeParent } from '../core/ReactiveCore.js'
import { Binding } from '../core/Binding.js'
import { applyElementStyleToDocument } from '../core/Style.js'
import type { EventDispatcher, AnyEventListener } from '../core/EventDispatcher.js'
import type { ChangeQueue } from '../core/ChangeQueue.js'
import { ReactivePropertyInstance } from '../core/ReactiveProperty.js'
import { throttle, debounce, CallbackFunction } from '../core/Queue.js'

interface ResizeObservable extends Element {
  onResized(): void
}

const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    (entry.target as ResizeObservable).onResized()
  }
})

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never
type AnyEventHandler = (
  (event: CustomEvent) => void) |
  ((event: PointerEvent) => void) |
  ((event: KeyboardEvent) => void) |
  ((event: MouseEvent) => void) |
  ((event: TouchEvent) => void) |
  ((event: WheelEvent) => void) |
  ((event: InputEvent) => void) |
  ((event: ClipboardEvent) => void) |
  ((event: DragEvent) => void) |
  ((event: FocusEvent) => void) |
  ((event: TransitionEvent) => void) |
  ((event: AnimationEvent) => void) |
  ((event: ErrorEvent) => void) |
  ((event: Event) => void)

export type IoElementProps = NativeElementProps & {
  reactivity?: ReactivityType
  [key: prefix<string, '@'>]: string | AnyEventHandler
}

/**
 * Base class for Io-Gui custom elements.
 *
 * IoElement extends `HTMLElement` with the same reactive property system as
 * {@link ReactiveNode}, plus virtual DOM rendering, inherited CSS via static
 * `Style`, and DOM event bridging through {@link EventDispatcher}.
 *
 * Elements render children with {@link IoElement.render} and declare structure
 * through VDOM helpers exported from `@io-gui/core`. Register elements with
 * {@link Register}; factory functions (for example `ioButton`) are generated
 * automatically for VDOM composition.
 *
 * @see ReactiveNode for non-DOM reactive objects
 */
@Register
export class IoElement extends HTMLElement {
  declare static vConstructor: (arg0?: IoElementProps | Array<VDOMChild> | string, arg1?: Array<VDOMChild> | string) => VDOMElement
  static get Style() {
    return /* css */`
      :host {
        display: block;
        box-sizing: border-box;
        -webkit-touch-callout: none;
      }
      :host[hidden] {
        display: none;
      }
      --io-unselectable: {
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      --io_focus: {
        border-color: var(--io_colorWhite) !important;
        outline: var(--io_borderWidth) solid var(--io_borderColorBlue) !important;
        z-index: 1;
      }
    `
  }

  @ReactiveProperty({type: String, value: 'immediate'})
  declare reactivity: ReactivityType

  @Property(Object)
  declare $: Record<string, HTMLElement | IoElement>

  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {}
  }

  static get Properties(): Record<string, unknown> {
    return {}
  }

  /**
   * Declares class-level event listeners wired at construction via {@link EventDispatcher}.
   * Subclass definitions replace parent handlers for the same event name (last wins).
   * Use {@link addEventListener} for additional listeners at runtime.
   */
  static get Listeners(): ListenerDefinitions {
    return {}
  }

  declare readonly _protochain: ProtoChain
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>
  declare readonly _bindings: Map<string, Binding<unknown>>
  declare readonly _changeQueue: ChangeQueue
  declare readonly _eventDispatcher: EventDispatcher
  declare _hasWindowMutationListener: boolean
  declare _hasSelfMutationListener: boolean
  declare readonly _children: Array<ReactiveNode | IoElement>
  declare readonly _parents: Array<ReactiveNode | IoElement>
  declare readonly _isIoElement: boolean
  declare _disposed: boolean
  declare _textNode: Text

  constructor(args: IoElementProps = {}) {
    super()
    this._protochain.init(this)

    initReactiveOwnerInternals(this)

    this.init()

    initReactiveProperties(this)
    initProperties(this)

    this.applyProperties(args, true)

    this.ready()
    this.dispatchQueue()
  }
  /** Applies constructor/render props; defers dispatch when `skipDispatch` is true. */
  applyProperties(props: PropertyValues, skipDispatch = false) {
    for (const name in props) {
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true)
      } else {
        if (name === 'class') {
          this.className = props[name] as string
        } else if (name === 'style') {
          const styleProps = props[name] as Record<string, string>
          for (const s in styleProps) {
            // TODO: Consider supporting importance
            this.style.setProperty(s, styleProps[s])
          }
        } else if (name.startsWith('data-')) {
          // TODO: Test this!
          if (props[name] === undefined) {
            this.removeAttribute(name)
          } else {
            this.setAttribute(name, props[name] as string | number | boolean)
          }
        } else if (!name.startsWith('@')) {
          debug: if (props[name] instanceof Binding) {
            console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on element "${this.localName}"`)
          }
          (this as Record<string, unknown>)[name] = props[name]
          // TODO: test and check if type can be attribute.
          if (props[name] === undefined && this.hasAttribute(name)) {
            this.removeAttribute(name)
          }
        }
      }
    }
    this._eventDispatcher.applyPropListeners(props)
    if (!skipDispatch) this.dispatchQueue()
  }
  // TODO: add types
  setProperties(props: PropertyValues) {
    setProperties(this, props)
  }
  setProperty(name: string, value: unknown, debounce = false) {
    if (this._disposed) return
    setProperty(this, name, value, debounce)
    const prop = this._reactiveProperties.get(name)!
    if (prop.reflect) this.setAttribute(name.toLowerCase(), value as string | number | boolean)
  }
  init() {}
  ready() {}
  changed() {}
  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
  queue(name: string, value: unknown, oldValue: unknown) {
    this._changeQueue.queue(name, value, oldValue)
  }
  dispatchQueue(debounce = false) {
    dispatchQueue(this, debounce)
  }
  throttle(func: CallbackFunction, arg?: unknown, timeout = 1) {
    throttle(func, arg, this, timeout)
  }
  debounce(func: CallbackFunction, arg?: unknown, timeout = 1) {
    debounce(func, arg, this, timeout)
  }
  onPropertyMutated(event: CustomEvent) {
    return onPropertyMutated(this, event)
  };
  dispatchMutation(object: object | ReactiveNode = this, properties: string[] = []) {
    dispatchMutation(this, object, properties)
  }
  bind<K extends keyof this & string>(name: K): Binding<this[K]>
  bind(name: string): Binding<unknown>
  bind(name: string): Binding<unknown> {
    return bind(this, name)
  }
  unbind<K extends keyof this & string>(name: K): void
  unbind(name: string): void
  unbind(name: string): void {
    unbind(this, name)
  }
  override addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    if (this._disposed) return
    this._eventDispatcher.addEventListener(type, listener as EventListener, options)
  }
  override removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    if (this._disposed) return
    this._eventDispatcher.removeEventListener(type, listener as EventListener, options)
  }
  dispatch(type: string, detail: unknown = undefined, bubbles = false, src?: ReactiveNode | HTMLElement | Document | Window) {
    if (this._disposed) return
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src)
  }
  addParent(parent: ReactiveNode | IoElement) {
    addParent(this, parent)
  }
  removeParent(parent: ReactiveNode | IoElement) {
    removeParent(this, parent)
  }
  /** Releases bindings, listeners, queues, and child elements. */
  dispose() {
    dispose(this)
  }

  connectedCallback() {
    if ('onResized' in this && typeof (this as ResizeObservable).onResized === 'function') {
      resizeObserver.observe(this)
    }
  }
  disconnectedCallback() {
    if ('onResized' in this && typeof (this as ResizeObservable).onResized === 'function') {
      resizeObserver.unobserve(this)
    }
  }

  /** Renders VDOM children into this element or optional host. */
  render(vDOMElements: Array<VDOMChild>, host?: HTMLElement | IoElement, skipDispose?: boolean) {
    const renderHost = host ?? this
    const vDOMElementsOnly = filterVDOMElements(vDOMElements)
    for (const id in this.$) delete this.$[id]
    this.traverse(vDOMElementsOnly, renderHost, skipDispose)
  }
  /** Reconciles VDOM tree into host; keyed when children specify `key`. */
  traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, skipDispose?: boolean) {
    this._reconcileChildren(vChildren, host, skipDispose)
    const childNodes = host.childNodes
    for (let i = 0; i < vChildren.length; i++) {
      const vChild = vChildren[i]
      const child = childNodes[i]
      if (vChild.tag === TEXT_TAG) continue
      const elementChild = child as HTMLElement | IoElement
      if (vChild.props?.id) {
        // Update this.$ map of ids.
        debug: {
          if (this.$[vChild.props!.id] !== undefined) {
            console.warn(`IoElement: Duplicate id in template. "${vChild.props!.id}"`)
          }
        }
        this.$[vChild.props!.id] = elementChild
      }
      if (vChild.children !== undefined) {
        if (typeof vChild.children === 'string') {
          // Set textNode value.
          this._flattenTextNode(elementChild as HTMLElement);
          (elementChild as IoElement)._textNode.nodeValue = String(vChild.children)
        } else if (vChild.children instanceof Array) {
          if (!(elementChild as IoElement)._isIoElement) {
            const vDOMElementsOnly = filterVDOMElements(vChild.children)
            this.traverse(vDOMElementsOnly, elementChild as HTMLElement, skipDispose)
          }
        }
      } else if (!(elementChild as IoElement)._isIoElement) {
        // Clear children for native elements. IoElements manage their own children by design
        clearNativeElementChildren(elementChild)
      }
    }
  }
  /**
   * Reconciles host children with vDOM children by position and tag name.
   * @param {Array} vChildren - Array of VDOMElements elements.
   * @param {HTMLElement} host - Template target.
   * @param {boolean} [skipDispose] - Detach removed/replaced nodes without calling dispose (for DOM caching).
   */
  _reconcileChildren(vChildren: VDOMElement[], host: HTMLElement | IoElement, skipDispose?: boolean) {
    const childNodes = host.childNodes
    // remove trailing nodes
    while (childNodes.length > vChildren.length) {
      const child = childNodes[childNodes.length - 1]
      host.removeChild(child)
      if (!skipDispose && child.nodeType === Node.ELEMENT_NODE) disposeChildren(child as IoElement)
    }
    // replace nodes
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i]
      const vChild = vChildren[i]
      // replace existing nodes
      if (getNodeVDOMTag(child) !== vChild.tag) {
        const oldNode = child
        const node = constructElement(vChild)
        host.insertBefore(node, oldNode)
        host.removeChild(oldNode)
        if (!skipDispose && oldNode.nodeType === Node.ELEMENT_NODE) disposeChildren(oldNode as IoElement)
      // update existing nodes
      } else if (vChild.tag === TEXT_TAG) {
        (child as Text).nodeValue = String(vChild.children ?? '')
      } else {
        this._updateElementProps(child as HTMLElement | IoElement, vChild)
      }
    }
    // create new nodes after existing
    if (childNodes.length < vChildren.length) {
      const frag = document.createDocumentFragment()
      for (let i = childNodes.length; i < vChildren.length; i++) {
        const node = constructElement(vChildren[i])
        frag.appendChild(node)
      }
      host.appendChild(frag)
    }
  }
  /**
   * Updates props of an existing element matched during reconciliation.
   * @param {HTMLElement | IoElement} child - Element to update.
   * @param {VDOMElement} vChild - Virtual DOM element to apply props from.
   */
  _updateElementProps(child: HTMLElement | IoElement, vChild: VDOMElement) {
    if (vChild.props) {
      if ((child as IoElement)._isIoElement) {
        // Set IoElement element properties
        (child as IoElement).applyProperties(vChild.props)
      } else {
        // Set native HTML element properties
        applyNativeElementProps(child as HTMLElement, vChild.props)
      }
    }
  }
  /**
  * Helper function to flatten textContent into a single TextNode.
  * Update textContent via TextNode is better for layout performance.
  * TODO: Consider using normalize()? Is it the same function?
  * @param {HTMLElement} element - Element to flatten.
  */
  _flattenTextNode(element: HTMLElement | IoElement) {
    if (element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''))
    }
    if (element.childNodes[0].nodeName !== '#text') {
      clearNativeElementChildren(element)
      element.appendChild(document.createTextNode(''))
    }
    (element as IoElement)._textNode = element.childNodes[0] as Text
    if (element.childNodes.length > 1) {
      const textContent = element.textContent
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) {
          const node = element.childNodes[i]
          if (node.nodeType === Node.ELEMENT_NODE) {
            releaseSubtreeEventDispatchers(node as HTMLElement)
          }
          element.removeChild(node)
        }
      }
      (element as IoElement)._textNode.nodeValue = textContent
    }
  }
  /**
  * Alias for HTMLElement setAttribute where falsey values remove the attribute.
  * @param {string} attr - Attribute name.
  * @param {*} value - Attribute value.
  */
  override setAttribute(attr: string, value: boolean | number | string) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '')
    } else if (value === false || value === '') {
      this.removeAttribute(attr)
    } else if (typeof value === 'string' || typeof value === 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, String(value))
    }
  }
  /**
   * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
   */
  toVDOM() {
    return toVDOM(this)
  }
  Register(ioNodeConstructor: typeof IoElement) {
    Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)})

    const localName = ioNodeConstructor.name.replace(/([a-z])([A-Z,0-9])/g, '$1-$2').toLowerCase()

    Object.defineProperty(ioNodeConstructor.prototype, 'localName', {value: localName})
    Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', {enumerable: false, value: true, writable: false})
    Object.defineProperty(window, ioNodeConstructor.name, {value: ioNodeConstructor})

    window.customElements.define(localName, ioNodeConstructor as unknown as CustomElementConstructor)

    applyElementStyleToDocument(localName, ioNodeConstructor.prototype._protochain.style)

    // TODO: Define all overloads with type guards.
    // TODO: Add runtime debug type checks.
    // TODO: Test thoroughly.
    Object.defineProperty(ioNodeConstructor, 'vConstructor', {value: function(arg0?: IoElementProps | Array<VDOMChild> | string, arg1?: Array<VDOMChild> | string): VDOMElement {
      const vDOMElement: VDOMElement = {tag: localName}
      if (arg0 !== undefined) {
        if (typeof arg0 === 'string') {
          vDOMElement.children = arg0
        } else if (arg0 instanceof Array) {
          vDOMElement.children = arg0
        } else if (typeof arg0 === 'object') {
          vDOMElement.props = arg0
        }
        if (arg1 !== undefined) {
          if (typeof arg1 === 'string') {
            vDOMElement.children = arg1
          } else if (arg1 instanceof Array) {
            vDOMElement.children = arg1
          }
        }
      }
      return vDOMElement
    }})
  }
}

export const ioElement = IoElement.vConstructor