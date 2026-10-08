import type { Object3D } from 'three/webgpu';
/** Whether `object` is `ancestor` or below it. */
export declare function isDescendant(object: Object3D, ancestor: Object3D): boolean;
/** Whether `object` and every ancestor are visible. */
export declare function isShown(object: Object3D): boolean;
