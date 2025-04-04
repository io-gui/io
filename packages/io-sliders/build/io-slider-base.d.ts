import { IoGl, IoGlArgs, VDOMArray, ArgsWithBinding } from 'io-gui';
export type IoSliderBaseArgs = IoGlArgs & ArgsWithBinding<{
    value?: number | [number, number];
    step?: number | [number, number];
    min?: number | [number, number];
    max?: number | [number, number];
    exponent?: number;
    vertical?: boolean;
    noscroll?: boolean;
    tabindex?: '-1' | '0' | '' | '1' | '2' | '3';
}>;
export declare class IoSliderBase extends IoGl {
    static get Style(): string;
    value: number | [number, number];
    step: number | [number, number];
    min: number | [number, number];
    max: number | [number, number];
    exponent: number;
    vertical: boolean;
    noscroll: boolean;
    role: string;
    tabindex: string;
    _startX: number;
    _startY: number;
    _rect: DOMRect | null;
    _active: number;
    get _min(): [number, number];
    get _max(): [number, number];
    get _step(): [number, number];
    get _value(): [number, number];
    static get Listeners(): {
        focus: string;
        contextmenu: string;
        pointerdown: string;
        touchstart: (string | {
            passive: boolean;
        })[];
    };
    onFocus(): void;
    onBlur(): void;
    onContextmenu(event: Event): void;
    onTouchstart(event: TouchEvent): void;
    onTouchmove(event: TouchEvent): void;
    onTouchend(): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    _getPointerCoord(event: PointerEvent): [number, number];
    _getValueFromCoord(coord: [number, number]): [number, number];
    onPointermoveThrottled(event: PointerEvent): void;
    _inputValue(value: [number, number]): void;
    onKeydown(event: KeyboardEvent): void;
    _setIncrease(): void;
    _setDecrease(): void;
    _setMin(): void;
    _setMax(): void;
    _setUp(): void;
    _setDown(): void;
    _setLeft(): void;
    _setRight(): void;
    init(): void;
    changed(): void;
    static vDOM: (arg0?: IoSliderBaseArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
//# sourceMappingURL=io-slider-base.d.ts.map