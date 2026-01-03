import { PerspectiveCamera, OrthographicCamera, Group, Mesh } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class CameraExample extends ThreeApplet {
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    cameraRig: Group;
    mesh: Mesh;
    constructor();
    onResized(width: number, height: number): void;
    onAnimate(): void;
}
//# sourceMappingURL=camera.d.ts.map