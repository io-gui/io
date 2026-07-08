import { NudgeDirection } from '@io-gui/core';
import { IoOption, IoOptionProps } from './IoOption.js';
export declare class IoMenuHamburger extends IoOption {
    static get Style(): string;
    direction: NudgeDirection;
    mutated(): void;
}
export declare const ioMenuHamburger: (arg0: IoOptionProps) => import("@io-gui/core").VDOMElement;
