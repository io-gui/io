import { PerspectiveCamera, WebGPURenderer } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class CameraLogarithmicDepthBufferExample extends ThreeApplet {
    camera: PerspectiveCamera;
    zoompos: number;
    zoomspeed: number;
    minzoomspeed: number;
    mouse: number[];
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(): void;
}
//# sourceMappingURL=camera_logarithmicdepthbuffer.d.ts.map