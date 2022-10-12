import { IoGl } from '../../core/gl.js';
export declare class IoSlider extends IoGl {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        focus: string;
        contextmenu: string;
        pointerdown: string;
        touchstart: string;
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
    _getPointerCoord(event: PointerEvent): number[];
    _getValueFromCoord(coord: number): number;
    _getCoordFromValue(value: number): number;
    _onPointermoveThrottled(event: PointerEvent): void;
    _inputValue(x: number, y?: number): void;
    _onKeydown(event: KeyboardEvent): void;
    _setIncrease(): void;
    _setDecrease(): void;
    _setMin(): void;
    _setMax(): void;
    init(): void;
    changed(): void;
    static get GlUtils(): string;
    static get Frag(): string;
}
//# sourceMappingURL=slider.d.ts.map