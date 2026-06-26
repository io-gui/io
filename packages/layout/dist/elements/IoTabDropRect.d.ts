import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { SplitDirection } from './IoSplit.js';
import { IoPanel } from './IoPanel.js';
declare class IoTabDropRect extends ReactiveElement {
    static get Style(): string;
    dropTarget: IoPanel | null;
    splitDirection: SplitDirection;
    dropIndex: number;
    constructor(args?: ReactiveElementProps);
    mutated(): void;
}
export declare const ioTabDropRectSingleton: IoTabDropRect;
export {};
