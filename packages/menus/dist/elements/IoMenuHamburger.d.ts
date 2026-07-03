import { NudgeDirection } from '@io-gui/core';
import { IoMenuItem, IoMenuItemProps } from './IoMenuItem.js';
export declare class IoMenuHamburger extends IoMenuItem {
    static get Style(): string;
    direction: NudgeDirection;
    mutated(): void;
}
export declare const ioMenuHamburger: (arg0: IoMenuItemProps) => import("@io-gui/core").VDOMElement;
