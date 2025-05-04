import { VDOMElement, PropsWithBinding, IoElement, IoElementProps } from 'io-gui';
export type IoFieldProps = IoElementProps & PropsWithBinding<{
    value?: any;
    icon?: string;
    label?: string;
    selected?: boolean;
    disabled?: boolean;
    appearance?: 'neutral' | 'inset' | 'outset';
}>;
export declare class IoField extends IoElement {
    static vConstructor: (arg0?: IoFieldProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: any;
    icon: string;
    label: string;
    selected: boolean;
    invalid: boolean;
    disabled: boolean;
    appearance: 'neutral' | 'inset' | 'outset';
    tabIndex: string;
    constructor(args?: IoFieldProps);
    labelChanged(): void;
    selectedChanged(): void;
    invalidChanged(): void;
    disabledChanged(): void;
    changed(): void;
}
export declare const ioField: (arg0?: IoFieldProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoField.d.ts.map