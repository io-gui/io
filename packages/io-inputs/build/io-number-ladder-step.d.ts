import { IoField } from 'io-gui';
export declare class IoNumberLadderStep extends IoField {
    static get Style(): string;
    value: number;
    type: string;
    role: string;
    _onKeydown(event: KeyboardEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioNumberLadderStep: (arg0?: import("io-gui").IoNodeArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-number-ladder-step.d.ts.map