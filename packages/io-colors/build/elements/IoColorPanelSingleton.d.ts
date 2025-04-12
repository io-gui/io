import { IoColorBase } from './IoColorBase';
/**
 * Input element for color displayed as a set of sliders.
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
declare class IoColorPanel extends IoColorBase {
    static get Style(): string;
    expanded: boolean;
    static get Listeners(): {
        keydown: string;
    };
    onKeydown(event: KeyboardEvent): void;
    onValueInput(): void;
    changed(): void;
}
export declare const IoColorPanelSingleton: IoColorPanel;
export {};
//# sourceMappingURL=IoColorPanelSingleton.d.ts.map