import { ReactiveElement, VDOMElement, ReactiveElementProps } from '@io-gui/core';
import { Panel } from '../models/Panel.js';
export type IoPanelData = ReactiveElementProps & {
    model: Panel;
    elements: VDOMElement[];
};
export declare class IoPanel extends ReactiveElement {
    static get Style(): string;
    model: Panel;
    elements: VDOMElement[];
    static get Listeners(): {
        'io-tab-action': string;
        'io-add-tab-clicked': string;
        'io-panel-tab-selected': string;
    };
    onTabAction(event: CustomEvent): void;
    onPanelTabSelected(event: CustomEvent): void;
    onAddTabClicked(event: CustomEvent): void;
    focusTabDebounced(index: number): void;
    modelMutated(): void;
    mutated(): void;
}
export declare const ioPanel: (arg0: IoPanelData) => VDOMElement;
