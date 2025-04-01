import { IoElement } from 'io-gui';
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
    keys: string[];
    private _ratios;
    _onNumberPointerDown(event: PointerEvent): void;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    changed(): void;
    getSlotted(): Array<any> | null;
}
export declare const ioVector: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-vector.d.ts.map