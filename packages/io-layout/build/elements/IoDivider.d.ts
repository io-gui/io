import { VDOMElement, IoElement, IoElementProps } from 'io-gui';
export type IoDividerProps = IoElementProps & {
    direction?: 'row' | 'column';
    index?: number;
};
export declare class IoDivider extends IoElement {
    static vConstructor: (arg0?: IoDividerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    pressed: boolean;
    direction: 'row' | 'column';
    index: number;
    static get Listeners(): {
        pointerdown: string;
    };
    constructor(args?: IoDividerProps);
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
}
export declare const ioDivider: (arg0?: IoDividerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoDivider.d.ts.map