import { VDOMElement, PropsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseProps } from './IoInputBase';
export type IoNumberLadderStepProps = IoInputBaseProps & PropsWithBinding<{
    value?: number;
    label?: string;
}>;
export declare class IoNumberLadderStep extends IoInputBase {
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