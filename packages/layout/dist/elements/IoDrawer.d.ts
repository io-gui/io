import { ReactiveElement, ReactiveElementProps, VDOMElement } from '@io-gui/core';
import { Split } from '../models/Split.js';
import { Panel } from '../models/Panel.js';
import { IoSplit } from './IoSplit.js';
export type DrawerDirection = 'leading' | 'trailing';
export type DrawerOrientation = 'horizontal' | 'vertical';
export type IoDrawerProps = ReactiveElementProps & {
    orientation: DrawerOrientation;
    direction: DrawerDirection;
    parent: IoSplit;
    model: Split | Panel | null;
    elements: VDOMElement[];
};
export declare class IoDrawer extends ReactiveElement {
    static get Style(): string;
    orientation: 'horizontal' | 'vertical';
    direction: DrawerDirection;
    expanded: boolean;
    parent: IoSplit;
    model: Split | Panel;
    elements: VDOMElement[];
    static get Listeners(): {
        'io-divider-move': string;
        'io-divider-move-end': string;
        'io-drawer-toggle': string;
    };
    get availableSize(): number;
    get maxDrawerSize(): number;
    setDrawerSizeCssVar(size: number): void;
    constructor(args: IoDrawerProps);
    onToggleExpanded(event: MouseEvent): void;
    onDividerMove(event: CustomEvent): void;
    onDividerMoveEnd(event: CustomEvent): void;
    modelMutated(): void;
    mutated(): void;
}
export declare const ioDrawer: (args: IoDrawerProps) => VDOMElement;
