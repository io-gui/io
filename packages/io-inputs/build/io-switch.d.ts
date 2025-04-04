import { IoBoolean } from './io-boolean';
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
export declare const ioSwitch: (arg0?: import("./io-boolean").IoBooleanArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-switch.d.ts.map