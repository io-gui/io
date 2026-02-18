import { Property, ReactiveProperty } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { ProtoChain } from '../core/ProtoChain.js'
import { applyNativeElementProps, constructElement, disposeChildren, VDOMElement, toVDOM, NativeElementProps } from '../vdom/VDOM.js'
import { ReactiveNode, ReactivityType, dispose, bind, unbind, dispatchMutation, onPropertyMutated, setProperty, dispatchQueue, setProperties, initReactiveProperties, initProperties, ReactivePropertyDefinitions, ListenerDefinitions } from '../nodes/ReactiveNode.js'
import { Binding } from '../core/Binding.js'
import { applyElementStyleToDocument } from '../core/Style.js'
import { EventDispatcher, AnyEventListener } from '../core/EventDispatcher.js'
import { ChangeQueue } from '../core/ChangeQueue.js'
import { ReactivePropertyInstance } from '../core/ReactiveProperty.js'
import { throttle, debounce, CallbackFunction } from '../core/Queue.js'

const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) {
    (entry.target as any).onResized()
  }
})

type prefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never
type AnyEventHandler = ((event: CustomEvent<any>) => void) |
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

@Register
export class IoElement extends HTMLElement {
  declare static vConstructor: (arg0?: IoElementProps |
    Array<VDOMElement | null> |
    string, arg1?: Array<VDOMElement | null> |
    string) => VDOMElement
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
      --unselectable: {
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

  static get Properties(): Record<string, any> {
    return {}
  }

  static get Listeners(): ListenerDefinitions {
    return {}
  }

  declare readonly _protochain: ProtoChain
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>
  declare readonly _bindings: Map<string, Binding>
  declare readonly _changeQueue: ChangeQueue
  declare readonly _eventDispatcher: EventDispatcher
  declare _hasWindowMutationListener: boolean
  declare _hasSelfMutationListener: boolean
  declare readonly _isIoElement: boolean
  declare _disposed: boolean
  declare _textNode: Text

  constructor(args: IoElementProps = {}) {
    super()
    this._protochain.init(this)

    Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)})
    Object.defineProperty(this, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()})
    Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()})
    Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)})
    Object.defineProperty(this, '_hasWindowMutationListener', {enumerable: false, configurable: true, writable: true, value: false})
    Object.defineProperty(this, '_hasSelfMutationListener', {enumerable: false, configurable: true, writable: true, value: false})
    // Object.defineProperty(this, '_parents', {enumerable: false, configurable: true, value: []});

    this.init()

    initReactiveProperties(this)
    initProperties(this)

    this.applyProperties(args, true)

    this.ready()
    this.dispatchQueue()
  }
  // TODO: add types
  applyProperties(props: any, skipDispatch = false) {
    for (const name in props) {
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true)
      } else {
        if (name === 'class') {
          this.className = props[name]
        } else if (name === 'style') {
          for (const s in props[name]) {
            // TODO: Consider supporting importance
            this.style[s as any] = props[name][s]
          }
        } else if (name.startsWith('data-')) {
          // TODO: Test this!
          if (props[name] === undefined) {
            this.removeAttribute(name)
          } else {
            this.setAttribute(name, props[name])
          }
        } else if (!name.startsWith('@')) {
          debug: if (props[name] as any instanceof Binding) {
            console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on element "${this.localName}"`)
          }
          this[name as keyof this] = props[name]
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
  setProperties(props: any) {
    setProperties(this, props)
  }
  setProperty(name: string, value: any, debounce = false) {
    if (this._disposed) return
    setProperty(this, name, value, debounce)
    const prop = this._reactiveProperties.get(name)!
    if (prop.reflect) this.setAttribute(name.toLowerCase(), value)
  }
  init() {}
  ready() {}
  changed() {}
  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
  queue(name: string, value: any, oldValue: any) {
    this._changeQueue.queue(name, value, oldValue)
  }
  dispatchQueue(debounce = false) {
    dispatchQueue(this, debounce)
  }
  throttle(func: CallbackFunction, arg?: any, timeout = 1) {
    throttle(func, arg, this, timeout)
  }
  debounce(func: CallbackFunction, arg?: any, timeout = 1) {
    debounce(func, arg, this, timeout)
  }
  onPropertyMutated(event: CustomEvent) {
    return onPropertyMutated(this, event)
  };
  dispatchMutation(object: object | ReactiveNode = this, properties: string[] = []) {
    dispatchMutation(this, object, properties)
  }
  bind(name: string): Binding {
    return bind(this, name)
  }
  unbind(name: string): void {
    unbind(this, name)
  }
  addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    if (this._disposed) return
    this._eventDispatcher.addEventListener(type, listener as EventListener, options)
  }
  removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    if (this._disposed) return
    this._eventDispatcher.removeEventListener(type, listener as EventListener, options)
  }
  dispatch(type: string, detail: any = undefined, bubbles = false, src?: ReactiveNode | HTMLElement | Document | Window) {
    if (this._disposed) return
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src)
  }
  dispose() {
    dispose(this)
  }

  connectedCallback() {
    if (typeof (this as any).onResized === 'function') {
      resizeObserver.observe(this)
    }
  }
  disconnectedCallback() {
    if (typeof (this as any).onResized === 'function') {
      resizeObserver.unobserve(this)
    }
  }

  /**
   * Renders DOM from virtual DOM arrays.
   * @param {Array} vDOMElements - Array of VDOMElement[] children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  render(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, noDispose?: boolean) {
    host = (host || this) as any
    const vDOMElementsOnly = vDOMElements.filter(item => item !== null)
    this.$ = {}
    this.traverse(vDOMElementsOnly, host as HTMLElement, noDispose)
  }
  /**
   * Recurively traverses virtual DOM elements.
   * TODO: test element.traverse() function!
   * @param {Array} vDOMElements - Array of VDOMElements elements.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, noDispose?: boolean) {
    const children = host.children
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1]
      host.removeChild(child)
      if (!noDispose) disposeChildren(child as IoElement)
    }
    // replace elements
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement | IoElement
      // replace existing elements
      if (child.localName !== vChildren[i].tag || noDispose) {
        const oldElement = child as HTMLElement
        const element = constructElement(vChildren[i])
        host.insertBefore(element, oldElement)
        host.removeChild(oldElement)
        if (!noDispose) disposeChildren(oldElement as IoElement)
      // update existing elements
      } else {
        // TODO: improve setting/removal/cleanup of native element properties/attributes.
        child.removeAttribute('className')
        child.removeAttribute('style')
        if (vChildren[i].props) {
          if ((child as IoElement)._isIoElement) {
            // Set IoElement element properties
            (child as IoElement).applyProperties(vChildren[i].props as Record<keyof this, any>)
          } else {
            // Set native HTML element properties
            applyNativeElementProps(child as HTMLElement, vChildren[i].props!)
          }
        }
      }
    }
    // TODO: doing this before "replace elements" cached (noDispose) elements to be created twice.
    // TODO: rename nodispose to dispose.
    // TODO: test
    // create new elements after existing
    if (children.length < vChildren.length) {
      const frag = document.createDocumentFragment()
      for (let i = children.length; i < vChildren.length; i++) {
        const element = constructElement(vChildren[i])
        frag.appendChild(element)
      }
      host.appendChild(frag)
    }
    for (let i = 0; i < vChildren.length; i++) {
      const vChild = vChildren[i]
      const child = children[i] as HTMLElement | IoElement
      if (vChild.props?.id) {
        // Update this.$ map of ids.
        debug: {
          if (this.$[vChild.props!.id] !== undefined) {
            console.warn(`IoElement: Duplicate id in template. "${vChild.props!.id}"`)
          }
        }
        this.$[vChild.props!.id] = child
      }
      if (vChild.children !== undefined) {
        if (typeof vChild.children === 'string') {
          // Set textNode value.
          this._flattenTextNode(child as HTMLElement);
          (child as IoElement)._textNode.nodeValue = String(vChild.children)
        } else if (vChild.children instanceof Array) {
          if (!(child as IoElement)._isIoElement) {
            const vDOMElementsOnly = (vChild.children as Array<VDOMElement | null>).filter(item => item !== null)
            this.traverse(vDOMElementsOnly, child as HTMLElement, noDispose)
          }
        }
      } else if (!(child as IoElement)._isIoElement) {
        // Clear children for native elements. IoElements manage their own children by design
        child.textContent = ''
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
      element.innerHTML = ''
      element.appendChild(document.createTextNode(''))
    }
    (element as IoElement)._textNode = element.childNodes[0] as Text
    if (element.childNodes.length > 1) {
      const textContent = element.textContent
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) element.removeChild(element.childNodes[i])
      }
      (element as IoElement)._textNode.nodeValue = textContent
    }
  }
  /**
  * Alias for HTMLElement setAttribute where falsey values remove the attribute.
  * @param {string} attr - Attribute name.
  * @param {*} value - Attribute value.
  */
  setAttribute(attr: string, value: boolean | number | string) {
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
    Object.defineProperty(ioNodeConstructor, 'vConstructor', {
        value: function(arg0?: IoElementProps | Array<VDOMElement | null> | string,
        arg1?: Array<VDOMElement | null> | string): VDOMElement {
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