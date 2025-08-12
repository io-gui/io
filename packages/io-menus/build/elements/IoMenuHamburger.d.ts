import { NudgeDirection } from 'io-core';
import { IoMenuItem } from './IoMenuItem.js';
export declare class IoMenuHamburger extends IoMenuItem {
    static get Style(): string;
    direction: NudgeDirection;
    changed(): void;
}
export declare const ioMenuHamburger: (arg0?: import("io-core").IoElementProps | Array<import("io-core").VDOMElement | null> | string, arg1?: Array<import("io-core").VDOMElement | null> | string) => import("io-core").VDOMElement;
//# sourceMappingURL=IoMenuHamburger.d.ts.map