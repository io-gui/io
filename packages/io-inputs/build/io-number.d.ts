import { IoElement, IoField } from 'io-gui';
/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
export declare class IoNumber extends IoField {
    static get Style(): string;
    role: string;
    value: number;
    conversion: number;
    step: number;
    min: number;
    max: number;
    ladder: boolean;
    contenteditable: boolean;
    type: string;
    pattern: string;
    inputmode: string;
    spellcheck: string;
    appearance: 'flush' | 'inset' | 'outset';
    private _pointer;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onFocus(event: FocusEvent): void;
    _expandLadder(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    _setFromTextNode(): void;
    init(): void;
    changed(): void;
}
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
export declare class IoNumberLadder extends IoElement {
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
    _onFocusIn(event: FocusEvent): void;
    _onFocusTo(event: CustomEvent): void;
    _onLadderStepChange(event: CustomEvent): void;
    _onLadderStepCollapse(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const IoNumberLadderSingleton: IoNumberLadder;
//# sourceMappingURL=io-number.d.ts.map