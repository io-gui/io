import { ReactiveElement, VDOMElement, ReactiveElementProps } from '@io-gui/core';
import { Tab } from '../nodes/Tab.js';
import { Panel } from '../nodes/Panel.js';
import { Layout } from '../nodes/Layout.js';
export type IoPanelData = ReactiveElementProps & {
    panel: Panel;
    elements: VDOMElement[];
};
export declare class IoPanel extends ReactiveElement {
    static get Style(): string;
    panel: Panel;
    elements: VDOMElement[];
    static get Listeners(): {
        'io-tab-action': string;
    };
    get layout(): Layout;
    onTabAction(event: CustomEvent): void;
    selectTab(tab: Tab): void;
    focusTabDebounced(index: number): void;
    panelMutated(): void;
    mutated(): void;
}
export declare const ioPanel: (arg0: IoPanelData) => VDOMElement;
