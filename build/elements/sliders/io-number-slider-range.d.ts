import { IoElement } from '../../core/element.js';
import '../basic/io-number.js';
import './io-slider-range.js';
/**
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 *
 * <io-element-demo element="io-number-slider-range" properties='{"value": [0, 2], "step": 0.05, "min": -1, "max": 2}'></io-element-demo>
 **/
export declare class IoNumberSliderRange extends IoElement {
    static get Style(): string;
    value: [number, number];
    step: number;
    min: number;
    max: number;
    exponent: number;
    conversion: number;
    _onNumberSet(event: CustomEvent): void;
    _onSliderSet(event: CustomEvent): void;
    init(): void;
    changed(): void;
}
//# sourceMappingURL=io-number-slider-range.d.ts.map