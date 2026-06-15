import { IoElement } from '@io-gui/core';
import { IoColorBase } from './IoColorBase.js';
type IoColorPanelSource = IoElement & {
    onPanelValueInput(): void;
};
/**
 * Input element for color displayed as a set of sliders.
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
declare class IoColorPanel extends IoColorBase {
    static get Style(): string;
    expanded: boolean;
    src: IoColorPanelSource | null;
    static get Listeners(): {
        keydown: string;
        'io-focus-to': string;
    };
    expandedChanged(): void;
    onKeydown(event: KeyboardEvent): void;
    onIoFocusTo(event: CustomEvent): void;
    onValueInput(): void;
    changed(): void;
}
export declare const IoColorPanelSingleton: IoColorPanel;
export {};
//# sourceMappingURL=IoColorPanelSingleton.d.ts.map