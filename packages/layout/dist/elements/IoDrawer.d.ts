import { IoElement, IoElementProps, VDOMElement } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { Split } from '../nodes/Split.js';
import { Panel } from '../nodes/Panel.js';
import { IoSplit } from './IoSplit.js';
export type DrawerDirection = 'leading' | 'trailing';
export type IoDrawerProps = IoElementProps & {
    orientation: 'horizontal' | 'vertical';
    direction: DrawerDirection;
    parent: IoSplit;
    child: Split | Panel | null;
    elements: VDOMElement[];
    addMenuOption?: MenuOption;
};
export declare class IoDrawer extends IoElement {
    static get Style(): string;
    orientation: 'horizontal' | 'vertical';
    direction: DrawerDirection;
    expanded: boolean;
    parent: IoSplit;
    child: Split | Panel;
    elements: VDOMElement[];
    addMenuOption: MenuOption | undefined;
    constructor(args: IoDrawerProps);
    onClick(event: MouseEvent): void;
    expandedChanged(): void;
    childMutated(): void;
    changed(): void;
}
export declare const ioDrawer: (args: IoDrawerProps) => VDOMElement;
//# sourceMappingURL=IoDrawer.d.ts.map