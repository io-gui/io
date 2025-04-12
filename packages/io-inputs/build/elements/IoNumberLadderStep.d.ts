import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './IoInputBase';
export type IoNumberLadderStepArgs = IoInputBaseArgs & ArgsWithBinding<{
    value?: number;
    label?: string;
}>;
export declare class IoNumberLadderStep extends IoInputBase {
    static vConstructor: (arg0?: IoNumberLadderStepArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: number;
    label: string;
    type: string;
    role: string;
    constructor(args?: IoNumberLadderStepArgs);
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioNumberLadderStep: (arg0?: IoNumberLadderStepArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNumberLadderStep.d.ts.map