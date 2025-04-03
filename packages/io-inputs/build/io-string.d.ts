import { IoField } from './io-field';
/**
 * Input element for `String` data type.
 **/
export declare class IoString extends IoField {
    static get Style(): string;
    live: boolean;
    value: string;
    contenteditable: boolean;
    type: string;
    role: string;
    appearance: 'flush' | 'inset' | 'outset';
    _setFromTextNode(): void;
    _tryParseFromTextNode(): void;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    changed(): void;
    valueChanged(): void;
}
export declare const ioString: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-string.d.ts.map