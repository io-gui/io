import { IoElement, IoElementProps, VDOMElement } from 'io-gui';
export type IoIconProps = IoElementProps & {
    value?: string;
    stroke?: boolean;
};
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter.
 * Custom SVG assets need to be registered with `IconsetSingleton`.
 **/
export declare class IoIcon extends IoElement {
    static vConstructor: (arg0?: IoIconProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: string;
    stroke: boolean;
    constructor(args?: IoIconProps);
    valueChanged(): void;
}
export declare const ioIcon: (arg0?: IoIconProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoIcon.d.ts.map