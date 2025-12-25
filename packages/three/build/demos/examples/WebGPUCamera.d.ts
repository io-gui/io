import { PerspectiveCamera, OrthographicCamera, CameraHelper, Group, Mesh } from 'three/build/three.webgpu.js';
import { ThreeState } from 'io-three';
export declare class WebGPUCamera extends ThreeState {
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    cameraRig: Group;
    perspectiveCameraHelper: CameraHelper;
    orthographicCameraHelper: CameraHelper;
    mesh: Mesh;
    constructor();
    onResized(width: number, height: number): void;
    onAnimate(): void;
}
//# sourceMappingURL=WebGPUCamera.d.ts.map