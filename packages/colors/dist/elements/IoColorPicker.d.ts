import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
export type IoColorPickerProps = IoElementProps & {
    value: WithBinding<{
        r: number;
        g: number;
        b: number;
        a?: number;
    }>;
};
export declare class IoColorPicker extends IoElement {
    static get Style(): string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    static get Listeners(): any;
    tabIndex: number;
    get expanded(): boolean;
    ready(): void;
    onClick(): void;
    onKeydown(event: KeyboardEvent): void;
    onValueSet(): void;
    onPanelCollapse(): void;
    expand(): void;
    collapse(): void;
    valueChanged(): void;
}
export declare const ioColorPicker: (arg0: IoColorPickerProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoColorPicker.d.ts.map