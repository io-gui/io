import { Box3, MathUtils, PerspectiveCamera, Quaternion, Spherical, Vector3 } from 'three/webgpu';
import { clipPlanesFromBox } from '../utils/clipPlanesFromBox.js';
export const AXIS_VIEW_DIRECTIONS = {
    top: [0, 1, 0],
    bottom: [0, -1, 0],
    left: [-1, 0, 0],
    right: [1, 0, 0],
    front: [0, 0, 1],
    back: [0, 0, -1],
};
const DEFAULT_DIRECTION = new Vector3(0.5, 0.25, 1).normalize();
const FRAME_OVERFIT = 4;
const POLE_EPSILON = 1e-4;
const MIN_DISTANCE = 1e-6;
const _lookAtCamera = new PerspectiveCamera();
const _box = new Box3();
const _center = new Vector3();
const _size = new Vector3();
const _right = new Vector3();
const _up = new Vector3();
const _forward = new Vector3();
const _corner = new Vector3();
const _offset = new Vector3();
const _spherical = new Spherical();
/**
 * Navigation state of one view, stored as numbers (ADR-0005), modelled on Blender's RegionView3D.
 * The camera used for drawing and picking is built from this state per frame by `ThreeView.getCamera()`.
 */
export class ViewNavigation {
    /** Orbit pivot. */
    target = new Vector3();
    /** View orientation; the view looks down its local -Z. */
    rotation = new Quaternion();
    /** Distance from the target. In orthographic views it also sets the frustum size. */
    distance = 1;
    projection = 'perspective';
    /** Vertical field of view in degrees, for a square viewport. */
    fov = 50;
    near = 0.1;
    far = 1000;
    axisView = null;
    /** `uuid` of a scene camera to look through, or null. */
    cameraSource = null;
    /** False until the view has been framed or restored, so a new view frames its scene once. */
    framed = false;
    constructor() {
        this.setDirection(DEFAULT_DIRECTION);
    }
    /** Orients the view to look at the target from `direction` (pointing from target to eye). */
    setDirection(direction) {
        _lookAtCamera.position.copy(direction);
        _lookAtCamera.quaternion.identity();
        _lookAtCamera.lookAt(0, 0, 0);
        this.rotation.copy(_lookAtCamera.quaternion);
    }
    /** Switches to an orthographic axis view, or back to the default perspective view with `null`. */
    setAxisView(axis) {
        if (axis === this.axisView)
            return;
        if (axis) {
            this.projection = 'orthographic';
            this.setDirection(_corner.fromArray(AXIS_VIEW_DIRECTIONS[axis]));
        }
        else {
            this.projection = 'perspective';
            this.setDirection(DEFAULT_DIRECTION);
        }
        this.axisView = axis;
    }
    /**
     * Turntable orbit around the target: `deltaTheta` turns around world Y, `deltaPhi` tilts toward or away
     * from the poles (radians). Leaves any axis view.
     */
    orbit(deltaTheta, deltaPhi) {
        _offset.set(0, 0, 1).applyQuaternion(this.rotation);
        _spherical.setFromVector3(_offset);
        _spherical.theta += deltaTheta;
        _spherical.phi = MathUtils.clamp(_spherical.phi + deltaPhi, POLE_EPSILON, Math.PI - POLE_EPSILON);
        _offset.setFromSpherical(_spherical);
        this.setDirection(_offset);
        this.axisView = null;
    }
    /** Moves the target in the view plane by screen pixels, so the scene follows the pointer. */
    pan(dx, dy, worldPerPixel) {
        _right.set(1, 0, 0).applyQuaternion(this.rotation);
        _up.set(0, 1, 0).applyQuaternion(this.rotation);
        this.target.addScaledVector(_right, -dx * worldPerPixel).addScaledVector(_up, dy * worldPerPixel);
    }
    /** Scales the distance to the target (> 1 moves away). Perspective clip planes scale along. */
    dolly(factor) {
        const distance = Math.max(this.distance * factor, MIN_DISTANCE);
        const applied = distance / this.distance;
        this.distance = distance;
        if (this.projection === 'perspective') {
            this.near *= applied;
            this.far *= applied;
        }
    }
    getPosition(out) {
        return out.set(0, 0, 1).applyQuaternion(this.rotation).multiplyScalar(this.distance).add(this.target);
    }
    /** Half height of the visible area at the target, for a square viewport. */
    getHalfHeight() {
        return this.distance * Math.tan(this.fov * Math.PI / 360);
    }
    /**
     * Fits `object` into a square viewport without changing the view direction.
     * `padding` > 1 leaves room around the object.
     */
    frame(object, padding = 1) {
        // precise=true: use current morph influences, not unused morph extremes
        _box.setFromObject(object, true);
        if (_box.isEmpty()) {
            // Focusing on a Group, AmbientLight, etc
            _box.setFromCenterAndSize(_center.set(0, 0, 0), _size.set(0.2, 0.2, 0.2));
        }
        _box.getCenter(_center);
        _box.getSize(_size).multiplyScalar(0.5 * padding);
        _box.min.copy(_center).sub(_size);
        _box.max.copy(_center).add(_size);
        _right.set(1, 0, 0).applyQuaternion(this.rotation);
        _up.set(0, 1, 0).applyQuaternion(this.rotation);
        _forward.set(0, 0, -1).applyQuaternion(this.rotation);
        const tanHalfFov = Math.tan(this.fov * Math.PI / 360);
        if (this.projection === 'perspective') {
            let distance = 0;
            for (let i = 0; i < 8; i++) {
                _corner.set((i & 1) ? _box.max.x : _box.min.x, (i & 2) ? _box.max.y : _box.min.y, (i & 4) ? _box.max.z : _box.min.z).sub(_center);
                const x = _corner.dot(_right);
                const y = _corner.dot(_up);
                const z = _corner.dot(_forward);
                distance = Math.max(distance, Math.abs(y) / tanHalfFov - z, Math.abs(x) / tanHalfFov - z);
            }
            this.distance = distance;
        }
        else {
            const halfWidth = Math.abs(_size.x * _right.x) + Math.abs(_size.y * _right.y) + Math.abs(_size.z * _right.z);
            const halfHeight = Math.abs(_size.x * _up.x) + Math.abs(_size.y * _up.y) + Math.abs(_size.z * _up.z);
            this.distance = Math.max(halfWidth, halfHeight) / tanHalfFov;
        }
        this.target.copy(_center);
        this.getPosition(_lookAtCamera.position);
        _lookAtCamera.quaternion.copy(this.rotation);
        const { near, far } = clipPlanesFromBox(_box, _lookAtCamera.position, _lookAtCamera, FRAME_OVERFIT);
        this.near = near;
        this.far = far;
        this.framed = true;
    }
    copy(source) {
        this.applyJSON(source.toJSON());
        return this;
    }
    toJSON() {
        return {
            target: this.target.toArray(),
            rotation: this.rotation.toArray(),
            distance: this.distance,
            projection: this.projection,
            fov: this.fov,
            near: this.near,
            far: this.far,
            axisView: this.axisView,
            cameraSource: this.cameraSource,
            framed: this.framed,
        };
    }
    applyJSON(data) {
        if (data.target)
            this.target.fromArray(data.target);
        if (data.rotation)
            this.rotation.fromArray(data.rotation);
        if (data.distance !== undefined)
            this.distance = data.distance;
        if (data.projection !== undefined)
            this.projection = data.projection;
        if (data.fov !== undefined)
            this.fov = data.fov;
        if (data.near !== undefined)
            this.near = data.near;
        if (data.far !== undefined)
            this.far = data.far;
        if (data.axisView !== undefined)
            this.axisView = data.axisView;
        if (data.cameraSource !== undefined)
            this.cameraSource = data.cameraSource;
        this.framed = data.framed ?? true;
        return this;
    }
}
