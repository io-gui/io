import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuItem, MenuOptions } from 'io-menus';
import { Panel } from '../nodes/Panel.js';
export type IoPanelProps = IoElementProps & {
    panel?: Panel;
    elements?: VDOMElement[];
    addMenuItem?: MenuItem;
};
export declare class IoPanel extends IoElement {
    static vConstructor: (arg0?: IoPanelProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    panel: Panel;
    elements: VDOMElement[];
    options: MenuOptions;
    private addMenuItem;
    init(): void;
    static get Listeners(): {
        'io-edit-tab-item': string;
    };
    onEditTabItem(event: CustomEvent): void;
    selectTabByIndex(index: number): void;
    onMenuItemClicked(event: CustomEvent): void;
    addTab(item: MenuItem, index?: number): void;
    removeTab(item: MenuItem): void;
    optionsMutated(): void;
    panelChanged(): void;
    changed(): void;
}
export declare const ioPanel: (arg0?: IoPanelProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoPanel.d.ts.map