import { ThreeApplet, IoThreeViewport, ThreeAppletProps } from '@io-gui/three';
export declare class GeometryColorsExample extends ThreeApplet {
    constructor(args: ThreeAppletProps);
}
export declare class IoGeometryColorsExample extends IoThreeViewport {
    applet: GeometryColorsExample;
}
export declare const ioGeometryColorsExample: (arg0: any) => import("@io-gui/core").VDOMElement;
