import { IoElement } from '../../core/element.js';
declare const IoColorPanel_base: {
    new (...args: any[]): {
        [x: string]: any;
        valueMutated(): void;
        modeChanged(): void;
        valueFromRgb(): void;
        valueFromHsv(): void;
        valueFromHsl(): void;
        valueFromCmyk(): void;
        valueChanged(): void;
    };
    readonly Properties: any;
    readonly GlUtils: string;
} & typeof IoElement;
export declare class IoColorPanel extends IoColorPanel_base {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        keydown: string;
    };
    _onKeydown(event: KeyboardEvent): void;
    onValueSet(): void;
    changed(): void;
}
export declare const IoColorPanelSingleton: IoColorPanel;
export {};
//# sourceMappingURL=color-panel.d.ts.map