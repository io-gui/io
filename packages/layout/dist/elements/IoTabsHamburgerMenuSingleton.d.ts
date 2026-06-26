import { NudgeDirection, NodeArray, ReactiveElement, ReactiveElementProps, ListenerDefinition } from '@io-gui/core';
import { Tab } from '../nodes/Tab.js';
export interface IoTabsHamburgerMenuExpandProps {
    source: HTMLElement;
    direction: NudgeDirection;
    tabs: NodeArray<Tab>;
    onEditTab: (event: CustomEvent) => void;
}
declare class IoTabsHamburgerMenu extends ReactiveElement {
    static get Style(): string;
    private tabs;
    private expanded;
    private onEditTab;
    static get Listeners(): {
        touchstart: ListenerDefinition;
        'io-focus-to': string;
        'io-edit-tab': string;
    };
    constructor(args?: ReactiveElementProps);
    stopPropagation(event: TouchEvent): void;
    onIoFocusTo(event: CustomEvent): void;
    onEditTabCapture(event: CustomEvent): void;
    expand(props: IoTabsHamburgerMenuExpandProps): void;
    onExpand(): void;
    mutated(): void;
}
export declare const ioTabsHamburgerMenuSingleton: IoTabsHamburgerMenu;
export {};
