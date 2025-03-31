import { IoColorBase } from './io-color-base.js';
import './io-color-sliders.js';
/**
 * Input element for color displayed as a set of sliders.
 *
 * <io-element-demo element="io-color-panel"
 * width= "192px"
 * height= "128px"
 * properties='{"mode": 0, "value": [1, 0.5, 0, 1], "horizontal": true}'
 * config='{"value": ["io-property-editor"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}]}]}
 * '></io-element-demo>
 *
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
export declare class IoColorPanel extends IoColorBase {
    static get Style(): string;
    expanded: boolean;
    vertical: boolean;
    inlayer: boolean;
    static get Listeners(): {
        keydown: string;
    };
    _onKeydown(event: KeyboardEvent): void;
    onValueSet(): void;
    changed(): void;
}
export declare const IoColorPanelSingleton: IoColorPanel;
//# sourceMappingURL=io-color-panel-singleton.d.ts.map