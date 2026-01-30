import { ArrayCamera, Mesh } from 'three/webgpu';
import { ThreeApplet, IoThreeViewport } from '@io-gui/three';
export declare class CameraArrayExample extends ThreeApplet {
    arrayCamera: ArrayCamera;
    mesh: Mesh;
    constructor();
    onResized(width: number, height: number): void;
    updateCameras(width: number, height: number): void;
    onAnimate(): void;
}
export declare class IoCameraArrayExample extends IoThreeViewport {
    applet: CameraArrayExample;
}
export declare const ioCameraArrayExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoCameraArrayExample.d.ts.map