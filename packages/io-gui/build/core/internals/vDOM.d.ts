import { IoElement } from '../element';
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
export type AnyIoArgs = {
    [key: string]: any;
};
export type VDOMArray = null | [
    string
] | [
    string,
    AnyIoArgs | VDOMArray[] | string
] | [
    string,
    AnyIoArgs,
    VDOMArray[] | string
];
export type VDOMElement = {
    name: string;
    props: AnyIoArgs;
    children: VDOMElement[] | string;
};
export declare const buildTree: (node: VDOMArray) => VDOMElement | null;
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
export declare const applyNativeElementProps: (element: HTMLElement, props: any) => void;
/**
 * Creates an element from a virtual dom object.
 * @param {VDOMElement} vDOMElement - Virtual dom object.
 * @return {HTMLElement} - Created element.
 */
export declare const constructElement: (vDOMElement: VDOMElement) => HTMLElement;
/**
 * Disposes the element's children.
 * @param {IoElement} element - Element to dispose children of.
 */
export declare const disposeChildren: (element: IoElement) => void;
/**
 * Converts an element to a virtual dom object.
 * NODE: This vDOM contains elements only attributes (not properties).
 * @param {IoElement | HTMLElement} element - Element to convert.
 * @return {VDOMElement} - Virtual dom object.
 */
export declare const toVDOM: (element: IoElement | HTMLElement) => VDOMElement;
//# sourceMappingURL=vDOM.d.ts.map