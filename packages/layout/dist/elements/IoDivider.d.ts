import { IoElement, IoElementProps, ListenerDefinition } from '@io-gui/core';
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
        touchstart: ListenerDefinition;
    };
    constructor(args: IoDividerProps);
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onPointercancel(event: PointerEvent): void;
    onTouchstart(event: TouchEvent): void;
    onTouchmove(event: TouchEvent): void;
    onTouchend(): void;
}
export declare const ioDivider: (arg0: IoDividerProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoDivider.d.ts.map