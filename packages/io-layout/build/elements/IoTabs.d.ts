import { IoElement, IoElementProps, NodeArray } from 'io-gui';
import { MenuOption } from 'io-menus';
import { Tab } from '../nodes/Tab.js';
export type IoTabsProps = IoElementProps & {
    tabs: NodeArray<Tab>;
    addMenuOption: MenuOption;
};
export declare class IoTabs extends IoElement {
    static get Style(): string;
    tabs: NodeArray<Tab>;
    overflow: number;
    addMenuOption: MenuOption;
    constructor(args: IoTabsProps);
    tabsMutated(): void;
    onResized(): void;
    changed(): void;
}
export declare const ioTabs: (arg0: IoTabsProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoTabs.d.ts.map