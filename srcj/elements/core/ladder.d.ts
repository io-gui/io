import { IoElement } from '../../components/io-element.js';
import { IoItem } from './item.js';
export declare class IoLadderStep extends IoItem {
    static get Style(): string;
    static get Properties(): any;
    _onKeydown(event: KeyboardEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    applyAria(): void;
}
export declare class IoLadder extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        'ladder-step-change': string;
        'ladder-step-collapse': string;
        focusin: string;
    };
    get value(): any;
    _onFocusIn(event: FocusEvent): void;
    _onFocusTo(event: CustomEvent): void;
    _onLadderStepChange(event: CustomEvent): void;
    _onLadderStepCollapse(): void;
    srcChanged(): void;
    expandedChanged(): void;
    changed(): void;
}
export declare const IoLadderSingleton: IoLadder;
//# sourceMappingURL=ladder.d.ts.map