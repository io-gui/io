import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
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
    static get Style(): string;
    src?: IoNumber;
    expanded: boolean;
    role: string;
    static get Listeners(): {
        'ladder-step-change': string;
        'ladder-step-collapse': string;
        'io-focus-to': string;
    };
    get value(): number;
    get min(): number;
    get max(): number;
    get step(): number;
    get conversion(): number;
    constructor(args?: IoNumberLadderProps);
    onIoFocusTo(event: CustomEvent): void;
    _onLadderStepChange(event: CustomEvent): void;
    onLadderStepCollapse(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const IoNumberLadderSingleton: IoNumberLadder;
export {};
//# sourceMappingURL=IoNumberLadderSingleton.d.ts.map