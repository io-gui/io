import { Box3, Raycaster, Vector2, Vector3 } from 'three/webgpu';
import { projectToPixels } from '../utils/camera.js';
/** Line and point hit radius, in screen pixels. */
export const PICK_RADIUS = 4;
/**
 * Objects that draw something, are visible down from the root, and are not opted out with
 * `userData.selectable = false` (on the object or an ancestor; use it for helpers such as grids).
 */
export function isSelectable(object) {
    const drawable = object;
    if (!(drawable.isMesh || drawable.isPoints || drawable.isLine || drawable.isSprite))
        return false;
    let node = object;
    while (node) {
        if (!node.visible || node.userData.selectable === false)
            return false;
        node = node.parent;
    }
    return true;
}
export function collectSelectable(root, camera, filter) {
    const objects = [];
    root.traverseVisible(object => {
        if (!isSelectable(object))
            return;
        if (camera && !object.layers.test(camera.layers))
            return;
        if (filter && !filter(object))
            return;
        objects.push(object);
    });
    return objects;
}
const _raycaster = new Raycaster();
const _ndc = new Vector2();
const _box = new Box3();
const _corner = new Vector3();
/**
 * Picks with a plain `Raycaster` against the view's draw camera. Box selection tests each object's
 * projected world bounds against the rectangle (approximate: bounds, not drawn pixels).
 * Views that draw stand-ins for document objects (the UV view) pass `root` and `resolve`.
 */
export class RaycastPicker {
    _root;
    _resolve;
    constructor(options = {}) {
        this._root = options.root ?? (host => host.scene);
        this._resolve = options.resolve ?? (object => object);
    }
    pick(host, x, y, filter) {
        const root = this._root(host);
        if (!root)
            return Promise.resolve(null);
        // Picks run from input handlers, between frames: edits since the last draw have not moved matrices yet.
        root.updateMatrixWorld();
        const rect = host.getBoundingClientRect();
        const camera = host.getViewCamera();
        _ndc.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
        _raycaster.setFromCamera(_ndc, camera);
        _raycaster.layers.mask = camera.layers.mask;
        // Raycaster thresholds are world units (default 1); keep line and point hits to a few pixels.
        const threshold = host.view.getWorldPerPixel(rect.width, rect.height, host.scene) * PICK_RADIUS;
        _raycaster.params.Line.threshold = threshold;
        _raycaster.params.Points.threshold = threshold;
        for (const intersection of _raycaster.intersectObject(root, true)) {
            if (!isSelectable(intersection.object))
                continue;
            const object = this._resolve(intersection.object);
            if (!object || (filter && !filter(object)))
                continue;
            return Promise.resolve({ object, uuid: object.uuid, distance: intersection.distance, point: intersection.point });
        }
        return Promise.resolve(null);
    }
    pickRect(host, rect, filter) {
        const root = this._root(host);
        if (!root)
            return Promise.resolve([]);
        root.updateMatrixWorld();
        const bounds = host.getBoundingClientRect();
        const camera = host.getViewCamera();
        const minX = Math.min(rect.x0, rect.x1), maxX = Math.max(rect.x0, rect.x1);
        const minY = Math.min(rect.y0, rect.y1), maxY = Math.max(rect.y0, rect.y1);
        const hits = new Map();
        for (const candidate of collectSelectable(root, camera)) {
            const object = this._resolve(candidate);
            if (!object || hits.has(object.uuid) || (filter && !filter(object)))
                continue;
            _box.setFromObject(candidate, true);
            if (_box.isEmpty())
                continue;
            let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
            let inFront = false;
            for (let i = 0; i < 8; i++) {
                _corner.set((i & 1) ? _box.max.x : _box.min.x, (i & 2) ? _box.max.y : _box.min.y, (i & 4) ? _box.max.z : _box.min.z);
                projectToPixels(camera, _corner, bounds.width, bounds.height, _corner);
                if (_corner.z < -1 || _corner.z > 1)
                    continue;
                inFront = true;
                left = Math.min(left, _corner.x);
                right = Math.max(right, _corner.x);
                top = Math.min(top, _corner.y);
                bottom = Math.max(bottom, _corner.y);
            }
            if (!inFront || right < minX || left > maxX || bottom < minY || top > maxY)
                continue;
            _box.getCenter(_corner);
            hits.set(object.uuid, { object, uuid: object.uuid, distance: _corner.distanceTo(camera.position), point: _corner.clone() });
        }
        return Promise.resolve([...hits.values()]);
    }
}
export const defaultPicker = new RaycastPicker();
