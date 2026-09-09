import { Box3, Camera, Vector3 } from 'three/webgpu';
export declare function clipPlanesFromBox(box: Box3, cameraPosition: Vector3, camera: Camera, overfit?: number): {
    near: number;
    far: number;
};
