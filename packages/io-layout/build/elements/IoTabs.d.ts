import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuItem, MenuOptions } from 'io-menus';
export type IoTabsProps = IoElementProps & {
    options?: MenuOptions;
    addMenuItem?: MenuItem;
};
export declare class IoTabs extends IoElement {
    static vConstructor: (arg0?: IoTabsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    private options;
    private addMenuItem;
    optionsMutated(): void;
    changed(): void;
}
export declare const ioTabs: (arg0?: IoTabsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoTabs.d.ts.map