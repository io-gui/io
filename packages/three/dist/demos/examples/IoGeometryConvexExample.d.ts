import { Group } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class GeometryConvexExample extends ThreeApplet {
    group: Group;
    constructor(args: ThreeAppletProps);
    onAnimate(): void;
}
export declare class IoGeometryConvexExample extends IoThreeExample {
    applet: GeometryConvexExample;
    ready(): void;
}
export declare const ioGeometryConvexExample: (arg0?: import("@io-gui/core").ReactiveElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
