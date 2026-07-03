import { ReactiveElement, ReactiveElementProps, NodeArray } from '@io-gui/core';
import { Tab } from '../nodes/Tab.js';
export type IoTabsProps = ReactiveElementProps & {
    tabs: Array<Tab>;
};
export declare class IoTabs extends ReactiveElement {
    static get Style(): string;
    tabs: NodeArray<Tab>;
    constructor(args: IoTabsProps);
    tabsMutated(): void;
    mutated(): void;
}
export declare const ioTabs: (arg0: IoTabsProps) => import("@io-gui/core").VDOMElement;
