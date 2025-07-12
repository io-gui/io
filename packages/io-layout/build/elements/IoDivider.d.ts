import { IoElement, IoElementProps } from 'io-gui';
export type IoDividerProps = IoElementProps & {
    orientation: 'vertical' | 'horizontal';
    index: number;
};
export declare class IoDivider extends IoElement {
    static get Style(): string;
    pressed: boolean;
    orientation: 'horizontal' | 'vertical';
    index: number;
    static get Listeners(): {
        pointerdown: string;
    };
    constructor(args: IoDividerProps);
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
}
export declare const ioDivider: (arg0: IoDividerProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoDivider.d.ts.map