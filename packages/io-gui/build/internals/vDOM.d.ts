import { IoElement } from '../elements/element';
export type AnyIoArgs = {
    [key: string]: any;
};
export type VDOMElement = {
    name: string;
    props?: AnyIoArgs;
    children?: Array<VDOMElement | null> | string;
};
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