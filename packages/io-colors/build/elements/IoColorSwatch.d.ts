import { IoColorBase } from './IoColorBase';
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
export declare const ioColorSwatch: (arg0?: import("./IoColorBase").IoColorBaseProps | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoColorSwatch.d.ts.map