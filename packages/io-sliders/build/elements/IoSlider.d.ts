import { IoGl, IoElementProps, Binding, VDOMElement, ListenerDefinition } from 'io-gui';
export type IoSliderProps = IoElementProps & {
    value?: number | Binding<number>;
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
    static vConstructor: (arg0?: IoSliderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
    tabIndex: string;
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
    onKeydown(event: KeyboardEvent): void;
    ready(): void;
    invalidChanged(): void;
    disabledChanged(): void;
    valueChanged(): void;
    minChanged(): void;
    maxChanged(): void;
}
export declare const ioSlider: (arg0?: IoSliderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSlider.d.ts.map