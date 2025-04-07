import { IoElement, IoElementArgs, VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoNumber } from './io-number';
export type IoNumberLadderArgs = IoElementArgs & ArgsWithBinding<{
    src?: IoNumber;
    expanded?: boolean;
}>;
/**
 * Interactive number ladder.
 * When dragged horizontally, it changes the value in step increments.
 * Dragging speed affects the rate of change exponentially.
 * Up/down arrow keys change the step focus while left/right change the value in step increments.
 * Escape key collapses the ladder and restores the focus to previously focused element.
 * If shift key is pressed, value is rounded to the nearest step incement.
 *
 * <io-element-demo element="io-ladder" expanded properties='{"value": 0, "step": 0.0001, "conversion": 1, "min": -10000, "max": 10000, "expanded": true}'></io-element-demo>
 **/
declare class IoNumberLadder extends IoElement {
    static vConstructor: (arg0?: IoNumberLadderArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    static get Style(): string;
    role: string;
    src?: IoNumber;
    expanded: boolean;
    static get Listeners(): {
        'ladder-step-change': string;
        'ladder-step-collapse': string;
        focusin: string;
    };
    get value(): number;
    get min(): number;
    get max(): number;
    get step(): number;
    get conversion(): number;
    constructor(args?: IoNumberLadderArgs);
    onFocusIn(event: FocusEvent): void;
    onFocusTo(event: CustomEvent): void;
    _onLadderStepChange(event: CustomEvent): void;
    _onLadderStepCollapse(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const IoNumberLadderSingleton: IoNumberLadder;
export {};
//# sourceMappingURL=io-number-ladder.d.ts.map