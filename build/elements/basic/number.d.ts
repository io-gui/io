import { IoElement } from '../../core/element.js';
import { IoField } from './field.js';
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
    constructor(properties?: Record<string, any>);
    _onPointerdown(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onFocus(event: FocusEvent): void;
    _onBlur(event: FocusEvent): void;
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
export declare class IoNumberLadder extends IoElement {
    static get Style(): string;
    role: string;
    src: any;
    expanded: boolean;
    static get Listeners(): {
        'ladder-step-change': string;
        'ladder-step-collapse': string;
        focusin: string;
    };
    get value(): any;
    get min(): any;
    get max(): any;
    get step(): any;
    get conversion(): any;
    _onFocusIn(event: FocusEvent): void;
    _onFocusTo(event: CustomEvent): void;
    _onLadderStepChange(event: CustomEvent): void;
    _onLadderStepCollapse(): void;
    srcChanged(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const IoNumberLadderSingleton: IoNumberLadder;
//# sourceMappingURL=number.d.ts.map