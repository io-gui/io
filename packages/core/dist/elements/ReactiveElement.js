var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReactiveElement_1;
import { Field } from '../decorators/Field.js';
import { Property } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { ProtoChain } from '../core/ProtoChain.js';
import { applyNativeElementProps, constructElement, createVDOMElement, filterVDOMElements, TEXT_TAG, getNodeVDOMTag, getTextVDOMContent } from '../vdom/VDOM.js';
import { dispose, bind, unbind, dispatchMutation, onPropertyMutated, setProperty, dispatchQueue, setProperties, initProperties, initFields } from '../nodes/ReactiveObject.js';
import { addParent, initReactiveNodeInternals, removeParent } from '../core/ReactiveCore.js';
import { Binding } from '../core/Binding.js';
import { applyElementStyleToDocument } from '../core/Style.js';
import { throttle, debounce } from '../core/FrameScheduler.js';
const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        entry.target.onResized();
    }
});
/**
 * Base class for Io-Gui custom elements.
 *
 * ReactiveElement extends `HTMLElement` with the same reactive property system as
 * {@link ReactiveObject}, plus virtual DOM rendering, inherited CSS via static
 * `Style`, and DOM event bridging through {@link EventDispatcher}.
 *
 * Elements render children with {@link ReactiveElement.render} and declare structure
 * through VDOM helpers exported from `@io-gui/core`. Register elements with
 * {@link Register}; factory functions (for example `ioButton`) are generated
 * automatically for VDOM composition.
 *
 * @see ReactiveObject for non-DOM reactive objects
 */
let ReactiveElement = ReactiveElement_1 = class ReactiveElement extends HTMLElement {
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
    static get Properties() {
        return {};
    }
    static get Fields() {
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
        initReactiveNodeInternals(this);
        this.init();
        initProperties(this);
        initFields(this);
        this.applyProperties(args, true);
        this.ready();
        this.dispatchQueue();
    }
    /** Applies constructor/render props; defers dispatch when `skipDispatch` is true. */
    applyProperties(props, skipDispatch = false) {
        for (const name in props) {
            if (this._properties.has(name)) {
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
                        console.warn(`ReactiveElement: Not a Property! Cannot set binding to "${name}" property on element "${this.localName}"`);
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
    setProperties(props, debounce = false) {
        setProperties(this, props, debounce);
    }
    setProperty(name, value, debounce = false) {
        if (this._disposed)
            return;
        setProperty(this, name, value, debounce);
        const prop = this._properties.get(name);
        if (prop.reflect)
            this.setAttribute(name.toLowerCase(), value);
    }
    init() { }
    ready() { }
    mutated() { }
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
    render(vDOMElements, host, skipDispose) {
        const renderHost = host ?? this;
        const vDOMElementsOnly = filterVDOMElements(vDOMElements);
        for (const id in this.$)
            delete this.$[id];
        this.traverse(vDOMElementsOnly, renderHost, skipDispose);
    }
    /** Reconciles VDOM tree into host; keyed when children specify `key`. */
    traverse(vChildren, host, skipDispose) {
        this._reconcileChildren(vChildren, host, skipDispose);
        const childNodes = host.childNodes;
        for (let i = 0; i < vChildren.length; i++) {
            const vChild = vChildren[i];
            const child = childNodes[i];
            if (vChild.tag === TEXT_TAG)
                continue;
            const elementChild = child;
            if (vChild.props?.id) {
                // Update this.$ map of ids.
                debug: {
                    if (this.$[vChild.props.id] !== undefined) {
                        console.warn(`ReactiveElement: Duplicate id in template. "${vChild.props.id}"`);
                    }
                }
                this.$[vChild.props.id] = elementChild;
            }
            if (vChild.children !== undefined) {
                if (!elementChild._isReactiveElement) {
                    const vDOMElementsOnly = filterVDOMElements(vChild.children);
                    this.traverse(vDOMElementsOnly, elementChild, skipDispose);
                }
            }
            else if (!elementChild._isReactiveElement) {
                // Clear children for native elements. ReactiveElements manage their own children by design
                clearNativeElementChildren(elementChild);
            }
        }
    }
    /**
     * Reconciles host children with vDOM children by position and tag name.
     * @param {Array} vChildren - Array of VDOMElements elements.
     * @param {HTMLElement} host - Template target.
     * @param {boolean} [skipDispose] - Detach removed/replaced nodes without calling dispose (for DOM caching).
     */
    _reconcileChildren(vChildren, host, skipDispose) {
        const childNodes = host.childNodes;
        // remove trailing nodes
        while (childNodes.length > vChildren.length) {
            const child = childNodes[childNodes.length - 1];
            host.removeChild(child);
            if (!skipDispose && child.nodeType === Node.ELEMENT_NODE)
                disposeChildren(child);
        }
        // replace nodes
        for (let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i];
            const vChild = vChildren[i];
            // replace existing nodes
            if (getNodeVDOMTag(child) !== vChild.tag) {
                const oldNode = child;
                const node = constructElement(vChild);
                host.insertBefore(node, oldNode);
                host.removeChild(oldNode);
                if (!skipDispose && oldNode.nodeType === Node.ELEMENT_NODE)
                    disposeChildren(oldNode);
                // update existing nodes
            }
            else if (vChild.tag === TEXT_TAG) {
                child.nodeValue = getTextVDOMContent(vChild);
            }
            else {
                this._updateElementProps(child, vChild);
            }
        }
        // create new nodes after existing
        if (childNodes.length < vChildren.length) {
            const frag = document.createDocumentFragment();
            for (let i = childNodes.length; i < vChildren.length; i++) {
                const node = constructElement(vChildren[i]);
                frag.appendChild(node);
            }
            host.appendChild(frag);
        }
    }
    /**
     * Updates props of an existing element matched during reconciliation.
     * @param {HTMLElement | ReactiveElement} child - Element to update.
     * @param {VDOMElement} vChild - Virtual DOM element to apply props from.
     */
    _updateElementProps(child, vChild) {
        if (vChild.props) {
            if (child._isReactiveElement) {
                // Set ReactiveElement element properties
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
    Register(ioNodeConstructor) {
        Object.defineProperty(ioNodeConstructor.prototype, '_protochain', { value: new ProtoChain(ioNodeConstructor) });
        const localName = ioNodeConstructor.name.replace(/([a-z])([A-Z,0-9])/g, '$1-$2').toLowerCase();
        Object.defineProperty(ioNodeConstructor.prototype, 'localName', { value: localName });
        Object.defineProperty(ioNodeConstructor.prototype, '_isReactiveElement', { enumerable: false, value: true, writable: false });
        Object.defineProperty(window, ioNodeConstructor.name, { value: ioNodeConstructor });
        window.customElements.define(localName, ioNodeConstructor);
        applyElementStyleToDocument(localName, ioNodeConstructor.prototype._protochain.style);
        // TODO: Define all overloads with type guards.
        // TODO: Test thoroughly.
        Object.defineProperty(ioNodeConstructor, 'vConstructor', { value: function (arg0, arg1) {
                debug: if (this !== ioNodeConstructor) {
                    console.warn(`${this.name} not registered! Use @Register before using ${this.name}.vConstructor.`);
                }
                return createVDOMElement(localName, arg0, arg1);
            } });
    }
};
__decorate([
    Property({ type: String, value: 'immediate' })
], ReactiveElement.prototype, "dispatchTiming", void 0);
__decorate([
    Field(Object)
], ReactiveElement.prototype, "$", void 0);
ReactiveElement = ReactiveElement_1 = __decorate([
    Register
], ReactiveElement);
export { ReactiveElement };
/**
 * Disposes EventDispatcher on an element.
 */
export const releaseEventDispatcher = function (element) {
    if (element._eventDispatcher) {
        element._eventDispatcher.dispose();
        delete element._eventDispatcher;
    }
};
/**
 * Disposes EventDispatchers on element and all element descendants.
 */
export const releaseSubtreeEventDispatchers = function (root) {
    const elements = root.querySelectorAll('*');
    for (let i = elements.length; i--;) {
        releaseEventDispatcher(elements[i]);
    }
    releaseEventDispatcher(root);
};
/**
 * Clears native element children after releasing orphaned EventDispatchers.
 */
export const clearNativeElementChildren = function (element) {
    for (let i = element.childNodes.length; i--;) {
        const child = element.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            releaseSubtreeEventDispatchers(child);
        }
    }
    element.textContent = '';
};
/**
 * Disposes the element's children.
 * @param {ReactiveElement} element - Element to dispose children of.
 */
export const disposeChildren = function (element) {
    // NOTE: This rAF ensures that element's change queue is emptied before disposing.
    requestAnimationFrame(() => {
        const elements = Array.from(element.querySelectorAll('*')).concat([element]);
        for (let i = elements.length; i--;) {
            if (typeof elements[i].dispose === 'function') {
                elements[i].dispose();
            }
            else {
                releaseEventDispatcher(elements[i]);
            }
        }
    });
};
export const reactiveElement = ReactiveElement.vConstructor;
