import { NudgeDirection } from '@io-gui/core';
import { IoMenuItem } from './IoMenuItem.js';
export declare class IoMenuHamburger extends IoMenuItem {
    static get Style(): string;
    direction: NudgeDirection;
    mutated(): void;
}
export declare const ioMenuHamburger: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
