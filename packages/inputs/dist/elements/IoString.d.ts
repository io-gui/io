import { WithBinding } from '@io-gui/core';
import { IoField, IoFieldProps } from './IoField.js';
export type IoStringProps = IoFieldProps & {
    value?: WithBinding<string>;
    live?: boolean;
    placeholder?: string;
    appearance?: 'neutral' | 'inset' | 'outset';
};
/**
 * Input element for `String` data type.
 **/
export declare class IoString extends IoField {
    static get Style(): string;
    value: string;
    live: boolean;
    placeholder: string;
    appearance: 'neutral' | 'inset' | 'outset';
    contentEditable: string;
    role: string;
    constructor(args?: IoStringProps);
    get textNode(): string | null;
    set textNode(value: string | null);
    _setFromTextNode(): void;
    _setObjectFromTextNodeJSON(): void;
    onBlur(event: FocusEvent): void;
    onPointerup(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    ready(): void;
    valueChanged(): void;
    changed(): void;
}
export declare const ioString: (arg0?: IoStringProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoString.d.ts.map