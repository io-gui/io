import { IoBoolean } from './IoBoolean';
/**
 * Input element for `Boolean` data type displayed as switch.
 *
 * <io-element-demo element="io-switch" properties='{"value": true}'></io-element-demo>
 **/
export declare class IoSwitch extends IoBoolean {
    static get Style(): string;
    init(): void;
    valueChanged(): void;
}
export declare const ioSwitch: (arg0?: import("./IoBoolean").IoBooleanArgs | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoSwitch.d.ts.map