import { BufferGeometry } from 'three/webgpu';
import { ThreeApplet, IoThreeExample } from '@io-gui/three';
export declare class GeometriesExample extends ThreeApplet {
    geometries: BufferGeometry[];
    constructor();
    onAnimate(): void;
}
export declare class IoGeometriesExample extends IoThreeExample {
    applet: GeometriesExample;
    ready(): void;
}
export declare const ioGeometriesExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoGeometriesExample.d.ts.map