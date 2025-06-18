import { IoBoolean } from './IoBoolean.js';
/**
 * Input element for `Boolean` data type displayed as switch.
 **/
export declare class IoSwitch extends IoBoolean {
    static get Style(): string;
    changed(): void;
}
export declare const ioSwitch: (arg0?: import("./IoBoolean.js").IoBooleanProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoSwitch.d.ts.map