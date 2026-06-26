import { ReactiveElement, ReactiveElementProps, ListenerDefinition } from '@io-gui/core';
export type IoDividerProps = ReactiveElementProps & {
    orientation: 'vertical' | 'horizontal';
};
export declare class IoDivider extends ReactiveElement {
    static get Style(): string;
    pressed: boolean;
    orientation: 'horizontal' | 'vertical';
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
