import { PerspectiveCamera, OrthographicCamera, Group, Mesh } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class CameraExample extends ThreeApplet {
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    cameraRig: Group;
    mesh: Mesh;
    constructor(args: ThreeAppletProps);
    onResized(width: number, height: number): void;
    onAnimate(): void;
}
export declare class IoCameraExample extends IoThreeExample {
    applet: CameraExample;
    ready(): void;
}
export declare const ioCameraExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoCameraExample.d.ts.map