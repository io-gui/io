import { IoElement, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
export type IoColorPickerArgs = IoElementArgs & ArgsWithBinding<{
    value?: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
}>;
export declare class IoColorPicker extends IoElement {
    static vConstructor: (arg0?: IoColorPickerArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    static get Listeners(): any;
    tabindex: string;
    onClick(): void;
    get expanded(): boolean;
    onKeydown(event: KeyboardEvent): void;
    onValueSet(): void;
    toggle(): void;
    onPanelCollapse(): void;
    expand(): void;
    collapse(): void;
    valueChanged(): void;
}
export declare const ioColorPicker: (arg0?: IoColorPickerArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoColorPicker.d.ts.map