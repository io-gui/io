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
export declare const ioCameraLogarithmicDepthBufferExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoCameraLogarithmicDepthBufferExample.d.ts.map