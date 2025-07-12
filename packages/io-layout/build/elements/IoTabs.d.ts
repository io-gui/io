import { IoElement, IoElementProps, NodeArray } from 'io-gui';
import { MenuItem } from 'io-menus';
import { Tab } from '../nodes/Tab.js';
export type IoTabsProps = IoElementProps & {
    tabs: NodeArray<Tab>;
    addMenuItem: MenuItem;
};
export declare class IoTabs extends IoElement {
    static get Style(): string;
    private tabs;
    private addMenuItem;
    constructor(args: IoTabsProps);
    changed(): void;
}
export declare const ioTabs: (arg0: IoTabsProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoTabs.d.ts.map