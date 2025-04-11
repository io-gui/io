import { EventDispatcher } from './EventDispatcher';
import { Node } from '../nodes/Node';
import { IoElement } from '../elements/IoElement';

export type VDOMElement = {
  name: string,
  props?: Record<string, any>,
  children?: Array<VDOMElement | null> | string
}

const attributes = ['tabindex', 'contenteditable', 'spellcheck', 'autocomplete', 'autocorrect', 'autocapitalize'];

/**
 * Sets native element's properties and attributes.
 * - style: formatted as Object.
 * - class: shorthand for className.
 * - "@" + event: name for event listener.
 * @param {HTMLElement} element - Native HTMLElement to apply properties to.
 * @param {Object} props - Element properties.
 */
export const applyNativeElementProps = function(element: HTMLElement, props: Record<string, any>) {
  for (const p in props) {
    const prop = props[p];
    if (p === 'style') for (const s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else (element as unknown as IoElement)[p] = prop;
    // Set attributes.
    if (attributes.indexOf(p) !== -1) element.setAttribute(p, prop);
    else if (p.startsWith('aria-')) element.setAttribute(p, prop);
    else if (p.startsWith('data-')) element.setAttribute(p, prop);
  }
  if (!(element as unknown as IoElement)._eventDispatcher) {
    Object.defineProperty(element, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(element as unknown as Node)});
  }
  (element as unknown as IoElement)._eventDispatcher.applyPropListeners(props);
};

/**
 * Creates an element from a virtual DOM object.
 * @param {VDOMElement} vDOMElement - Virtual DOM object.
 * @return {HTMLElement} - Created element.
 */
export const constructElement = function(vDOMElement: VDOMElement) {
  const props = vDOMElement.props || {};
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.name) : null;
  if (ConstructorClass && (ConstructorClass as any)._isIoElement) {
    return new ConstructorClass(props);
  }
  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMElement.name);
  applyNativeElementProps(element, props);
  return element;
};

/**
 * Disposes the element's children.
 * @param {IoElement} element - Element to dispose children of.
 */
export const disposeChildren = function(element: IoElement) {
  // NOTE: This rAF ensures that element's change queue is emptied before disposing.
  requestAnimationFrame(() => {
    const elements = [...(element.querySelectorAll('*')), element] as IoElement[];
    for (let i = elements.length; i--;) {
      if (typeof elements[i].dispose === 'function') {
        elements[i].dispose();
      } else if (elements[i]._eventDispatcher) {
        elements[i]._eventDispatcher.dispose();
        delete (elements[i] as any)._eventDispatcher;
      }
    }
  });
};

const vDOMAttributes = function(element: IoElement | HTMLElement): Record<string, any> {
  const attributes: Record<string, any> = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const name = element.attributes[i].name;
    const value = element.getAttribute(name);
    if (value !== null) attributes[name] = value;
  }
  return attributes;
};

const toVDOMChildren = function(htmlCollection: [IoElement | HTMLElement]): VDOMElement[] {
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
export const toVDOM = function(element: IoElement | HTMLElement): VDOMElement {
  return {
    name: element.localName,
    props: vDOMAttributes(element),
    children: element.children.length > 0 ? toVDOMChildren((element as any).children) : element.textContent
  };
};