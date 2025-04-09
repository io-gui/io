import { IoElement } from '../elements/IoElement';
export type VDOMElement = {
    name: string;
    props?: Record<string, any>;
    children?: Array<VDOMElement | null> | string;
};
/**
 * Sets native element's properties and attributes.
 * - style: formatted as Object.
 * - class: shorthand for className.
 * - "@" + event: name for event listener.
 * @param {HTMLElement} element - Native HTMLElement to apply properties to.
 * @param {Object} props - Element properties.
 */
export declare const applyNativeElementProps: (element: HTMLElement, props: Record<string, any>) => void;
/**
 * Creates an element from a virtual DOM object.
 * @param {VDOMElement} vDOMElement - Virtual DOM object.
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
 * Used for testing but might be useful for other things.
 * @param {IoElement | HTMLElement} element - Element to convert.
 * @return {VDOMElement} - Virtual dom object.
 */
export declare const toVDOM: (element: IoElement | HTMLElement) => VDOMElement;
//# sourceMappingURL=VDOM.d.ts.map