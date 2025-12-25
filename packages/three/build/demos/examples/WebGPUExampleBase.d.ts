import { OrthographicCamera, PerspectiveCamera, Scene, WebGPURenderer } from 'three/build/three.webgpu.js';
export declare class WebGPUExampleBase {
    scene: Scene;
    camera: PerspectiveCamera | OrthographicCamera;
    initialized: boolean;
    constructor();
    onResized(width: number, height: number): void;
    init(renderer: WebGPURenderer): void;
}
//# sourceMappingURL=WebGPUExampleBase.d.ts.map