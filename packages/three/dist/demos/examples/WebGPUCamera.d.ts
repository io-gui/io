import { PerspectiveCamera, OrthographicCamera, CameraHelper, Group, Mesh } from 'three/webgpu';
import { ThreeState } from '@io-gui/three';
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