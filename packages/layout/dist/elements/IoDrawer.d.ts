import { ReactiveElement, ReactiveElementProps, VDOMElement } from '@io-gui/core';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { IoSplit } from './IoSplit.js';
export type DrawerDirection = 'leading' | 'trailing';
export type DrawerOrientation = 'horizontal' | 'vertical';
export type IoDrawerProps = ReactiveElementProps & {
    orientation: DrawerOrientation;
    direction: DrawerDirection;
    parent: IoSplit;
    child: Split | Panel | null;
    elements: VDOMElement[];
};
export declare class IoDrawer extends ReactiveElement {
    static get Style(): string;
    orientation: 'horizontal' | 'vertical';
    direction: DrawerDirection;
    expanded: boolean;
    parent: IoSplit;
    child: Split | Panel;
    elements: VDOMElement[];
    constructor(args: IoDrawerProps);
    onToggleExpanded(event: MouseEvent): void;
    onStopPropagation(event: MouseEvent): void;
    expandedChanged(): void;
    childMutated(): void;
    mutated(): void;
}
export declare const ioDrawer: (args: IoDrawerProps) => VDOMElement;
