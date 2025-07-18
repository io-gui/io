import { IoElement, VDOMElement, IoElementProps } from 'io-gui';
import { MenuOption } from 'io-menus';
import { Tab } from '../nodes/Tab.js';
import { Panel } from '../nodes/Panel.js';
import { SplitDirection } from '../nodes/Split.js';
export type IoPanelProps = IoElementProps & {
    panel: Panel;
    elements: VDOMElement[];
    addMenuOption: MenuOption;
};
export declare class IoPanel extends IoElement {
    static get Style(): string;
    panel: Panel;
    elements: VDOMElement[];
    private addMenuOption;
    static get Listeners(): {
        'io-edit-tab': string;
    };
    onEditTab(event: CustomEvent): void;
    init(): void;
    onNewTabClicked(event: CustomEvent): void;
    selectIndex(index: number): void;
    selectTab(tab: Tab): void;
    moveTabToSplit(sourcePanel: IoPanel, tab: Tab, direction: SplitDirection): void;
    addTab(tab: Tab, index?: number): void;
    removeTab(tab: Tab): void;
    moveTab(tab: Tab, index: number): void;
    focusTabDebounced(index: number): void;
    panelMutated(): void;
    changed(): void;
}
export declare const ioPanel: (arg0: IoPanelProps) => VDOMElement;
//# sourceMappingURL=IoPanel.d.ts.map