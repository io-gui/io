import { Property } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { applyNativeElementProps, constructElement, disposeChildren, VDOMElement, toVDOM, NativeElementProps } from '../vdom/VDOM.js';
import { Node, NodeProps, ReactivePropertyDefinitions, ReactivityType, ListenerDefinitions } from '../nodes/Node.js';
import { Binding } from '../core/Binding.js';
import { applyElementStyleToDocument } from '../core/Style.js';
import { EventDispatcher, AnyEventListener } from '../core/EventDispatcher.js';
import { ChangeQueue } from '../core/ChangeQueue.js';
import { ReactivePropertyInstance } from '../core/ReactiveProperty.js';
import { throttle, debounce, CallbackFunction } from '../core/Queue.js';



const resizeObserver = new ResizeObserver(entries => {
  for (const entry of entries) (entry.target as any).onResized();
});

export type IoElementProps = NativeElementProps & NodeProps;

/**
 * Core `IoElement` class.
 */
@Register
export class IoElement extends HTMLElement {
  static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: block;
        box-sizing: border-box;
        -webkit-touch-callout: none;
      }
    `;
  }
  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      reactivity: {
        value: 'immediate',
        type: String,
      }
    };
  }
  // TODO: use decorator
  declare reactivity: ReactivityType;

  declare _isNode: boolean;
  declare _isIoElement: boolean;
  declare _disposed: boolean;
  declare _textNode: Text;

  @Property(Object)
  declare $: Record<string, HTMLElement | IoElement>;

  static get Listeners(): ListenerDefinitions {
    return {};
  }

  declare readonly _protochain: ProtoChain;
  declare readonly _reactiveProperties: Map<string, ReactivePropertyInstance>;
  declare readonly _bindings: Map<string, Binding<any>>;
  declare readonly _changeQueue: ChangeQueue;
  declare readonly _eventDispatcher: EventDispatcher;

  constructor(args: IoElementProps = {}) {
    super();

    this.init();

    debug: {
      const constructor = Object.getPrototypeOf(this).constructor;
      if (this._protochain.constructors[0] !== constructor) {
        console.error(`${constructor.name} not registered! Call "Register([ClassName])" of @Register decorator before using ${constructor.name} class!`);
      }
    }

    this._protochain.autobindHandlers(this);

    Object.defineProperty(this, '_changeQueue', {enumerable: false, configurable: true, value: new ChangeQueue(this)});
    Object.defineProperty(this, '_reactiveProperties', {enumerable: false, configurable: true, value: new Map()});
    Object.defineProperty(this, '_bindings', {enumerable: false, configurable: true, value: new Map()});
    Object.defineProperty(this, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(this)});


    // TODO: move in loop below
    for (const name in this._protochain.reactiveProperties) {
      Object.defineProperty(this, name, {
        get: function() {
          return this._reactiveProperties.get(name).value;
        },
        set: function(value) {
          (this as Node).setProperty(name, value);
        },
        configurable: true,
        enumerable: true,
      });
    }

    for (const name in this._protochain.reactiveProperties) {
      const property = new ReactivePropertyInstance(this, this._protochain.reactiveProperties[name]);
      this._reactiveProperties.set(name, property);

      if (property.binding) property.binding.addTarget(this, name);
      if (property.value?._isNode) {
        let hasSameValueAtOtherProperty = false;
        this._reactiveProperties.forEach((p, n) => {
          if (p.value === property.value && n !== name) hasSameValueAtOtherProperty = true;
        });
        if (!hasSameValueAtOtherProperty) property.value.addEventListener('object-mutated', this.onPropertyMutated);
      }
    }

    for (const name in this._protochain.properties) {
      let initialValue = this._protochain.properties[name];
      if (typeof initialValue === 'function') {
        initialValue = new initialValue();
      } else if (initialValue instanceof Array) {
        initialValue = initialValue.slice();
      } else if (typeof initialValue === 'object') {
        initialValue = Object.assign({}, initialValue);
      }
      this[name as keyof this] = initialValue;
    }

    this.applyProperties(args as Record<keyof this, any>, true);

    if (this._protochain.observedObjectProperties.length) {
      window.addEventListener('object-mutated', this.onPropertyMutated as EventListener);
    }

    this.ready();

    this.dispatchQueue();

    for (const name in this._protochain.reactiveProperties) {
      const property = this._reactiveProperties.get(name)!;
      if (property.reflect && property.value !== undefined && property.value !== null) {
        this.setAttribute(name, property.value);
      }
    }
  }
  /**
   * Sets multiple properties in batch.
   * [property]-changed` events will be broadcast in the end.
   * @param {Object} props - Map of property names and values.
   */
  applyProperties(props: Record<keyof this, any>, skipDispatch = false) {
    for (const name in props) {
      if (this._reactiveProperties.has(name)) {
        this.setProperty(name, props[name], true);
      } else {
        if (name === 'class') {
          this.className = props[name];
        } else if (name === 'style') {
          for (const s in props[name]) {
            this.style[s as any] = props[name][s];
          }
        } else if (name.startsWith('data-')) {
          // TODO: Test this!
          if (props[name] === undefined) {
            this.removeAttribute(name);
          } else {
            this.setAttribute(name, props[name]);
          }
        } else if (!name.startsWith('@')) {
          debug: if (props[name] as any instanceof Binding) {
            console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${name}" property on element "${this.localName}"`);
          }
          this[name] = props[name];
          // TODO: test and check if type can be attribute.
          if (props[name] === undefined && this.hasAttribute(name)) {
            this.removeAttribute(name);
          }
        }
      }
    }
    this._eventDispatcher.applyPropListeners(props);
    if (!skipDispatch) this.dispatchQueue();
  }
  /**
   * Sets multiple properties in batch.
   * [property]-changed` events will be broadcast in the end.
   * @param {Object} props - Map of property names and values.
   */
  // TODO: add types
  setProperties(props: any) {
    for (const name in props) {
      if (!this._reactiveProperties.has(name)) {
        debug: console.warn(`Property "${name}" is not defined`, this);
        continue;
      }
      this.setProperty(name, props[name], true);
    }
    this.dispatchQueue();
  }
  /**
   * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
   * @param {string} name Property name to set value of.
   * @param {any} value Peroperty value.
   * @param {boolean} [debounce] flag to skip event dispatch.
   */
  setProperty(name: string, value: any, debounce = false) {
    const prop = this._reactiveProperties.get(name)!;
    const oldValue = prop.value;

    if (value !== oldValue) {
      const binding = (value instanceof Binding) ? value : null;
      if (binding) {
        const oldBinding = prop.binding;
        if (binding !== oldBinding) {
          if (oldBinding) {
            oldBinding.removeTarget(this, name);
          }
          binding.addTarget(this, name);
          // NOTE: We return here because binding.setTarget() will trigger execution of setProperty() again.
          return;
        } else {
          // NOTE: This was a remedy for an old bug that might not be relevant anymore.
          // Whenusing change() > template() > setProperties() to batch-set multiple properties with bindings,
          // it used to cause all but one of those properties to be reset to original value once parent changed.
          // This ugly hack fixed the bug by setting binding value from target when binding already exists.
          // TODO: keep an eye on this and remove if not needed.
          // binding.value = value = prop.value;
          return;
        }
      }

      prop.value = value;

      // TODO: test!
      if (value !== oldValue) {
        let hasNewValueAtOtherProperty = false;
        let hasOldValueAtOtherProperty = false;
        this._reactiveProperties.forEach((property, n) => {
          if (property.value === value && n !== name) hasNewValueAtOtherProperty = true;
          if (property.value === oldValue && n !== name) hasOldValueAtOtherProperty = true;
        });
        if (value?._isNode) {
          if (!hasNewValueAtOtherProperty) value.addEventListener('object-mutated', this.onPropertyMutated);
        }
        if (oldValue?._isNode) {
          if (!hasOldValueAtOtherProperty && !oldValue._disposed) oldValue.removeEventListener('object-mutated', this.onPropertyMutated);
        }
      }

      debug: {
        if (prop.type === String) {
          if (typeof value !== 'string') {
            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
          }
        } else if (prop.type === Number) {
          if (typeof value !== 'number') {
            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
          }
        } else if (prop.type === Boolean) {
          if (typeof value !== 'boolean') {
            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
          }
        } else if (prop.type === Array) {
          if (!(value instanceof Array)) {
            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
          }
        } else if (prop.type === Object) {
          if (value instanceof Array) {
            console.warn(`Wrong type of property "${name}". Value: "${JSON.stringify(value)}". Expected type: ${prop.type.name}`, this);
          }
        } else if (typeof prop.type === 'function') {
          if (!(value instanceof prop.type)) {
            console.warn(`Wrong type of property "${name}". Value: "${value}". Expected type: ${prop.type.name}`, this);
          }
        }
      }
      if (oldValue !== value) {
        this.queue(name, value, oldValue);
        this.dispatchQueue(debounce);
      }
    }

    if (prop.reflect) this.setAttribute(name.toLowerCase(), value);
  }
  ready() {}
  init() {}
  /**
   * default change handler.
   * Invoked when one of the properties change.
   */

  changed() {}
  /**
   * Adds property change to the queue.
   * @param {string} name - Property name.
   * @param {*} value - Property value.
   * @param {*} oldValue - Old property value.
   */
  queue(name: string, value: any, oldValue: any) {
    if (this.reactivity === 'none') return;
    this._changeQueue.queue(name, value, oldValue);
  }
  /**
   * Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.
   */
  dispatchQueue(debounce = false) {
    if (this.reactivity === 'debounced' || debounce || this._changeQueue.dispatching) {
      this.debounce(this._changeQueue.dispatch);
    } else if (this.reactivity === 'throttled') {
      this.throttle(this._changeQueue.dispatch);
    } else if (this.reactivity === 'immediate') {
      this._changeQueue.dispatch();
    }
    debug: if (['none', 'immediate', 'throttled', 'debounced'].indexOf(this.reactivity) === -1) {
      console.warn(`Node.dispatchQueue(): Invalid reactivity property value: "${this.reactivity}". Expected one of: "none", "immediate", "throttled", "debounced".`);
    }
  }
  /**
   * Throttles function execution once per frame (rAF).
   * @param {CallbackFunction} func - Function to throttle.
   * @param {*} [arg] - Optional argument for throttled function.
   */
  throttle(func: CallbackFunction, arg?: any, timeout = 1) {
    throttle(func, arg, this, timeout);
  }
  /**
   * Debounces function execution to next frame (rAF).
   * @param {CallbackFunction} func - Function to debounce.
   * @param {*} [arg] - Optional argument for debounced function.
   */
  debounce(func: CallbackFunction, arg?: any, timeout = 1) {
    debounce(func, arg, this, timeout);
  }
  /**
   * Event handler for 'object-mutated' events emitted from the properties which are Node instances.
   * Aditionally, it handles events emitted from the `window` object (used for observing non-Node object properties).
   * NOTE: non-Node objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
   * This is used to evoke '[propName]Mutated()' mutation handler
   * @param {Object} event - Event payload.
   * @param {EventTarget} event.target - Node that emitted the event.
   * @param {Node} event.detail.object - Mutated node.
   */
  onPropertyMutated(event: CustomEvent) {
    const object = event.detail.object;
    // TODO: consider situations where node is listening to object-mutated events from multiple sources (window and property).
    // This might cause multiple executions of the same handler.
    // TODO: consider optimizing. This handler might be called a lot.
    const properties = [...new Set([...this._protochain.observedObjectProperties, ...this._protochain.observedNodeProperties])];
    for (let i = 0; i < properties.length; i++) {
      const name = properties[i];
      const value = this._reactiveProperties.get(name)!.value;
      if (value === object) {
        const handlerName = name + 'Mutated' as keyof Node;
        if (typeof this[handlerName] === 'function') {
          this.throttle(this[handlerName] as CallbackFunction);
        }
        return true;
      }
    }
  };
  /**
   * Returns a binding to a specified property`.
   * @param {string} name - Property name to bind to.
   * @return {Binding} Binding object.
   */
  bind<T>(name: string) {
    debug: if (!this._reactiveProperties.has(name)) {
      console.warn(`IoGUI Node: cannot bind to ${name} property. Does not exist!`);
    }
    if (!this._bindings.has(name)) {
      this._bindings.set(name, new Binding<T>(this, name));
    }
    return this._bindings.get(name)! as Binding<T>;
  }
  /**
   * Unbinds a binding to a specified property`.
   * @param {string} name - Property name to unbind.
   */
  unbind(name: string) {
    const binding = this._bindings.get(name);
    if (binding) {
      binding.dispose();
      this._bindings.delete(name);
    }

    const property = this._reactiveProperties.get(name);
    property?.binding?.removeTarget(this, name);
  }
  /**
   * Wrapper for addEventListener.
   * @param {string} type - listener name.
   * @param {AnyEventListener} listener - listener handler.
   * @param {AddEventListenerOptions} options - event listener options.
   */
  addEventListener(type: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.addEventListener(type, listener as EventListener, options);
  }
  /**
   * Wrapper for removeEventListener.
   * @param {string} type - event name to listen to.
   * @param {AnyEventListener} listener - listener handler.
   * @param {ObjAddEventListenerOptionsect} options - event listener options.
   */
  removeEventListener(type: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    this._eventDispatcher.removeEventListener(type, listener as EventListener, options);
  }
  /**
   * Wrapper for dispatchEvent.
   * @param {string} type - event name to dispatch.
   * @param {Object} detail - event detail.
   * @param {boolean} bubbles - event bubbles.
   * @param {HTMLElement|Node} src source node/element to dispatch event from.
   */
  dispatch(type: string, detail: any = undefined, bubbles = false, src?: Node | HTMLElement | Document | Window) {
    this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
  }
  /**
   * Disposes the node when it is no longer needed.
   */
  dispose() {
    debug: if (this._disposed) {
      console.warn('Node.dispose(): Already disposed!', this.constructor.name);
    }

    if (this._disposed) return;

    this._bindings.forEach((binding, name) => {
      binding.dispose();
      this._bindings.delete(name);
    });
    delete (this as any)._bindings;

    if (this._protochain.observedObjectProperties.length) {
      window.removeEventListener('object-mutated', this.onPropertyMutated as EventListener);
    }
    delete (this as any)._protochain;

    this._changeQueue.dispose();
    delete (this as any)._changeQueue;

    let removed: Node[] = [];
    this._reactiveProperties.forEach((property, name) => {
      property.binding?.removeTarget(this, name);
      if (property.value?._isNode && !removed.includes(property.value) && !property.value._disposed) {
        property.value.removeEventListener('object-mutated', this.onPropertyMutated);
        removed.push(property.value);
      }
    });

    for (const name in this._protochain.properties) {
      delete this[name as keyof Node];
    }

    // NOTE: _eventDispatcher.dispose must happen AFTER disposal of bindings!
    this._eventDispatcher.dispose();
    delete (this as any)._eventDispatcher;
    delete (this as any)._reactiveProperties;

    Object.defineProperty(this, '_disposed', {value: true});
  }

  /**
  * Add resize listener if `onResized()` is defined in subclass.
  */
  connectedCallback() {
    if (typeof (this as any).onResized === 'function') {
      resizeObserver.observe(this);
    }
  }
  /**
  * Removes resize listener if `onResized()` is defined in subclass.
  */
  disconnectedCallback() {
    if (typeof (this as any).onResized === 'function') {
      resizeObserver.unobserve(this);
    }
  }

  /**
   * Renders DOM from virtual DOM arrays.
   * @param {Array} vDOMElements - Array of VDOMElement[] children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  render(vDOMElements: Array<VDOMElement | null>, host?: HTMLElement | IoElement, noDispose?: boolean) {
    host = (host || this) as any;
    const vDOMElementsOnly = vDOMElements.filter(item => item !== null);
    this.$ = {};
    this.traverse(vDOMElementsOnly, host as HTMLElement, noDispose);
  }
  /**
   * Recurively traverses virtual DOM elements.
   * TODO: test element.traverse() function!
   * @param {Array} vDOMElements - Array of VDOMElements elements.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  traverse(vChildren: VDOMElement[], host: HTMLElement | IoElement, noDispose?: boolean) {
    const children = host.children;
    // remove trailing elements
    while (children.length > vChildren.length) {
      const child = children[children.length - 1];
      host.removeChild(child);
      if (!noDispose) disposeChildren(child as unknown as IoElement);
    }
    // replace elements
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement | IoElement;
      // replace existing elements
      if (child.localName !== vChildren[i].tag || noDispose) {
        const oldElement = child as unknown as HTMLElement;
        const element = constructElement(vChildren[i]);
        host.insertBefore(element, oldElement);
        host.removeChild(oldElement);
        if (!noDispose) disposeChildren(oldElement as unknown as IoElement);
      // update existing elements
      } else {
        // TODO: improve setting/removal/cleanup of native element properties/attributes.
        child.removeAttribute('className');
        child.removeAttribute('style');
        if (vChildren[i].props) {
          if ((child as IoElement)._isIoElement) {
            // Set IoElement element properties
            (child as IoElement).applyProperties(vChildren[i].props as Record<keyof this, any>);
          } else {
            // Set native HTML element properties
            applyNativeElementProps(child as HTMLElement, vChildren[i].props!);
          }
        }
      }
    }
    // TODO: doing this before "replace elements" cached (noDispose) elements to be created twice.
    // TODO: rename nodispose to dispose.
    // TODO: test
    // create new elements after existing
    if (children.length < vChildren.length) {
      const frag = document.createDocumentFragment();
      for (let i = children.length; i < vChildren.length; i++) {
        const element = constructElement(vChildren[i]);
        frag.appendChild(element);
      }
      host.appendChild(frag);
    }
    for (let i = 0; i < vChildren.length; i++) {
      const vChild = vChildren[i];
      const child = children[i] as HTMLElement | IoElement;
      if (vChild.props?.id) {
        // Update this.$ map of ids.
        debug: {
          if (this.$[vChild.props!.id] !== undefined) {
            console.warn('IoElement: Duplicate id in template.');
          }
        }
        this.$[vChild.props!.id] = child;
      }
      if (vChild.children !== undefined) { // TODO: test this! Look for more cases of truthy check bugs!
        if (typeof vChild.children === 'string') {
          // Set textNode value.
          this._flattenTextNode(child as HTMLElement);
          (child as IoElement)._textNode.nodeValue = String(vChild.children);
        } else if (vChild.children instanceof Array) {
          // Traverse deeper.
          const vDOMElementsOnly = (vChild.children as Array<VDOMElement | null>).filter(item => item !== null);
          this.traverse(vDOMElementsOnly, child as HTMLElement, noDispose);
        }
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
      element.appendChild(document.createTextNode(''));
    }
    if (element.childNodes[0].nodeName !== '#text') {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(''));
    }
    (element as IoElement)._textNode = element.childNodes[0] as Text;
    if (element.childNodes.length > 1) {
      const textContent = element.textContent;
      for (let i = element.childNodes.length; i--;) {
        if (i !== 0) element.removeChild(element.childNodes[i]);
      }
      (element as IoElement)._textNode.nodeValue = textContent;
    }
  }
  /**
  * Alias for HTMLElement setAttribute where falsey values remove the attribute.
  * @param {string} attr - Attribute name.
  * @param {*} value - Attribute value.
  */
  setAttribute(attr: string, value: boolean | number | string) {
    if (value === true) {
      HTMLElement.prototype.setAttribute.call(this, attr, '');
    } else if (value === false || value === '') {
      this.removeAttribute(attr);
    } else if (typeof value === 'string' || typeof value === 'number') {
      if (this.getAttribute(attr) !== String(value)) HTMLElement.prototype.setAttribute.call(this, attr, String(value));
    }
  }
  /**
   * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
   */
  toVDOM() {
    return toVDOM(this);
  }
  Register(ioNodeConstructor: typeof IoElement) {
    Object.defineProperty(ioNodeConstructor, '_isNode', {enumerable: false, value: true});
    Object.defineProperty(ioNodeConstructor.prototype, '_isNode', {enumerable: false, value: true});
    Object.defineProperty(ioNodeConstructor.prototype, '_protochain', {value: new ProtoChain(ioNodeConstructor)});

    const localName = ioNodeConstructor.name.replace(/([a-z])([A-Z,0-9])/g, '$1-$2').toLowerCase();

    Object.defineProperty(ioNodeConstructor, 'localName', {value: localName});
    Object.defineProperty(ioNodeConstructor.prototype, 'localName', {value: localName});

    Object.defineProperty(ioNodeConstructor, '_isIoElement', {enumerable: false, value: true});
    Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', {enumerable: false, value: true});
    Object.defineProperty(window, ioNodeConstructor.name, {value: ioNodeConstructor});

    window.customElements.define(localName, ioNodeConstructor as unknown as CustomElementConstructor);

    applyElementStyleToDocument(localName, ioNodeConstructor.prototype._protochain.style);

    // TODO: Define all overloads with type guards.
    // TODO: Add runtime debug type checks.
    // TODO: Test thoroughly.
    Object.defineProperty(ioNodeConstructor, 'vConstructor', {value: function(arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string): VDOMElement {
      const vDOMElement: VDOMElement = {tag: localName};
      if (arg0 !== undefined) {
        if (typeof arg0 === 'string') {
          vDOMElement.children = arg0;
        } else if (arg0 instanceof Array) {
          vDOMElement.children = arg0;
        } else if (typeof arg0 === 'object') {
          vDOMElement.props = arg0;
        }
        if (arg1 !== undefined) {
          if (typeof arg1 === 'string') {
            vDOMElement.children = arg1;
          } else if (arg1 instanceof Array) {
            vDOMElement.children = arg1;
          }
        }
      }
      return vDOMElement;
    }});
  }
}
export const ioElement = IoElement.vConstructor;