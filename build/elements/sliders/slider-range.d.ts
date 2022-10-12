import { IoSlider } from './slider.js';
export declare class IoSliderRange extends IoSlider {
    static get Properties(): any;
    _onPointerdown(event: PointerEvent): void;
    _onPointermoveThrottled(event: PointerEvent): void;
    _inputValue(x: number, y: number): void;
    _onKeydown(event: KeyboardEvent): void;
    _setIncrease(): void;
    _setDecrease(): void;
    _setMin(): void;
    _setMax(): void;
    init(): void;
    changed(): void;
    static get Frag(): string;
}
//# sourceMappingURL=slider-range.d.ts.map