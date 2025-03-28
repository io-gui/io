var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EventDispatcher } from './internals/eventDispatcher';
import { IoNodeMixin } from './node';
import { Property } from './decorators/property';
import { Register } from './decorators/register';
// Global mixin record
const mixinRecord = {};
// Regular expressions for style string processing.
const commentsRegex = new RegExp('(\\/\\*[\\s\\S]*?\\*\\/)', 'gi');
const keyframeRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mediaQueryRegex = new RegExp('((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
const mixinRegex = new RegExp('(( --[\\s\\S]*?): {([\\s\\S]*?)})', 'gi');
const applyRegex = new RegExp('(@apply\\s.*?;)', 'gi');
const cssRegex = new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi');
const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries)
        entry.target.onResized();
});
/** @license
 * MIT License
 *
 * Copyright (c) 2019 Luke Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const isString = (x) => typeof x === 'string';
const isArray = Array.isArray;
const isObject = (x) => typeof x === 'object' && !isArray(x);
const clense = (a, b) => !b ? a : isString(b[0]) ? [...a, b] : [...a, ...b];
export const buildTree = () => (node) => isObject(node[1]) ? {
    ['name']: node[0],
    ['props']: node[1],
    ['children']: isArray(node[2]) ? node[2].reduce(clense, []).map(buildTree()) : node[2]
} : buildTree()([node[0], {}, node[1]]);
/**
 * Creates an element from a virtual dom object.
 * @param {VDOMElement} vDOMElement - Virtual dom object.
 * @return {HTMLElement} - Created element.
 */
const constructElement = function (vDOMElement) {
    // IoElement classes constructed with constructor.
    const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.name) : null;
    if (ConstructorClass && ConstructorClass._isIoElement) {
        return new ConstructorClass(vDOMElement.props);
    }
    // Other element classes constructed with document.createElement.
    const element = document.createElement(vDOMElement.name);
    applyNativeElementProps(element, vDOMElement.props);
    return element;
};
export const disposeElementDeep = function (element) {
    // NOTE: This timeout ensures that element's change queue is emptied before disposing.
    requestAnimationFrame(() => {
        const elements = [...(element.querySelectorAll('*')), element];
        for (let i = elements.length; i--;) {
            if (typeof elements[i].dispose === 'function') {
                elements[i].dispose();
            }
            else if (elements[i]._eventDispatcher) {
                elements[i]._eventDispatcher.dispose();
                delete elements[i]._eventDispatcher;
            }
        }
    });
};
const superCreateElement = document.createElement;
document.createElement = function (tagName, options) {
    if (tagName.startsWith('io-')) {
        const constructor = customElements.get(tagName);
        if (constructor) {
            return new constructor();
        }
        else {
            return superCreateElement.apply(this, [tagName, options]);
        }
    }
    else {
        return superCreateElement.apply(this, [tagName, options]);
    }
};
/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
export const applyNativeElementProps = function (element, props) {
    for (const p in props) {
        const prop = props[p];
        if (p === 'style')
            for (const s in prop)
                element.style.setProperty(s, prop[s]);
        else if (p === 'class')
            element['className'] = prop;
        else
            element[p] = prop;
        if (p === 'name')
            element.setAttribute('name', prop);
        if (p === 'src')
            element.setAttribute('src', prop);
    }
    if (!element._eventDispatcher) {
        Object.defineProperty(element, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(element) });
    }
    element._eventDispatcher.applyPropListeners(props);
};
/**
 * Core `IoElement` class.
 */
let IoElement = class IoElement extends IoNodeMixin(HTMLElement) {
    static get Style() {
        return /* css */ `
      :host {
        box-sizing: border-box;
        display: block;
      }
      :host[hidden] {
        display: none;
      }
      :host[disabled] {
        pointer-events: none;
        opacity: 0.5;
      }
      :host:focus {
        border-color: var(--io_colorBlue);
        outline: 1px auto var(--io_colorBlue);
        outline: 1px auto -webkit-focus-ring-color;
      }
      :host[aria-invalid] {
        border: var(--io_borderFail);
      }
    `;
    }
    constructor(...args) {
        super(...args);
        for (const name in this._protochain.properties) {
            const property = this._properties.get(name);
            const value = property.value;
            if (value !== undefined && value !== null) {
                if (property.reflect) {
                    this.setAttribute(name, value);
                }
            }
        }
    }
    /**
    * Add resize listener if `onResized()` is defined in subclass.
    */
    connectedCallback() {
        if (typeof this.onResized === 'function') {
            resizeObserver.observe(this);
        }
    }
    /**
    * Removes resize listener if `onResized()` is defined in subclass.
    */
    disconnectedCallback() {
        if (typeof this.onResized === 'function') {
            resizeObserver.unobserve(this);
        }
    }
    setProperty(name, value, debounce = false) {
        super.setProperty(name, value, debounce);
        const prop = this._properties.get(name);
        if ((prop.reflect) && this._isIoElement)
            this.setAttribute(name, value);
    }
    // TODO: Reconsider cache parameter. Does it belong in the code class?
    /**
     * Renders DOM from virtual DOM arrays.
     * @param {Array} vDOM - Array of vDOM children.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    template(vDOM, host, cache) {
        const vChildren = buildTree()(['first', vDOM]).children;
        host = (host || this);
        if (host === this)
            this.$ = {};
        this.traverse(vChildren, host, cache);
    }
    /**
     * Recurively traverses vDOM.
     * TODO: test element.traverse() function!
     * @param {Array} vChildren - Array of vDOM children converted by `buildTree()` for easier parsing.
     * @param {HTMLElement} [host] - Optional template target.
     * @param {boolean} [cache] - Optional don't reuse existing elements and skip dispose
     */
    traverse(vChildren, host, cache) {
        const children = host.children;
        // remove trailing elements
        while (children.length > vChildren.length) {
            const child = children[children.length - 1];
            host.removeChild(child);
            if (!cache)
                disposeElementDeep(child);
        }
        // replace elements
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // replace existing elements
            if (child.localName !== vChildren[i].name || cache) {
                const oldElement = child;
                const element = constructElement(vChildren[i]);
                host.insertBefore(element, oldElement);
                host.removeChild(oldElement);
                if (!cache)
                    disposeElementDeep(oldElement);
                // update existing elements
            }
            else {
                child.removeAttribute('className');
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
        // TODO: doing this before "replace elements" cached elements to be created twice. Consider making a unit test for this.
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
            // Update this.$ map of ids.
            const child = children[i];
            if (vChildren[i].props.$) {
                this.$[vChildren[i].props.$] = child;
            }
            if (vChildren[i].children !== undefined) {
                if (typeof vChildren[i].children === 'string') {
                    // Set textNode value.
                    this._flattenTextNode(child);
                    child._textNode.nodeValue = String(vChildren[i].children);
                }
                else if (typeof vChildren[i].children === 'object') {
                    // Traverse deeper.
                    this.traverse(vChildren[i].children, child, cache);
                }
            }
        }
    }
    Register(ioNodeConstructor) {
        super.Register(ioNodeConstructor);
        const localName = ioNodeConstructor.name.replace(/([a-z])([A-Z,0-9])/g, '$1-$2').toLowerCase();
        Object.defineProperty(ioNodeConstructor, 'localName', { value: localName });
        Object.defineProperty(ioNodeConstructor.prototype, 'localName', { value: localName });
        Object.defineProperty(ioNodeConstructor, '_isIoElement', { enumerable: false, value: true });
        Object.defineProperty(ioNodeConstructor.prototype, '_isIoElement', { enumerable: false, value: true });
        Object.defineProperty(window, ioNodeConstructor.name, { value: ioNodeConstructor });
        window.customElements.define(localName, ioNodeConstructor);
        let mixinsString = '';
        const mixins = ioNodeConstructor.prototype._protochain.styles.match(mixinRegex);
        if (mixins) {
            for (let i = 0; i < mixins.length; i++) {
                // TODO: improve mixing regex and string handling.
                const m = mixins[i].split(': {');
                const name = m[0].replace(' --', '--');
                const value = m[1].replace(/}/g, '').trim().replace(/^ +/gm, '');
                mixinRecord[name] = value;
                mixinsString += mixins[i].replace(' --', '.').replace(': {', ' {');
            }
        }
        // Remove mixins
        let styleString = ioNodeConstructor.prototype._protochain.styles.replace(mixinRegex, '');
        // Apply mixins
        const apply = styleString.match(applyRegex);
        if (apply) {
            for (let i = 0; i < apply.length; i++) {
                const name = apply[i].split('@apply ')[1].replace(';', '');
                if (mixinRecord[name]) {
                    styleString = styleString.replace(apply[i], mixinRecord[name]);
                }
                else {
                    console.warn('IoElement: cound not find mixin:', name);
                }
            }
        }
        debug: {
            let styleStringStripped = styleString;
            styleStringStripped = styleStringStripped.replace(commentsRegex, '');
            styleStringStripped = styleStringStripped.replace(keyframeRegex, '');
            styleStringStripped = styleStringStripped.replace(mediaQueryRegex, '');
            const match = styleStringStripped.match(cssRegex);
            if (match) {
                match.map((selector) => {
                    selector = selector.trim();
                    if (!selector.startsWith(':host')) {
                        console.warn(localName + ': CSS Selector not prefixed with ":host"! This will cause style leakage!');
                        console.warn(selector);
                    }
                });
            }
        }
        // Replace `:host` with element tag and add mixin CSS variables.
        styleString = mixinsString + styleString.replace(new RegExp(':host', 'g'), localName);
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styleString;
        styleElement.setAttribute('id', 'io-style-' + localName.replace('io-', ''));
        document.head.appendChild(styleElement);
    }
    /**
    * Helper function to flatten textContent into a single TextNode.
    * Update textContent via TextNode is better for layout performance.
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
    get textNode() {
        this._flattenTextNode(this);
        return this._textNode.nodeValue;
    }
    set textNode(value) {
        this._flattenTextNode(this);
        this._textNode.nodeValue = String(value);
    }
    applyProperties(props) {
        super.applyProperties(props);
        if (props['style']) {
            for (const s in props['style']) {
                this.style[s] = props['style'][s];
            }
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
    labelChanged() {
        if (this.label) {
            this.setAttribute('aria-label', this.label);
        }
        else {
            this.removeAttribute('aria-label');
        }
    }
    disabledChanged() {
        if (this.disabled) {
            this.setAttribute('aria-disabled', this.disabled);
        }
        else {
            this.removeAttribute('aria-disabled');
        }
    }
};
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "tabindex", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoElement.prototype, "contenteditable", void 0);
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "class", void 0);
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "role", void 0);
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "label", void 0);
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "name", void 0);
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "title", void 0);
__decorate([
    Property({ value: '', type: String, reflect: true })
], IoElement.prototype, "id", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoElement.prototype, "hidden", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoElement.prototype, "disabled", void 0);
IoElement = __decorate([
    Register
], IoElement);
export { IoElement };
//# sourceMappingURL=element.js.map