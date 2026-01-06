import { ArrayCamera, Mesh } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class CameraArrayExample extends ThreeApplet {
    arrayCamera: ArrayCamera;
    mesh: Mesh;
    constructor();
    onResized(width: number, height: number): void;
    updateCameras(width: number, height: number): void;
    onAnimate(): void;
}
//# sourceMappingURL=camera_array.d.ts.map