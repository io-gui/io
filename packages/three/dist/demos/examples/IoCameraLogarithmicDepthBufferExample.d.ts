import { PerspectiveCamera, WebGPURenderer } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class CameraLogarithmicDepthBufferExample extends ThreeEditor {
    camera: PerspectiveCamera;
    zoompos: number;
    zoomspeed: number;
    minzoomspeed: number;
    mouse: number[];
    constructor(args: ThreeEditorProps);
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(): void;
}
export declare class IoCameraLogarithmicDepthBufferExample extends IoThreeExample {
    editor: CameraLogarithmicDepthBufferExample;
    renderer: WebGPURenderer;
    ready(): void;
    dispose(): void;
}
export declare const ioCameraLogarithmicDepthBufferExample: (arg0: any) => import("@io-gui/core").VDOMElement;
