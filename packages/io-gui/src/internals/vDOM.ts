import { EventDispatcher } from './eventDispatcher';
import { IoNode } from '../nodes/node';
import { IoElement } from '../elements/element';

// TODO: Consider making more specific types. Might be too complex.
export type AnyIoArgs = {
  [key: string]: any;
}

export type VDOMElement = {
  name: string,
  props?: AnyIoArgs,
  children?: Array<VDOMElement | null> | string
}

// TODO: Consider expanding support for more attributes.
/**
 * Sets native element's properties. Supported properties:
 * - style: formatted as Object.
 * - class: shorthand for className.
 * - name: for name attribute.
 * - src: for src attribute.
 * - "@" + event: name for event listener.
 * - Any other property: set as property.
 * @param {HTMLElement} element - Native HTMLElement to apply properties to.
 * @param {Object} props - Element properties.
 */
export const applyNativeElementProps = function(element: HTMLElement, props: any) {
  for (const p in props) {
    const prop = props[p];
    if (p === 'style') for (const s in prop) element.style.setProperty(s, prop[s]);
    else if (p === 'class') element['className'] = prop;
    else (element as unknown as IoElement)[p] = prop;
    if (p === 'name') element.setAttribute('name', prop);
    if (p === 'src') element.setAttribute('src', prop);
  }
  if (!(element as unknown as IoElement)._eventDispatcher) {
    Object.defineProperty(element, '_eventDispatcher', {enumerable: false, configurable: true, value: new EventDispatcher(element as unknown as IoNode)});
  }
  (element as unknown as IoElement)._eventDispatcher.applyPropListeners(props);
};

/**
 * Creates an element from a virtual dom object.
 * @param {VDOMElement} vDOMElement - Virtual dom object.
 * @return {HTMLElement} - Created element.
 */
export const constructElement = function(vDOMElement: VDOMElement) {
  // IoElement classes constructed with constructor.
  const ConstructorClass = window.customElements ? window.customElements.get(vDOMElement.name) : null;
  if (ConstructorClass && (ConstructorClass as any)._isIoElement) {
    return new ConstructorClass(vDOMElement.props);
  }
  // Other element classes constructed with document.createElement.
  const element = document.createElement(vDOMElement.name);
  applyNativeElementProps(element, vDOMElement.props);
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
    if (value !== null) {
      attributes[name] = value;
    }
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