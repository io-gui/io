import { IoElement, IoElementProps, NodeArray } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { Tab } from '../nodes/Tab.js';
export type IoTabsProps = IoElementProps & {
    tabs: NodeArray<Tab>;
    addMenuOption?: MenuOption;
};
export declare class IoTabs extends IoElement {
    static get Style(): string;
    tabs: NodeArray<Tab>;
    overflow: number;
    addMenuOption: MenuOption | undefined;
    constructor(args: IoTabsProps);
    tabsMutated(): void;
    onResized(): void;
    changed(): void;
}
export declare const ioTabs: (arg0: IoTabsProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoTabs.d.ts.map