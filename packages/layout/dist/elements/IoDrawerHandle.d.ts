import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { DrawerDirection, DrawerOrientation } from './IoDrawer.js';
export type IoDrawerHandleProps = ReactiveElementProps & {
    orientation: DrawerOrientation;
    direction: DrawerDirection;
    expanded: boolean;
};
export declare class IoDrawerHandle extends ReactiveElement {
    static get Style(): string;
    orientation: DrawerOrientation;
    direction: DrawerDirection;
    expanded: boolean;
    static get Listeners(): {
        click: string;
        contextmenu: string;
    };
    constructor(args: IoDrawerHandleProps);
    onContextmenuDisable(event: MouseEvent): void;
    onClick(event: MouseEvent): void;
    mutated(): void;
}
export declare const ioDrawerHandle: (args: IoDrawerHandleProps) => import("@io-gui/core").VDOMElement;
