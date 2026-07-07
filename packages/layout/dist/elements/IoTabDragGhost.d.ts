import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { IoTab } from './IoTab';
import { Tab } from '../models/Tab';
import { IoPanel } from './IoPanel';
import { SplitDirection } from '../models/Layout';
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
