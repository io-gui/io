import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuItem, MenuOptions } from 'io-menus';
export type IoTabsProps = IoElementProps & {
    tabs?: MenuOptions;
    addMenuItem?: MenuItem;
};
export declare class IoTabs extends IoElement {
    static vConstructor: (arg0?: IoTabsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    private tabs;
    private addMenuItem;
    init(): void;
    static get Listeners(): {
        'io-edit-tab-item': string;
    };
    onEditTabItem(event: CustomEvent): void;
    selectTabByIndex(index: number): void;
    onMenuItemClicked(event: CustomEvent): void;
    addTab(item: MenuItem): void;
    changed(): void;
}
export declare const ioTabs: (arg0?: IoTabsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoTabs.d.ts.map