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
import { applyNativeElementProps, constructElement, disposeChildren, toVDOM } from '../vdom/VDOM.js';
import { dispose, bind, unbind, onPropertyMutated, setProperty, dispatchQueue, setProperties, initReactiveProperties, initProperties } from '../nodes/Node.js';
import { Binding } from '../core/Binding.js';
import { applyElementStyleToDocument } from '../core/Style.js';
import { EventDispatcher } from '../core/EventDispatcher.js';
import { ChangeQueue } from '../core/ChangeQueue.js';
import { throttle, debounce } from '../core/Queue.js';
const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries)
        entry.target.onResized();
});
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
    `;
    }
    static get ReactiveProperties() {
        return {};
    }
    static get Properties() {
        return {};
    }
    static get Listeners() {
        return {};
    }
    constructor(args = {}) {
        super();
        this._protochain.init(this);
        Object.defineProperty(this, '_changeQueue', { enumerable: false, configurable: true, value: new ChangeQueue(this) });
        Object.defineProperty(this, '_reactiveProperties', { enumerable: false, configurable: true, value: new Map() });
        Object.defineProperty(this, '_bindings', { enumerable: false, configurable: true, value: new Map() });
        Object.defineProperty(this, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(this) });
        Object.defineProperty(this, '_observedObjectProperties', { enumerable: false, configurable: true, value: [] });
        Object.defineProperty(this, '_observedNodeProperties', { enumerable: false, configurable: true, value: [] });
        // Object.defineProperty(this, '_parents', {enumerable: false, configurable: true, value: []});
        this.init();
        initReactiveProperties(this);
        initProperties(this);
        this.applyProperties(args, true);
        this.ready();
        this.dispatchQueue();
    }
    // TODO: add types
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
                    for (const s in props[name]) {
                        this.style[s] = props[name][s];
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
        if (object._isNode || object._isIoElement) {
            this.dispatch('io-object-mutation', { object, properties });
        }
        else {
            this.dispatch('io-object-mutation', { object, properties }, false, window);
        }
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
    dispose() {
        dispose(this);
    }
    connectedCallback() {
        if (typeof this.onResized === 'function') {
            resizeObserver.observe(this);
        }
    }
    disconnectedCallback() {
        if (typeof this.onResized === 'function') {
            resizeObserver.unobserve(this);
        }
    }
    /**
     * Renders DOM from virtual DOM arrays.
     * @param {Array} vDOMElements - Array of VDOMElement[] children.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [noDispose] - Skip disposal of existing elements.
     */
    render(vDOMElements, host, noDispose) {
        host = (host || this);
        const vDOMElementsOnly = vDOMElements.filter(item => item !== null);
        this.$ = {};
        this.traverse(vDOMElementsOnly, host, noDispose);
    }
    /**
     * Recurively traverses virtual DOM elements.
     * TODO: test element.traverse() function!
     * @param {Array} vDOMElements - Array of VDOMElements elements.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [noDispose] - Skip disposal of existing elements.
     */
    traverse(vChildren, host, noDispose) {
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
                // TODO: improve setting/removal/cleanup of native element properties/attributes.
                child.removeAttribute('className');
                child.removeAttribute('style');
                if (vChildren[i].props) {
                    if (child._isIoElement) {
                        // Set IoElement element properties
                        child.applyProperties(vChildren[i].props);
                    }
                    else {
                        // Set native HTML element properties
                        applyNativeElementProps(child, vChildren[i].props);
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
            const child = children[i];
            if (vChild.props?.id) {
                // Update this.$ map of ids.
                debug: {
                    if (this.$[vChild.props.id] !== undefined) {
                        console.warn('IoElement: Duplicate id in template.');
                    }
                }
                this.$[vChild.props.id] = child;
            }
            if (vChild.children !== undefined) { // TODO: test this! Look for more cases of truthy check bugs!
                if (typeof vChild.children === 'string') {
                    // Set textNode value.
                    this._flattenTextNode(child);
                    child._textNode.nodeValue = String(vChild.children);
                }
                else if (vChild.children instanceof Array) {
                    // Traverse deeper.
                    const vDOMElementsOnly = vChild.children.filter(item => item !== null);
                    this.traverse(vDOMElementsOnly, child, noDispose);
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
    _flattenTextNode(element) {
        if (element.childNodes.length === 0) {
            element.appendChild(document.createTextNode(''));
        }
        if (element.childNodes[0].nodeName !== '#text') {
            element.innerHTML = '';
            element.appendChild(document.createTextNode(''));
        }
        element._textNode = element.childNodes[0];
        if (element.childNodes.length > 1) {
            const textContent = element.textContent;
            for (let i = element.childNodes.length; i--;) {
                if (i !== 0)
                    element.removeChild(element.childNodes[i]);
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
        Object.defineProperty(ioNodeConstructor, 'localName', { value: localName });
        Object.defineProperty(ioNodeConstructor.prototype, 'localName', { value: localName });
        Object.defineProperty(ioNodeConstructor, '_isIoElement', { enumerable: false, value: true, writable: false });
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
//# sourceMappingURL=IoElement.js.map