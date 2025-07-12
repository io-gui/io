import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuItem } from 'io-menus';
import { Tab } from '../nodes/Tab.js';
import { Panel } from '../nodes/Panel.js';
import { SplitDirection } from '../nodes/Split.js';
export type IoPanelProps = IoElementProps & {
    panel: Panel;
    elements: VDOMElement[];
    addMenuItem: MenuItem;
};
export declare class IoPanel extends IoElement {
    static get Style(): string;
    panel: Panel;
    elements: VDOMElement[];
    private addMenuItem;
    static get Listeners(): {
        'io-edit-tab': string;
    };
    onEditTab(event: CustomEvent): void;
    init(): void;
    onNewTabClicked(event: CustomEvent): void;
    moveTabToSplit(sourcePanel: IoPanel, tab: Tab, direction: SplitDirection): void;
    selectTab(tab: Tab): void;
    addTab(tab: Tab, index?: number): void;
    removeTab(tab: Tab): void;
    moveTab(tab: Tab, index: number): void;
    focusTabDebounced(index: number): void;
    panelMutated(): void;
    changed(): void;
}
export declare const ioPanel: (arg0: IoPanelProps) => VDOMElement;
//# sourceMappingURL=IoPanel.d.ts.map