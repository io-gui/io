import { IoElement, IoElementProps } from '@io-gui/core';
export type IoIconProps = IoElementProps & {
    value: string;
    stroke?: boolean;
    size?: 'small' | 'medium' | 'large';
};
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter.
 * Custom SVG assets need to be registered with `IconsetSingleton`.
 **/
export declare class IoIcon extends IoElement {
    static get Style(): string;
    value: string;
    stroke: boolean;
    size: 'small' | 'medium' | 'large';
    constructor(args: IoIconProps);
    valueChanged(): void;
}
export declare const ioIcon: (arg0: IoIconProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoIcon.d.ts.map