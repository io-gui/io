import { IoElement, IoElementArgs, VDOMElement, ArgsWithBinding } from 'io-gui';
export type IoIconArgs = IoElementArgs & ArgsWithBinding<{
    value?: string;
    stroke?: boolean;
}>;
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter.
 * Custom SVG assets need to be registered with `IoIconsetSingleton`.
 **/
export declare class IoIcon extends IoElement {
    static vConstructor: (arg0?: IoIconArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: string;
    stroke: boolean;
    constructor(args?: IoIconArgs);
    valueChanged(): void;
}
export declare const ioIcon: (arg0?: IoIconArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-icon.d.ts.map