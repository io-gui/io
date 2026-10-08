import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three/webgpu';
export type ViewCamera = PerspectiveCamera | OrthographicCamera;
export declare function copyProjection(source: ViewCamera, target: ViewCamera): void;
/** Width over height of what a camera frames. */
export declare function cameraAspect(camera: ViewCamera): number;
/** World units per CSS pixel at `point`, in a view `height` pixels tall (constant screen size, pick tolerance). */
export declare function worldPerPixelAt(camera: ViewCamera, point: Vector3, height: number): number;
/** Projects a world point to CSS pixels in a view of `width` x `height`; `z` keeps the NDC depth (-1..1 is in front). */
export declare function projectToPixels(camera: ViewCamera, point: Vector3, width: number, height: number, out: Vector3): Vector3;
