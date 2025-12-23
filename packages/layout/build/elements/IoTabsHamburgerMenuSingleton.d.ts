import { NudgeDirection, NodeArray, VDOMElement, IoElement, IoElementProps, ListenerDefinition } from 'io-core';
import { Tab } from '../nodes/Tab.js';
export interface IoTabsHamburgerMenuExpandProps {
    source: HTMLElement;
    direction: NudgeDirection;
    tabs: NodeArray<Tab>;
    onEditTab: (event: CustomEvent) => void;
}
declare class IoTabsHamburgerMenu extends IoElement {
    static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    private tabs;
    private expanded;
    private onEditTab;
    static get Listeners(): {
        touchstart: ListenerDefinition;
        'io-focus-to': string;
        'io-edit-tab': string;
    };
    constructor(args?: IoElementProps);
    stopPropagation(event: TouchEvent): void;
    onIoFocusTo(event: CustomEvent): void;
    onEditTabCapture(event: CustomEvent): void;
    expand(props: IoTabsHamburgerMenuExpandProps): void;
    onExpand(): void;
    changed(): void;
}
export declare const IoTabsHamburgerMenuSingleton: IoTabsHamburgerMenu;
export {};
//# sourceMappingURL=IoTabsHamburgerMenuSingleton.d.ts.map