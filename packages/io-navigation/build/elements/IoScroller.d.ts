import { IoElement, IoElementProps, VDOMElement } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoScrollerProps = IoElementProps & {
    options?: MenuOptions;
};
export declare class IoScroller extends IoElement {
    static vConstructor: (arg0?: IoScrollerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    options: MenuOptions;
    private _observer;
    init(): void;
    connectedCallback(): void;
    _onDomMutated(): void;
    optionsMutated(): void;
    _scrollToSelected(): void;
    dispose(): void;
}
export declare const ioScroller: (arg0?: IoScrollerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoScroller.d.ts.map