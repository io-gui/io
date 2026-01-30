import { IoElement, IoElementProps, VDOMElement } from '@io-gui/core';
export type DrawerDirection = 'left' | 'right';
export type IoNavigatorDrawerProps = IoElementProps & {
    direction: DrawerDirection;
    expanded?: boolean;
    menuContent: VDOMElement;
};
export declare class IoNavigatorDrawer extends IoElement {
    static get Style(): string;
    direction: DrawerDirection;
    expanded: boolean;
    menuContent: VDOMElement;
    constructor(args: IoNavigatorDrawerProps);
    onClick(event: MouseEvent): void;
    expandedChanged(): void;
    changed(): void;
    updateDrawerSizeThrottled(): void;
}
export declare const ioNavigatorDrawer: (args: IoNavigatorDrawerProps) => VDOMElement;
//# sourceMappingURL=IoNavigatorDrawer.d.ts.map