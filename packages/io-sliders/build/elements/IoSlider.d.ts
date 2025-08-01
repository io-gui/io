import { IoGl, IoElementProps, ListenerDefinition, WithBinding } from 'io-gui';
export type IoSliderProps = IoElementProps & {
    value?: WithBinding<number>;
    step?: number;
    min?: number;
    max?: number;
    exponent?: number;
    vertical?: boolean;
    disabled?: boolean;
    noscroll?: boolean;
};
/**
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 **/
export declare class IoSlider extends IoGl {
    #private;
    static get Style(): string;
    value: number;
    step: number;
    min: number;
    max: number;
    exponent: number;
    vertical: boolean;
    invalid: boolean;
    disabled: boolean;
    noscroll: boolean;
    role: string;
    tabIndex: number;
    static get Frag(): string;
    static get Listeners(): {
        focus: string;
        contextmenu: string;
        pointerdown: string;
        touchstart: ListenerDefinition;
    };
    constructor(args?: IoSliderProps);
    onFocus(): void;
    onBlur(): void;
    onContextmenu(event: Event): void;
    onTouchstart(event: TouchEvent): void;
    onTouchmove(event: TouchEvent): void;
    onTouchend(): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    _getPointerCoord(event: PointerEvent): number;
    _getValueFromCoord(coord: number): number;
    onPointermoveThrottled(event: PointerEvent): void;
    _incrementValue(value: number): void;
    _inputValue(value: number): void;
    inputValue(value: any): void;
    onKeydown(event: KeyboardEvent): void;
    ready(): void;
    invalidChanged(): void;
    disabledChanged(): void;
    valueChanged(): void;
    minChanged(): void;
    maxChanged(): void;
}
export declare const ioSlider: (arg0?: IoSliderProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoSlider.d.ts.map