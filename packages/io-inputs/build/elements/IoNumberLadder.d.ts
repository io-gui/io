import { IoElement, IoElementProps, VDOMElement, WithBinding } from 'io-gui';
import { IoNumber } from './IoNumber.js';
export type IoNumberLadderProps = IoElementProps & {
    src?: IoNumber;
    expanded?: WithBinding<boolean>;
};
/**
 * Interactive number ladder.
 * When dragged horizontally, it changes the value in step increments.
 * Dragging speed affects the rate of change exponentially.
 * Up/down arrow keys change the step focus while left/right change the value in step increments.
 * Escape key collapses the ladder and restores the focus to previously focused element.
 * If shift key is pressed, value is rounded to the nearest step incement.
 **/
declare class IoNumberLadder extends IoElement {
    static vConstructor: (arg0?: IoNumberLadderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    src?: IoNumber;
    expanded: boolean;
    role: string;
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
    constructor(args?: IoNumberLadderProps);
    onFocusIn(event: FocusEvent): void;
    onFocusTo(event: CustomEvent): void;
    _onLadderStepChange(event: CustomEvent): void;
    _onLadderStepCollapse(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const IoNumberLadderSingleton: IoNumberLadder;
export {};
//# sourceMappingURL=IoNumberLadder.d.ts.map