import { IoElement, IoElementArgs, VDOMArray, ArgsWithBinding } from 'io-gui';
export type IoColorPickerArgs = IoElementArgs & ArgsWithBinding<{
    value?: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
}>;
export declare class IoColorPicker extends IoElement {
    static vConstructor: (arg0?: IoColorPickerArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
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
export declare const ioColorPicker: (arg0?: IoColorPickerArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-color-picker.d.ts.map