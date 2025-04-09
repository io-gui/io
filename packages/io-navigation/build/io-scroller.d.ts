import { IoElement, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
import { MenuOptions } from 'io-menus';
export type IoScrollerArgs = IoElementArgs & ArgsWithBinding<{
    options?: MenuOptions;
}>;
export declare class IoScroller extends IoElement {
    static vConstructor: (arg0?: IoScrollerArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
export declare const ioScroller: (arg0?: IoScrollerArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-scroller.d.ts.map