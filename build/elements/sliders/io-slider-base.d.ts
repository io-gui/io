import { IoGl } from '../../core/gl.js';
export declare class IoSliderBase extends IoGl {
    static get Style(): string;
    value: number | [number, number] | {
        x: number;
        y: number;
    };
    step: number | [number, number] | {
        x: number;
        y: number;
    };
    min: number | [number, number] | {
        x: number;
        y: number;
    };
    max: number | [number, number] | {
        x: number;
        y: number;
    };
    exponent: number;
    vertical: boolean;
    noscroll: boolean;
    role: string;
    tabindex: string;
    lazy: boolean;
    _startX: number;
    _startY: number;
    _active: number;
    _rect: DOMRect | null;
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
    _onFocus(): void;
    _onBlur(): void;
    _onContextmenu(event: Event): void;
    _onTouchstart(event: TouchEvent): void;
    _onTouchmove(event: TouchEvent): void;
    _onTouchend(): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _getPointerCoord(event: PointerEvent): [number, number];
    _getValueFromCoord(coord: [number, number]): [number, number];
    _onPointermoveThrottled(event: PointerEvent): void;
    _inputValue(value: [number, number]): void;
    _onKeydown(event: KeyboardEvent): void;
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
}
//# sourceMappingURL=io-slider-base.d.ts.map