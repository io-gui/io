import { IoElement } from 'io-gui';
import { MenuOptions } from 'io-menus';
export declare class IoScroller extends IoElement {
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
export declare const ioScroller: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-scroller.d.ts.map