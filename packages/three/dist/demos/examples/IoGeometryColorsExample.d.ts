import { ThreeApplet, IoThreeViewport, ThreeAppletProps } from '@io-gui/three';
export declare class GeometryColorsExample extends ThreeApplet {
    constructor(args: ThreeAppletProps);
}
export declare class IoGeometryColorsExample extends IoThreeViewport {
    applet: GeometryColorsExample;
}
export declare const ioGeometryColorsExample: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
