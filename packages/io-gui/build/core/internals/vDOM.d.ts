import { VDOMElement, VDOMArray, IoElement } from '../element';
export declare const buildTree: (node: VDOMArray) => VDOMElement | null;
/**
 * Sets element properties.
 * @param {HTMLElement} element - Element to set properties on.
 * @param {Object} props - Element properties.
 */
export declare const applyNativeElementProps: (element: HTMLElement, props: any) => void;
/**
 * Creates an element from a virtual dom object.
 * @param {VDOMElement} vDOMElement - Virtual dom object.
 * @return {HTMLElement} - Created element.
 */
export declare const constructVDOMElement: (vDOMElement: VDOMElement) => HTMLElement;
export declare const disposeElementDeep: (element: IoElement) => void;
type vDOMLike = [string, Record<string, any>, vDOMLike[]];
export declare const toVDOM: (element: IoElement | HTMLElement) => [string, Record<string, any>, vDOMLike[]];
export {};
//# sourceMappingURL=vDOM.d.ts.map