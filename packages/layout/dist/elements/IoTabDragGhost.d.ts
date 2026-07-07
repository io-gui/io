import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { Tab } from '../models/Tab.js';
import { SplitDirection } from '../types/SplitDirection.js';
import { IoPanel } from './IoPanel.js';
import { IoTab } from './IoTab.js';
export type DropTarget = {
    panel: IoPanel;
    panelRect: DOMRect;
    tabs: IoTab[];
    tabRects: DOMRect[];
    dropIndex: number;
    splitDirection: SplitDirection;
};
export type IoTabDragGhostData = ReactiveElementProps & {};
export declare class IoTabDragGhost extends ReactiveElement {
    static get Style(): string;
    model: Tab;
    splitDirection: SplitDirection;
    dropIndex: number;
    expanded: boolean;
    constructor(args: IoTabDragGhostData);
    setDropTarget(target: DropTarget | null): void;
    modelChanged(): void;
}
