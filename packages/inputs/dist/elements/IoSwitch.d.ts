import { IoBoolean, IoBooleanProps } from './IoBoolean.js';
/**
 * Input element for `Boolean` data type displayed as switch.
 **/
export declare class IoSwitch extends IoBoolean {
    static get Style(): string;
    changed(): void;
}
export declare const ioSwitch: (arg0?: IoBooleanProps) => import("@io-gui/core").VDOMElement;
