import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuItem, MenuOptions } from 'io-menus';
import { TabData } from './IoTab.js';
export type PanelData = {
    type: 'panel';
    tabs: Array<TabData>;
    flex: string;
    selected: string;
};
export type IoPanelProps = IoElementProps & {
    panel?: PanelData;
    elements?: VDOMElement[];
    addMenuItem?: MenuItem;
};
export declare class IoPanel extends IoElement {
    static vConstructor: (arg0?: IoPanelProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    panel: PanelData;
    elements: VDOMElement[];
    tabs: MenuOptions;
    private addMenuItem;
    tabsMutated(): void;
    panelChanged(): void;
    changed(): void;
}
export declare const ioPanel: (arg0?: IoPanelProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoPanel.d.ts.map