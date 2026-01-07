import { EventDispatcher } from '../core/EventDispatcher.js';
import { Binding } from '../core/Binding.js';
const defaultPropsMap = new WeakMap();
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
        debug: if (prop instanceof Binding) {
            console.warn(`VDOM: Cannot set binding on "${element.localName}.${_p}"`);
        }
        if (!Object.hasOwn(defaultPropValues, p))
            defaultPropValues[p] = element[p];
        if (p === 'style') {
            for (const s in prop) {
                element.style.setProperty(s, prop[s]);
            }
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
        const p = _p;
        if (!Object.hasOwn(props, p)) {
            element[p] = defaultPropValues[p];
            element.removeAttribute(p);
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
    const props = vDOMElement.props || {};
    // IoElement classes constructed with constructor.
    const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.tag) : null;
    if (ConstructorClass && ConstructorClass.prototype?._isIoElement) {
        return new ConstructorClass(props);
    }
    // Other element classes constructed with document.createElement.
    const element = document.createElement(vDOMElement.tag);
    applyNativeElementProps(element, props);
    return element;
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
            else if (elements[i]._eventDispatcher) {
                elements[i]._eventDispatcher.dispose();
                delete elements[i]._eventDispatcher;
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
const toVDOMChildren = function (htmlCollection) {
    const children = [];
    for (let i = 0; i < htmlCollection.length; i++) {
        children.push(toVDOM(htmlCollection[i]));
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
        children: element.children.length > 0 ? toVDOMChildren(element.children) : element.textContent
    };
};
//# sourceMappingURL=VDOM.js.map