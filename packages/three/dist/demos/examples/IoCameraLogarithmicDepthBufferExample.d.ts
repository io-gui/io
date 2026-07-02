import { PerspectiveCamera, WebGPURenderer } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class CameraLogarithmicDepthBufferExample extends ThreeApplet {
    camera: PerspectiveCamera;
    zoompos: number;
    zoomspeed: number;
    minzoomspeed: number;
    mouse: number[];
    constructor(args: ThreeAppletProps);
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(): void;
}
export declare class IoCameraLogarithmicDepthBufferExample extends IoThreeExample {
    applet: CameraLogarithmicDepthBufferExample;
    renderer: WebGPURenderer;
    ready(): void;
    dispose(): void;
}
export declare const ioCameraLogarithmicDepthBufferExample: (arg0: any) => import("@io-gui/core").VDOMElement;
