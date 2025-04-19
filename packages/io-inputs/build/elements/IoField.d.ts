import { VDOMElement, ArgsWithBinding, IoElement, IoElementArgs } from 'io-gui';
export type IoFieldArgs = IoElementArgs & ArgsWithBinding<{
    value?: any;
    icon?: string;
    label?: string;
    selected?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    tabindex?: '-1' | '0' | '' | '1' | '2' | '3';
    appearance?: 'neutral' | 'inset' | 'outset';
}>;
export declare class IoField extends IoElement {
    static vConstructor: (arg0?: IoFieldArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: any;
    icon: string;
    label: string;
    selected: boolean;
    invalid: boolean;
    disabled: boolean;
    tabindex: string;
    appearance: 'neutral' | 'inset' | 'outset';
    constructor(args?: IoFieldArgs);
    labelChanged(): void;
    selectedChanged(): void;
    invalidChanged(): void;
    disabledChanged(): void;
    changed(): void;
}
export declare const ioField: (arg0?: IoFieldArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoField.d.ts.map