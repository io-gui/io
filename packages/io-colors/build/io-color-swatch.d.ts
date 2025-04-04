import { IoColorBase } from './elements/color-base.js';
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
export declare const ioColorSwatch: (arg0?: import("./elements/color-base.js").IoColorBaseArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-color-swatch.d.ts.map