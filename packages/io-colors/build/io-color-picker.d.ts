import { IoElement } from 'io-gui';
export declare class IoColorPicker extends IoElement {
    static get Style(): string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    static get Listeners(): any;
    tabindex: string;
    _onClick(event: FocusEvent): void;
    get expanded(): boolean;
    _onKeydown(event: KeyboardEvent): void;
    _onValueSet(): void;
    toggle(): void;
    expand(): void;
    collapse(): void;
    changed(): void;
}
export declare const ioColorPicker: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-color-picker.d.ts.map