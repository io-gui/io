import { EventDispatcher } from './eventDispatcher';
import { IoNode } from '../node';
import { VDOMElement, VDOMArray, IoElementArgs, IoElement } from '../element';

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


const isArray = (x: any) => Array.isArray(x);
const isString = (x: any) => typeof x === 'string';
const isElementArgs = (object: IoElementArgs | VDOMArray[] | string | undefined) => {
  return typeof object === 'object' && !Array.isArray(object);
};

const clense = (a: any, b: any) => !b ? a : isString(b[0]) ? [...a, b] : [...a, ...b];

export const buildTree = (node: VDOMArray): VDOMElement | null => {
  if (isArray(node)) {
    if (isElementArgs(node[1])) {
      const vElement: VDOMElement = {
        name: node[0],
        props: node[1] as IoElementArgs,
        children: []
      };
      if (isArray(node[2])) {
        vElement.children = node[2].reduce(clense, []).map(buildTree);
      } else if (isString(node[2])) {
        vElement.children = node[2];
      }
      return vElement;
    } else {
      return buildTree([node[0], {}, node[1] as VDOMArray[]]);
    }
  }
  return null;
};

/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
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
export const constructVDOMElement = function(vDOMElement: VDOMElement) {
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

export const disposeElementDeep = function(element: IoElement) {
  // NOTE: This timeout ensures that element's change queue is emptied before disposing.
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

const superCreateElement = document.createElement;
document.createElement = function(tagName: string, options?: ElementCreationOptions) {
  if (tagName.startsWith('io-')) {
    const constructor = customElements.get(tagName);
    if (constructor) {
      return new constructor();
    } else {
      return superCreateElement.apply(this, [tagName, options]);
    }
  } else  {
    return superCreateElement.apply(this, [tagName, options]);
  }
};

const toVDOMChildren = function(htmlCollection: [IoElement | HTMLElement]): vDOMLike[] {
  const children = [];
  for (let i = 0; i < htmlCollection.length; i++) {
    children.push(toVDOM(htmlCollection[i]));
  }
  return children;
};

const serializeAttributes = function(element: IoElement | HTMLElement): Record<string, any> {
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

type vDOMLike = [string, Record<string, any>, vDOMLike[]];

export const toVDOM = function(element: IoElement | HTMLElement): [string, Record<string, any>, vDOMLike[]] {
  return [
    element.localName,
    serializeAttributes(element),
    element.children.length > 0 ? toVDOMChildren((element as any).children) : element.textContent
  ];
};