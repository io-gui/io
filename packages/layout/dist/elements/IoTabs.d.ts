import { ReactiveElement, ReactiveElementProps, NodeArray } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { Tab } from '../nodes/Tab.js';
export type IoTabsProps = ReactiveElementProps & {
    tabs: Array<Tab>;
    addMenuOption?: MenuOption;
};
export declare class IoTabs extends ReactiveElement {
    static get Style(): string;
    tabs: NodeArray<Tab>;
    overflow: number;
    addMenuOption: MenuOption | undefined;
    constructor(args: IoTabsProps);
    tabsMutated(): void;
    onResized(): void;
    mutated(): void;
}
export declare const ioTabs: (arg0: IoTabsProps) => import("@io-gui/core").VDOMElement;
