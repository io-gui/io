import { VDOMElement, IoElement, IoElementProps } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { IoPanel } from './IoPanel.js';
import { Split, SplitOrientation } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { Tab } from '../nodes/Tab.js';
export type SplitDirection = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'center';
interface SplitMeasurements {
    splits: HTMLElement[];
    splitSizes: number[];
    splitResize: number[];
}
interface SpaceDistribution {
    fixedSpaceBefore: number;
    fixedSpaceAfter: number;
    flexSpace: number;
    flexCountBefore: number;
    flexCountAfter: number;
}
export type IoSplitProps = IoElementProps & {
    split: Split;
    elements: VDOMElement[];
    addMenuOption?: MenuOption;
};
export declare class IoSplit extends IoElement {
    static get Style(): string;
    split: Split;
    elements: VDOMElement[];
    addMenuOption: MenuOption | undefined;
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-panel-remove': string;
        'io-split-remove': string;
        'io-split-consolidate': string;
    };
    constructor(args: IoSplitProps);
    onDividerMove(event: CustomEvent): void;
    collectSplitMeasurements(orientation: SplitOrientation, rect: DOMRect, dividerSize: number, pointer: {
        clientX: number;
        clientY: number;
    }): SplitMeasurements;
    calculateSpaceDistribution(measurements: SplitMeasurements, index: number): SpaceDistribution;
    applyResizeSizes(measurements: SplitMeasurements, distribution: SpaceDistribution, index: number, totalSpace: number, minSize: number): void;
    onDividerMoveEnd(event: CustomEvent): void;
    onPanelRemove(event: CustomEvent): void;
    onSplitRemove(event: CustomEvent): void;
    ensureFlexGrow(): void;
    onSplitConsolidate(event: CustomEvent): void;
    convertToSplit(panel: Panel, first: Panel, second: Panel, orientation: SplitOrientation): void;
    consolidateChild(childSplit: Split): void;
    moveTabToSplit(sourcePanel: IoPanel, panel: Panel, tab: Tab, direction: SplitDirection): void;
    splitMutated(): void;
    changed(): void;
}
export declare const ioSplit: (arg0: IoSplitProps) => VDOMElement;
export {};
//# sourceMappingURL=IoSplit.d.ts.map