import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three/webgpu';
export function copyProjection(source, target) {
    if (target instanceof PerspectiveCamera && source instanceof PerspectiveCamera) {
        target.fov = source.fov;
        target.aspect = source.aspect;
        target.focus = source.focus;
        target.filmGauge = source.filmGauge;
        target.filmOffset = source.filmOffset;
    }
    else if (target instanceof OrthographicCamera && source instanceof OrthographicCamera) {
        target.left = source.left;
        target.right = source.right;
        target.top = source.top;
        target.bottom = source.bottom;
    }
    target.zoom = source.zoom;
    target.near = source.near;
    target.far = source.far;
    if (source.view)
        target.view = { ...source.view };
    else
        target.clearViewOffset();
    target.updateProjectionMatrix();
}
/** Width over height of what a camera frames. */
export function cameraAspect(camera) {
    if (camera.isPerspectiveCamera)
        return camera.aspect;
    const orthographic = camera;
    return (orthographic.right - orthographic.left) / Math.max(1e-9, orthographic.top - orthographic.bottom);
}
const _toPoint = new Vector3();
const _forward = new Vector3();
/** World units per CSS pixel at `point`, in a view `height` pixels tall (constant screen size, pick tolerance). */
export function worldPerPixelAt(camera, point, height) {
    if (height <= 0)
        return 0;
    if (camera.isPerspectiveCamera) {
        const perspective = camera;
        camera.getWorldDirection(_forward);
        const depth = Math.max(_toPoint.subVectors(point, camera.position).dot(_forward), perspective.near);
        return 2 * depth * Math.tan(perspective.fov * Math.PI / 360) / perspective.zoom / height;
    }
    const orthographic = camera;
    return (orthographic.top - orthographic.bottom) / orthographic.zoom / height;
}
/** Projects a world point to CSS pixels in a view of `width` x `height`; `z` keeps the NDC depth (-1..1 is in front). */
export function projectToPixels(camera, point, width, height, out) {
    out.copy(point).project(camera);
    return out.set((out.x + 1) / 2 * width, (1 - out.y) / 2 * height, out.z);
}
