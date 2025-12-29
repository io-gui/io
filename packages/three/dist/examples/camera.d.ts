import { PerspectiveCamera, OrthographicCamera, Group, Mesh } from 'three/webgpu';
import { ThreeState } from '@io-gui/three';
export declare class CameraExample extends ThreeState {
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    cameraRig: Group;
    mesh: Mesh;
    constructor();
    onResized(width: number, height: number): void;
    onAnimate(): void;
}
//# sourceMappingURL=camera.d.ts.map