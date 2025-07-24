import { IoField, IoFieldProps } from './IoField.js';
export type IoNumberLadderStepProps = IoFieldProps & {
    value: number;
    label: string;
};
export declare class IoNumberLadderStep extends IoField {
    static get Style(): string;
    value: number;
    label: string;
    role: string;
    private startX;
    constructor(args: IoNumberLadderStepProps);
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    ready(): void;
    changed(): void;
}
export declare const ioNumberLadderStep: (arg0?: IoNumberLadderStepProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoNumberLadderStep.d.ts.map