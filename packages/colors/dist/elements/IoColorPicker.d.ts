import { ReactiveElement, ReactiveElementProps, WithBinding, ListenerDefinitions } from '@io-gui/core';
export type IoColorPickerProps = ReactiveElementProps & {
    value: WithBinding<{
        r: number;
        g: number;
        b: number;
        a?: number;
    }>;
};
export declare class IoColorPicker extends ReactiveElement {
    static get Style(): string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    static get Listeners(): ListenerDefinitions;
    tabIndex: number;
    get expanded(): boolean;
    ready(): void;
    onClick(): void;
    onKeydown(event: KeyboardEvent): void;
    onPanelValueInput(): void;
    expand(): void;
    collapse(): void;
    disconnectedCallback(): void;
    valueChanged(): void;
}
export declare const ioColorPicker: (arg0: IoColorPickerProps) => import("@io-gui/core").VDOMElement;
