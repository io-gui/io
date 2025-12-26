import { IoColorBase, IoColorBaseProps } from './IoColorBase.js';
/**
 * Element displaying colored square.
 *
 * <io-element-demo element="io-color-swatch"
 * properties='{"value": [1, 0.5, 0, 1]}'
 * config='{"value": ["io-property-editor"]}
 * '></io-element-demo>
 **/
export declare class IoColorSwatch extends IoColorBase {
    static get Style(): string;
    valueChanged(): void;
}
export declare const ioColorSwatch: (arg0?: IoColorBaseProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoColorSwatch.d.ts.map