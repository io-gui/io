import { ArrayCamera, Mesh } from 'three/webgpu';
import { ThreeApplet, IoThreeViewport, ThreeAppletProps } from '@io-gui/three';
export declare class CameraArrayExample extends ThreeApplet {
    arrayCamera: ArrayCamera;
    mesh: Mesh;
    constructor(args: ThreeAppletProps);
    onResized(width: number, height: number): void;
    updateCameras(width: number, height: number): void;
    onAnimate(): void;
}
export declare class IoCameraArrayExample extends IoThreeViewport {
    applet: CameraArrayExample;
}
export declare const ioCameraArrayExample: (arg0: any) => import("@io-gui/core").VDOMElement;
