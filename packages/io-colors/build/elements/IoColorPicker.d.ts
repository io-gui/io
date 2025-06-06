import { IoElement, IoElementProps, VDOMElement, WithBinding } from 'io-gui';
export type IoColorPickerProps = IoElementProps & {
    value?: WithBinding<{
        r: number;
        g: number;
        b: number;
        a?: number;
    }>;
};
export declare class IoColorPicker extends IoElement {
    static vConstructor: (arg0?: IoColorPickerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    static get Listeners(): any;
    tabIndex: string;
    get expanded(): boolean;
    init(): void;
    onClick(): void;
    onKeydown(event: KeyboardEvent): void;
    onValueSet(): void;
    onPanelCollapse(): void;
    expand(): void;
    collapse(): void;
    valueChanged(): void;
}
export declare const ioColorPicker: (arg0?: IoColorPickerProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoColorPicker.d.ts.map