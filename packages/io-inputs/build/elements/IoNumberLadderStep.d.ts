import { VDOMElement } from 'io-gui';
import { IoField, IoFieldProps } from './IoField';
export type IoNumberLadderStepProps = IoFieldProps & {
    value?: number;
    label?: string;
};
export declare class IoNumberLadderStep extends IoField {
    static vConstructor: (arg0?: IoNumberLadderStepProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: number;
    label: string;
    role: string;
    constructor(args?: IoNumberLadderStepProps);
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioNumberLadderStep: (arg0?: IoNumberLadderStepProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNumberLadderStep.d.ts.map