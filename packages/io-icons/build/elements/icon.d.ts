import { IoElement } from 'io-gui';
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 **/
export declare class IoIcon extends IoElement {
    static get Style(): string;
    icon: string;
    stroke: boolean;
    iconChanged(): void;
}
export declare const ioIcon: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=icon.d.ts.map