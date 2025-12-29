import { PerspectiveCamera, WebGPURenderer } from 'three/webgpu';
import { ThreeState } from '@io-gui/three';
export declare class CameraLogarithmicDepthBufferExample extends ThreeState {
    camera: PerspectiveCamera;
    zoompos: number;
    zoomspeed: number;
    minzoomspeed: number;
    mouse: number[];
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onResized(width: number, height: number): void;
    onAnimate(): void;
}
//# sourceMappingURL=camera_logarithmicdepthbuffer.d.ts.map