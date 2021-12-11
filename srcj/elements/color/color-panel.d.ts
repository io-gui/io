declare const IoColorPanel_base: {
    new (): {
        [x: string]: any;
        valueMutated(): void;
        modeChanged(): void;
        setValueFromRgb(): void;
        setValueFromHsv(): void;
        setValueFromHsl(): void;
        setValueFromCmyk(): void;
        valueChanged(): void;
    };
    [x: string]: any;
    readonly Properties: any;
    readonly GlUtils: string;
};
export declare class IoColorPanel extends IoColorPanel_base {
    static get Style(): string;
    static get Properties(): any;
    static get Listeners(): {
        keydown: string;
    };
    _onKeydown(event: KeyboardEvent): void;
    changed(): void;
}
export declare const IoColorPanelSingleton: IoColorPanel;
export {};
//# sourceMappingURL=color-panel.d.ts.map