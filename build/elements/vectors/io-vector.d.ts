import { IoElement } from '../../core/element.js';
import '../basic/io-boolicon.js';
/**
 * Input element for vector arrays and objects.
 *
 * <io-element-demo element="io-vector" properties='{"value": {"x": 1, "y": 0.5}, "linkable": false}'></io-element-demo>
 *
 * <io-element-demo element="io-vector" properties='{"value": [0, 0.5, 1], "linkable": true}'></io-element-demo>
 **/
export declare class IoVector extends IoElement {
    static get Style(): string;
    value: {
        x: number;
        y: number;
        z?: number;
        w?: number;
    } | number[];
    conversion: number;
    step: number;
    min: number;
    max: number;
    linkable: boolean;
    linked: boolean;
    ladder: boolean;
    keys: Array<keyof typeof this.value>;
    private _ratios;
    _onNumberPointerDown(event: PointerEvent): void;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    changed(): void;
    getSlotted(): Array<any> | null;
}
//# sourceMappingURL=io-vector.d.ts.map