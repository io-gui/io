import { IoElement, IoElementArgs, VDOMArray, ArgsWithBinding } from 'io-gui';
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
    static get Style(): string;
    value: string;
    stroke: boolean;
    valueChanged(): void;
    static vDOM: (arg0?: IoIconArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioIcon: (arg0?: IoIconArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=icon.d.ts.map