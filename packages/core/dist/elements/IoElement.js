var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IoElement_1;
import { Property, ReactiveProperty } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { applyNativeElementProps, constructElement, disposeChildren, filterVDOMElements, toVDOM, clearNativeElementChildren, releaseSubtreeEventDispatchers } from '../vdom/VDOM.js';
import { dispose, bind, unbind, dispatchMutation, onPropertyMutated, setProperty, dispatchQueue, setProperties, initReactiveProperties, initProperties } from '../nodes/ReactiveNode.js';
import { addParent, initReactiveOwnerInternals, removeParent } from '../core/ReactiveCore.js';
import { Binding } from '../core/Binding.js';
import { applyElementStyleToDocument } from '../core/Style.js';
import { throttle, debounce } from '../core/Queue.js';
const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        entry.target.onResized();
    }
});
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
let IoElement = IoElement_1 = class IoElement extends HTMLElement {
    static get Style() {
        return /* css */ `
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
    `;
    }
    static get ReactiveProperties() {
        return {};
    }
    static get Properties() {
        return {};
    }
    /**
     * Declares class-level event listeners wired at construction via {@link EventDispatcher}.
     * Subclass definitions replace parent handlers for the same event name (last wins).
     * Use {@link addEventListener} for additional listeners at runtime.
     */
    static get Listeners() {
        return {};
    }
    constructor(args = {}) {
        super();
        this._protochain.init(this);
        initReactiveOwnerInternals(this);
        this.init();
        initReactiveProperties(this);
        initProperties(this);
        this.applyProperties(args, true);
        this.ready();
        this.dispatchQueue();
    }
    /** Applies constructor/render props; defers dispatch when `skipDispatch` is true. */
    applyProperties(props, skipDispatch = false) {
        for (const name in props) {
            if (this._reactiveProperties.has(name)) {
                this.setProperty(name, props[name], true);
            }
            else {
                if (name === 'class') {
                    this.className = props[name];
                }
                else if (name === 'style') {
                    const styleProps = props[name];
                    for (const s in styleProps) {
                        // TODO: Consider supporting importance
                        this.style.setProperty(s, styleProps[s]);
                    }
                }
                else if (name.startsWith('data-')) {
                    // TODO: Test this!
                    if (props[name] === undefined) {
                        this.removeAttribute(name);
                    }
                    else {
                        this.setAttribute(name, props[name]);
                    }
                }
                else if (!name.startsWith('@')) {
                    debug: if (props[name] instanceof Binding) {
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
        if (!skipDispatch)
            this.dispatchQueue();
    }
    // TODO: add types
    setProperties(props) {
        setProperties(this, props);
    }
    setProperty(name, value, debounce = false) {
        if (this._disposed)
            return;
        setProperty(this, name, value, debounce);
        const prop = this._reactiveProperties.get(name);
        if (prop.reflect)
            this.setAttribute(name.toLowerCase(), value);
    }
    init() { }
    ready() { }
    changed() { }
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    queue(name, value, oldValue) {
        this._changeQueue.queue(name, value, oldValue);
    }
    dispatchQueue(debounce = false) {
        dispatchQueue(this, debounce);
    }
    throttle(func, arg, timeout = 1) {
        throttle(func, arg, this, timeout);
    }
    debounce(func, arg, timeout = 1) {
        debounce(func, arg, this, timeout);
    }
    onPropertyMutated(event) {
        return onPropertyMutated(this, event);
    }
    ;
    dispatchMutation(object = this, properties = []) {
        dispatchMutation(this, object, properties);
    }
    bind(name) {
        return bind(this, name);
    }
    unbind(name) {
        unbind(this, name);
    }
    addEventListener(type, listener, options) {
        if (this._disposed)
            return;
        this._eventDispatcher.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        if (this._disposed)
            return;
        this._eventDispatcher.removeEventListener(type, listener, options);
    }
    dispatch(type, detail = undefined, bubbles = false, src) {
        if (this._disposed)
            return;
        this._eventDispatcher.dispatchEvent(type, detail, bubbles, src);
    }
    addParent(parent) {
        addParent(this, parent);
    }
    removeParent(parent) {
        removeParent(this, parent);
    }
    /** Releases bindings, listeners, queues, and child elements. */
    dispose() {
        dispose(this);
    }
    connectedCallback() {
        if ('onResized' in this && typeof this.onResized === 'function') {
            resizeObserver.observe(this);
        }
    }
    disconnectedCallback() {
        if ('onResized' in this && typeof this.onResized === 'function') {
            resizeObserver.unobserve(this);
        }
    }
    /** Renders VDOM children into this element or optional host. */
    render(vDOMElements, host, noDispose) {
        const renderHost = host ?? this;
        const vDOMElementsOnly = filterVDOMElements(vDOMElements);
        for (const id in this.$)
            delete this.$[id];
        this.traverse(vDOMElementsOnly, renderHost, noDispose);
    }
    /** Reconciles VDOM tree into host; keyed when children specify `key`. */
    traverse(vChildren, host, noDispose) {
        this._reconcileChildren(vChildren, host, noDispose);
        const children = host.children;
        for (let i = 0; i < vChildren.length; i++) {
            const vChild = vChildren[i];
            const child = children[i];
            if (vChild.props?.id) {
                // Update this.$ map of ids.
                debug: {
                    if (this.$[vChild.props.id] !== undefined) {
                        console.warn(`IoElement: Duplicate id in template. "${vChild.props.id}"`);
                    }
                }
                this.$[vChild.props.id] = child;
            }
            if (vChild.children !== undefined) {
                if (typeof vChild.children === 'string') {
                    // Set textNode value.
                    this._flattenTextNode(child);
                    child._textNode.nodeValue = String(vChild.children);
                }
                else if (vChild.children instanceof Array) {
                    if (!child._isIoElement) {
                        const vDOMElementsOnly = filterVDOMElements(vChild.children);
                        this.traverse(vDOMElementsOnly, child, noDispose);
                    }
                }
            }
            else if (!child._isIoElement) {
                // Clear children for native elements. IoElements manage their own children by design
                clearNativeElementChildren(child);
            }
        }
    }
    /**
     * Reconciles host children with vDOM children by position and tag name.
     * @param {Array} vChildren - Array of VDOMElements elements.
     * @param {HTMLElement} host - Template target.
     * @param {boolean} [noDispose] - Skip disposal of existing elements.
     */
    _reconcileChildren(vChildren, host, noDispose) {
        const children = host.children;
        // remove trailing elements
        while (children.length > vChildren.length) {
            const child = children[children.length - 1];
            host.removeChild(child);
            if (!noDispose)
                disposeChildren(child);
        }
        // replace elements
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // replace existing elements
            if (child.localName !== vChildren[i].tag || noDispose) {
                const oldElement = child;
                const element = constructElement(vChildren[i]);
                host.insertBefore(element, oldElement);
                host.removeChild(oldElement);
                if (!noDispose)
                    disposeChildren(oldElement);
                // update existing elements
            }
            else {
                this._updateElementProps(child, vChildren[i]);
            }
        }
        // TODO: doing this before "replace elements" cached (noDispose) elements to be created twice.
        // TODO: rename nodispose to dispose.
        // create new elements after existing
        if (children.length < vChildren.length) {
            const frag = document.createDocumentFragment();
            for (let i = children.length; i < vChildren.length; i++) {
                const element = constructElement(vChildren[i]);
                frag.appendChild(element);
            }
            host.appendChild(frag);
        }
    }
    /**
     * Updates props of an existing element matched during reconciliation.
     * @param {HTMLElement | IoElement} child - Element to update.
     * @param {VDOMElement} vChild - Virtual DOM element to apply props from.
     */
    _updateElementProps(child, vChild) {
        // TODO: improve setting/removal/cleanup of native element properties/attributes.
        child.removeAttribute('className');
        child.removeAttribute('style');
        if (vChild.props) {
            if (child._isIoElement) {
                // Set IoElement element properties
                child.applyProperties(vChild.props);
            }
            else {
                // Set native HTML element properties
                applyNativeElementProps(child, vChild.props);
            }
        }
    }
    /**
    * Helper function to flatten textContent into a single TextNode.
    * Update textContent via TextNode is better for layout performance.
    * TODO: Consider using normalize()? Is it the same function?
    * @param {HTMLElement} element - Element to flatten.
    */
    _flattenTextNode(element) {
        if (element.childNodes.length === 0) {
            element.appendChild(document.createTextNode(''));
        }
        if (element.childNodes[0].nodeName !== '#text') {
            clearNativeElementChildren(element);
            element.appendChild(document.createTextNode(''));
        }
        element._textNode = element.childNodes[0];
        if (element.childNodes.length > 1) {
            const textContent = element.textContent;
            for (let i = element.childNodes.length; i--;) {
                if (i !== 0) {
                    const node = element.childNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        releaseSubtreeEventDispatchers(node);
                    }
                    element.removeChild(node);
                }
            }
            element._textNode.nodeValue = textContent;
        }
    }
    /**
    * Alias for HTMLElement setAttribute where falsey values remove the attribute.
    * @param {string} attr - Attribute name.
    * @param {*} value - Attribute value.
    */
    setAttribute(attr, value) {
        if (value === true) {
            HTMLElement.prototype.setAttribute.call(this, attr, '');
        }
        else if (value === false || value === '') {
            this.removeAttribute(attr);
        }
        else if (typeof value === 'string' || typeof value === 'number') {
            if (this.getAttribute(attr) !== String(value))
                HTMLElement.prototype.setAttribute.call(this, attr, String(value));
        }
    }
    /**
     * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
     */
    toVDOM() {
        return toVDOM(this);
    }
    Register(ioNodeConstructor) {
        Object.defineProperty(ioNodeConstructor.prototype, '_protochain', { value: new ProtoChain(ioNodeConstructor) });
        const localName = ioNodeConstructor.name.replace(/([a-z])([A-Z,0-9])/g, '$1-$2').toLowerCase();
        Object.defineProperty(ioNodeConstructor.prototype, 'localName', { value: localName });
        Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', { enumerable: false, value: true, writable: false });
        Object.defineProperty(window, ioNodeConstructor.name, { value: ioNodeConstructor });
        window.customElements.define(localName, ioNodeConstructor);
        applyElementStyleToDocument(localName, ioNodeConstructor.prototype._protochain.style);
        // TODO: Define all overloads with type guards.
        // TODO: Add runtime debug type checks.
        // TODO: Test thoroughly.
        Object.defineProperty(ioNodeConstructor, 'vConstructor', { value: function (arg0, arg1) {
                const vDOMElement = { tag: localName };
                if (arg0 !== undefined) {
                    if (typeof arg0 === 'string') {
                        vDOMElement.children = arg0;
                    }
                    else if (arg0 instanceof Array) {
                        vDOMElement.children = arg0;
                    }
                    else if (typeof arg0 === 'object') {
                        vDOMElement.props = arg0;
                    }
                    if (arg1 !== undefined) {
                        if (typeof arg1 === 'string') {
                            vDOMElement.children = arg1;
                        }
                        else if (arg1 instanceof Array) {
                            vDOMElement.children = arg1;
                        }
                    }
                }
                return vDOMElement;
            } });
    }
};
__decorate([
    ReactiveProperty({ type: String, value: 'immediate' })
], IoElement.prototype, "reactivity", void 0);
__decorate([
    Property(Object)
], IoElement.prototype, "$", void 0);
IoElement = IoElement_1 = __decorate([
    Register
], IoElement);
export { IoElement };
export const ioElement = IoElement.vConstructor;
