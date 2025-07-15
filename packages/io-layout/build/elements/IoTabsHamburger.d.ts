import { NodeArray } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { Tab } from '../nodes/Tab.js';
export type IoTabsHamburgerProps = IoFieldProps & {
    tabs: NodeArray<Tab>;
};
export declare class IoTabsHamburger extends IoField {
    static get Style(): string;
    private tabs;
    constructor(args: IoTabsHamburgerProps);
    onClick(): void;
    onEditTab(event: CustomEvent): void;
    changed(): void;
}
export declare const ioTabsHamburger: (arg0: IoTabsHamburgerProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoTabsHamburger.d.ts.map