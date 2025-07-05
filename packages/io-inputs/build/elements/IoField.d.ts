import { VDOMElement, IoElement, IoElementProps, WithBinding, ListenerDefinitions } from 'io-gui';
export type IoFieldProps = IoElementProps & {
    value?: WithBinding<any>;
    icon?: string;
    label?: string;
    selected?: boolean;
    disabled?: boolean;
    appearance?: 'neutral' | 'inset' | 'outset';
    pattern?: string;
};
export declare class IoField extends IoElement {
    static vConstructor: (arg0?: IoFieldProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: any;
    icon: string;
    label: string;
    selected: boolean;
    invalid: boolean;
    disabled: boolean;
    pressed: boolean;
    appearance: 'neutral' | 'inset' | 'outset';
    pattern: string;
    spellcheck: boolean;
    tabIndex: string;
    static get Listeners(): ListenerDefinitions;
    constructor(args?: IoFieldProps);
    onFocus(event: FocusEvent): void;
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onClick(event?: MouseEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    getCaretPosition(): number;
    setCaretPosition(position?: number): void;
    selectAll(): void;
    labelChanged(): void;
    selectedChanged(): void;
    invalidChanged(): void;
    disabledChanged(): void;
    changed(): void;
}
export declare const ioField: (arg0?: IoFieldProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoField.d.ts.map