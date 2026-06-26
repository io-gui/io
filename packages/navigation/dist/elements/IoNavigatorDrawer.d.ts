import { ReactiveElement, ReactiveElementProps, VDOMElement } from '@io-gui/core';
export type DrawerDirection = 'left' | 'right';
export type IoNavigatorDrawerProps = ReactiveElementProps & {
    direction: DrawerDirection;
    expanded?: boolean;
    menuContent: VDOMElement;
};
export declare class IoNavigatorDrawer extends ReactiveElement {
    static get Style(): string;
    direction: DrawerDirection;
    expanded: boolean;
    menuContent: VDOMElement;
    constructor(args: IoNavigatorDrawerProps);
    static get Listeners(): {
        'io-menu-option-clicked': string;
        'io-menu-tree-resized': string;
    };
    onMenuOptionClicked(): void;
    onMenuTreeResized(): void;
    onClick(event: MouseEvent): void;
    expandedChanged(): void;
    mutated(): void;
    updateDrawerSizeThrottled(): void;
}
export declare const ioNavigatorDrawer: (args: IoNavigatorDrawerProps) => VDOMElement;
