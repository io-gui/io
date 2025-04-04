import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';
export type IoNumberLadderStepArgs = IoInputBaseArgs & ArgsWithBinding<{
    value?: number;
    label?: string;
}>;
export declare class IoNumberLadderStep extends IoInputBase {
    static get Style(): string;
    value: number;
    label: string;
    type: string;
    role: string;
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    init(): void;
    changed(): void;
    static vDOM: (arg0?: IoNumberLadderStepArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioNumberLadderStep: (arg0?: IoNumberLadderStepArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-number-ladder-step.d.ts.map