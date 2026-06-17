import { EventDispatcher } from '../core/EventDispatcher.js';
import { Binding } from '../core/Binding.js';
export const TEXT_TAG = '#text';
export const normalizeVDOMChildren = function (children) {
    return typeof children === 'string' ? [children] : children;
};
export const createVDOMElement = function (tag, arg0, arg1) {
    const vDOMElement = { tag };
    if (arg0 !== undefined) {
        if (typeof arg0 === 'string') {
            vDOMElement.children = normalizeVDOMChildren(arg0);
        }
        else if (arg0 instanceof Array) {
            vDOMElement.children = arg0;
        }
        else if (typeof arg0 === 'object') {
            vDOMElement.props = arg0;
        }
        if (arg1 !== undefined) {
            vDOMElement.children = normalizeVDOMChildren(arg1);
        }
    }
    return vDOMElement;
};
export const getTextVDOMContent = function (vDOMElement) {
    const first = vDOMElement.children?.[0];
    return typeof first === 'string' ? first : '';
};
export const text = function (content) {
    return { tag: TEXT_TAG, children: [content] };
};
export const isTextVDOM = function (vDOMElement) {
    return vDOMElement.tag === TEXT_TAG;
};
export const getNodeVDOMTag = function (node) {
    return node.nodeType === Node.TEXT_NODE ? TEXT_TAG : node.localName;
};
const defaultPropsMap = new WeakMap();
// TODO: Optimize if possible.
const applyInlineStyleProps = function (element, prop, defaultPropValues) {
    const previousKeys = defaultPropValues.__styleKeys ?? new Set();
    const nextKeys = new Set();
    if (prop) {
        for (const s in prop) {
            element.style.setProperty(s, prop[s]);
            nextKeys.add(s);
        }
    }
    for (const s of previousKeys) {
        if (!nextKeys.has(s))
            element.style.removeProperty(s);
    }
    defaultPropValues.__styleKeys = nextKeys;
};
// TODO: Fix types. Remove any.
/**
 * Sets native element's properties and attributes.
 * - style: formatted as Object.
 * - class: shorthand for className.
 * - "@" + event: name for event listener.
 * @param {HTMLElement} element - Native HTMLElement to apply properties to.
 * @param {Object} props - Element properties.
 */
export const applyNativeElementProps = function (element, props) {
    const defaultPropValues = defaultPropsMap.get(element) || {};
    defaultPropsMap.set(element, defaultPropValues);
    for (const _p in props) {
        const p = _p;
        const prop = props[p];
        if (p === 'key')
            continue;
        debug: if (prop instanceof Binding) {
            console.warn(`VDOM: Cannot set binding on "${element.localName}.${_p}"`);
        }
        if (!Object.hasOwn(defaultPropValues, p))
            defaultPropValues[p] = element[p];
        if (p === 'style') {
            applyInlineStyleProps(element, prop, defaultPropValues);
        }
        else if (p === 'class') {
            element['className'] = prop;
        }
        else if (p.startsWith('data-')) {
            // TODO: Test this!
            if (prop === undefined) {
                element.removeAttribute(p);
            }
            else {
                element.setAttribute(p, prop);
            }
        }
        else {
            if (prop === undefined) {
                element[p] = defaultPropValues[p];
            }
            else {
                element[p] = prop;
            }
        }
        if (prop === undefined)
            element.removeAttribute(p);
        else if (prop === defaultPropValues[p])
            element.removeAttribute(p);
    }
    // Reset properties to defaults if they are not in the props.
    for (const _p in defaultPropValues) {
        if (_p === '__styleKeys')
            continue;
        const p = _p;
        if (!Object.hasOwn(props, p)) {
            if (p === 'style') {
                applyInlineStyleProps(element, undefined, defaultPropValues);
                element.removeAttribute(p);
            }
            else {
                element[p] = defaultPropValues[p];
                element.removeAttribute(p);
            }
        }
    }
    if (!element._eventDispatcher) {
        Object.defineProperty(element, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(element) });
    }
    element._eventDispatcher.applyPropListeners(props);
};
/**
 * Creates an element from a virtual DOM object.
 * @param {VDOMElement} vDOMElement - Virtual DOM object.
 * @return {HTMLElement} - Created element.
 */
export const constructElement = function (vDOMElement) {
    if (isTextVDOM(vDOMElement)) {
        return document.createTextNode(getTextVDOMContent(vDOMElement));
    }
    const props = vDOMElement.props || {};
    let element;
    // IoElement classes constructed with constructor.
    const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.tag) : null;
    if (ConstructorClass && ConstructorClass.prototype?._isIoElement) {
        element = new ConstructorClass(props);
    }
    else {
        // Other element classes constructed with document.createElement.
        element = document.createElement(vDOMElement.tag);
        applyNativeElementProps(element, props);
    }
    if (props.key !== undefined) {
        Object.defineProperty(element, '_vdomKey', { enumerable: false, configurable: true, value: props.key });
    }
    return element;
};
/**
 * Filters out null items from a virtual DOM children array.
 * Returns the same array instance when no null items are present to avoid allocation.
 * @param {Array} vChildren - Array of VDOMElement children with possible null items.
 * @return {Array} - Array of VDOMElement children without null items.
 */
export const filterVDOMElements = function (vChildren) {
    for (let i = 0; i < vChildren.length; i++) {
        const child = vChildren[i];
        if (child === null || typeof child === 'string') {
            const filtered = [];
            for (let j = 0; j < vChildren.length; j++) {
                const item = vChildren[j];
                if (item === null)
                    continue;
                if (typeof item === 'string')
                    filtered.push(text(item));
                else
                    filtered.push(item);
            }
            return filtered;
        }
    }
    return vChildren;
};
/**
 * Disposes EventDispatcher on a native VDOM element.
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
 * @param {IoElement} element - Element to dispose children of.
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
const vDOMAttributes = function (element) {
    const attributes = {};
    for (let i = 0; i < element.attributes.length; i++) {
        const name = element.attributes[i].name;
        const value = element.getAttribute(name);
        if (value !== null)
            attributes[name] = value;
    }
    return attributes;
};
const toVDOMChildNodes = function (childNodes) {
    if (childNodes.length === 0)
        return [];
    const children = [];
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            children.push(text(node.textContent ?? ''));
        }
        else {
            children.push(toVDOM(node));
        }
    }
    return children;
};
/**
 * Converts an element to a virtual dom object.
 * NODE: This vDOM contains elements only attributes (not properties).
 * Used for testing but might be useful for other things.
 * @param {IoElement | HTMLElement} element - Element to convert.
 * @return {VDOMElement} - Virtual dom object.
 */
export const toVDOM = function (element) {
    return {
        tag: element.localName,
        props: vDOMAttributes(element),
        children: element.childNodes.length > 0 ? toVDOMChildNodes(element.childNodes) : undefined
    };
};
