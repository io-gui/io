var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { Box3, OrthographicCamera, PerspectiveCamera, Vector3 } from 'three/webgpu';
import { ViewNavigation } from './ViewNavigation.js';
import { cameraAspect, copyProjection, worldPerPixelAt } from '../utils/camera.js';
import { isDescendant } from '../utils/sceneGraph.js';
const UV_BOX = new Box3(new Vector3(0, 0, 0), new Vector3(1, 1, 0));
const _box = new Box3();
const _center = new Vector3();
/**
 * State of one view (ADR-0002): navigation and display settings, independent of any element.
 * An IoThreeViewport shows it; the view survives the element being unmounted or moved.
 */
let ThreeView = class ThreeView extends ReactiveObject {
    navigation = new ViewNavigation();
    _perspective = new PerspectiveCamera();
    _orthographic = new OrthographicCamera();
    _scenePerspective = new PerspectiveCamera();
    _sceneOrthographic = new OrthographicCamera();
    /** Scene camera name `setCameraView` waits for (`''` = first scene camera); null when none is pending. */
    _cameraSourceName = null;
    /** What `setCameraView` asked for by name (`''` = first scene camera), looked for again in each document shown; null otherwise. */
    _cameraRequest = null;
    /** Last scene camera found for `navigation.cameraSource`; reused while it is still in the scene. */
    _sourceCamera = null;
    /** A `cameraSource` uuid not found in the scene; not searched again until the current task ends. */
    _missingSource = null;
    /** Session state: navigation per document uuid, so switching documents back restores the camera. */
    _navigationByDocument = new Map();
    constructor(args) {
        super(args);
    }
    /**
     * Call after changing `navigation` directly, so viewports showing this view redraw. The methods below call
     * it themselves. It dispatches `navigation-changed` to the view's parents (the viewports holding it), not a
     * reactive mutation: navigation runs per pointer move, and inspectors or bindings of the view need not wake.
     */
    markNavigationChanged() {
        this.dispatch('navigation-changed', undefined, true);
    }
    /** Looks through the view's own navigation: an orthographic axis view, or the default perspective view with `free`. */
    setAxisView(axis) {
        this.navigation.cameraSource = null;
        this._cameraSourceName = null;
        this._cameraRequest = null;
        this.navigation.setAxisView(axis);
        this.markNavigationChanged();
        return this;
    }
    /**
     * Looks through a scene camera. `'uuid:<uuid>'` picks a camera by uuid, `'name:<name>'` by name; with no id
     * (or `null`) the first camera found in the scene is used. Names and the first camera resolve to a uuid once
     * a camera is in the scene, so a camera that is still loading is picked up when it is added; until then, or
     * when the scene has no camera, the view shows its own `free` perspective view. An id without a prefix warns
     * and uses the `free` view.
     */
    setCameraView(id = null) {
        this.navigation.cameraSource = null;
        this._cameraSourceName = null;
        this.navigation.setAxisView('free');
        this._cameraRequest = null;
        if (id === null) {
            this._cameraSourceName = this._cameraRequest = '';
        }
        else if (id.startsWith('uuid:')) {
            this.navigation.cameraSource = id.slice(5);
        }
        else if (id.startsWith('name:')) {
            this._cameraSourceName = this._cameraRequest = id.slice(5);
        }
        else {
            console.warn(`ThreeView.setCameraView: "${id}" needs a "uuid:" or "name:" prefix; using the free view`);
        }
        this.markNavigationChanged();
        return this;
    }
    frame(object, padding = 1) {
        if (this.kind === 'uv')
            return this.frameUV();
        this.navigation.frame(object, padding);
        this.markNavigationChanged();
    }
    /** Shows the 0–1 UV square, looking down -Z (2D views). */
    frameUV(padding = 1.05) {
        if (this.navigation.axisView !== 'front')
            this.navigation.setAxisView('front');
        this.navigation.frameBox(UV_BOX, padding);
        this.markNavigationChanged();
    }
    isOverlayEnabled(id, enabledByDefault = true) {
        return this.overlays[id] ?? enabledByDefault;
    }
    setOverlay(id, enabled) {
        this.overlays = { ...this.overlays, [id]: enabled };
    }
    /**
     * Stores the current navigation for `fromDocument` and restores the one saved for `toDocument`,
     * or starts unframed in the same axis view (the viewport then frames the new scene). A view set with
     * `setCameraView()` or `setCameraView('name:…')` looks for that camera in the new document.
     */
    switchDocument(fromDocument, toDocument) {
        if (fromDocument === toDocument)
            return;
        if (fromDocument)
            this._navigationByDocument.set(fromDocument, this.navigation.toJSON());
        const saved = this._navigationByDocument.get(toDocument);
        if (saved) {
            this.navigation.applyJSON(saved);
        }
        else {
            const axisView = this.navigation.axisView;
            this.navigation.copy(new ViewNavigation()).framed = false;
            this.navigation.setAxisView(axisView);
        }
        // A view on the first or a named scene camera looks for it in a document where it has none yet.
        this._cameraSourceName = this._cameraRequest !== null && !this.navigation.cameraSource ? this._cameraRequest : null;
        this.markNavigationChanged();
    }
    /** The scene camera this view looks through, if it is set and present in `scene`. */
    getSourceCamera(scene) {
        if (this._cameraSourceName !== null && scene)
            this._resolveCameraSourceName(scene);
        const uuid = this.navigation.cameraSource;
        if (!uuid || !scene)
            return null;
        // Called several times per draw and per pointer event: avoid walking the scene each time.
        let camera = this._sourceCamera?.uuid === uuid && isDescendant(this._sourceCamera, scene) ? this._sourceCamera : undefined;
        if (!camera) {
            if (this._missingSource === uuid)
                return null;
            camera = scene.getObjectByProperty('uuid', uuid);
            this._sourceCamera = camera ?? null;
            if (!camera) {
                this._missingSource = uuid;
                queueMicrotask(() => { this._missingSource = null; });
            }
        }
        if (camera?.isPerspectiveCamera || camera?.isOrthographicCamera) {
            return camera;
        }
        return null;
    }
    _resolveCameraSourceName(scene) {
        const name = this._cameraSourceName;
        let found;
        scene.traverse(object => {
            if (found)
                return;
            const isCamera = object.isPerspectiveCamera || object.isOrthographicCamera;
            if (isCamera && (!name || object.name === name))
                found = object;
        });
        if (!found)
            return;
        // Resolved while drawing or picking with this camera, so no mutation is dispatched.
        this.navigation.cameraSource = found.uuid;
        this._cameraSourceName = null;
    }
    /**
     * The camera to draw and pick with at this size. Built from state every call; owned by the view.
     * Scene cameras are copied, never mutated (ADR-0005).
     */
    getCamera(width, height, scene) {
        const aspect = width > 0 && height > 0 ? width / height : 1;
        const source = this.getSourceCamera(scene);
        if (source)
            return this._fromSceneCamera(source, aspect);
        const nav = this.navigation;
        let camera;
        if (nav.projection === 'perspective') {
            const perspective = this._perspective;
            // The navigation frames a square; widen the vertical fov when the viewport is taller than wide.
            perspective.fov = 2 * Math.atan(Math.tan(nav.fov * Math.PI / 360) * Math.max(1, 1 / aspect)) * 180 / Math.PI;
            perspective.aspect = aspect;
            perspective.near = nav.near;
            perspective.far = nav.far;
            perspective.zoom = 1 / this.overscan;
            camera = perspective;
        }
        else {
            const orthographic = this._orthographic;
            const half = nav.getHalfHeight() * this.overscan;
            const halfWidth = aspect >= 1 ? half * aspect : half;
            const halfHeight = aspect >= 1 ? half : half / aspect;
            orthographic.left = -halfWidth;
            orthographic.right = halfWidth;
            orthographic.top = halfHeight;
            orthographic.bottom = -halfHeight;
            // Orthographic depth does not shrink with distance; clip symmetrically around the eye.
            orthographic.near = -nav.far;
            orthographic.far = nav.far;
            orthographic.zoom = 1;
            camera = orthographic;
        }
        nav.getPosition(camera.position);
        camera.quaternion.copy(nav.rotation);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        return camera;
    }
    /** World units covered by one CSS pixel at the target (at the scene's centre through a scene camera, which has no target). */
    getWorldPerPixel(width, height, scene) {
        const camera = this.getCamera(width, height, scene);
        let point = this.navigation.target;
        if (scene && this.getSourceCamera(scene)) {
            point = _box.setFromObject(scene).isEmpty() ? camera.localToWorld(_center.set(0, 0, -1)) : _box.getCenter(_center);
        }
        return worldPerPixelAt(camera, point, height);
    }
    _fromSceneCamera(source, aspect) {
        source.updateWorldMatrix(true, false);
        const camera = source.isPerspectiveCamera ? this._scenePerspective : this._sceneOrthographic;
        source.matrixWorld.decompose(camera.position, camera.quaternion, camera.scale);
        copyProjection(source, camera);
        if (camera instanceof PerspectiveCamera) {
            // Fit the source frame inside the viewport.
            camera.aspect = aspect;
            camera.fov = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * Math.max(1, cameraAspect(source) / aspect)) * 180 / Math.PI;
            camera.zoom = source.zoom / this.overscan;
        }
        else {
            const frustumHeight = camera.top - camera.bottom;
            const frustumWidth = camera.right - camera.left;
            const centerX = (camera.left + camera.right) / 2;
            const centerY = (camera.top + camera.bottom) / 2;
            let halfWidth;
            let halfHeight;
            if (frustumWidth / frustumHeight > aspect) {
                halfWidth = frustumWidth / 2;
                halfHeight = frustumWidth / 2 / aspect;
            }
            else {
                halfHeight = frustumHeight / 2;
                halfWidth = frustumHeight / 2 * aspect;
            }
            camera.left = centerX - halfWidth * this.overscan;
            camera.right = centerX + halfWidth * this.overscan;
            camera.top = centerY + halfHeight * this.overscan;
            camera.bottom = centerY - halfHeight * this.overscan;
        }
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        return camera;
    }
    /** Core serializes the primitive settings; the overlay flags, tone mapping overrides (also `null`) and navigation are added. */
    toJSON() {
        return {
            ...super.toJSON(),
            overlays: { ...this.overlays },
            toneMapping: this.toneMapping,
            toneMappingExposure: this.toneMappingExposure,
            navigation: this.navigation.toJSON(),
        };
    }
    applyJSON(data) {
        const { navigation, ...settings } = data;
        if (navigation)
            this.navigation.applyJSON(navigation);
        if (settings.overlays)
            settings.overlays = { ...settings.overlays };
        this.setProperties(settings);
        this.markNavigationChanged();
        return this;
    }
};
__decorate([
    Property({ type: String, value: '3d' })
], ThreeView.prototype, "kind", void 0);
__decorate([
    Property({ type: String, value: '' })
], ThreeView.prototype, "pipeline", void 0);
__decorate([
    Property({ type: Object, init: null })
], ThreeView.prototype, "overlays", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], ThreeView.prototype, "xray", void 0);
__decorate([
    Property({ value: null })
], ThreeView.prototype, "toneMapping", void 0);
__decorate([
    Property({ value: null })
], ThreeView.prototype, "toneMappingExposure", void 0);
__decorate([
    Property({ type: String, value: 'full' })
], ThreeView.prototype, "profile", void 0);
__decorate([
    Property({ type: Number, value: 1.1 })
], ThreeView.prototype, "overscan", void 0);
__decorate([
    Property({ type: Number, value: 0x000000 })
], ThreeView.prototype, "clearColor", void 0);
__decorate([
    Property({ type: Number, value: 1 })
], ThreeView.prototype, "clearAlpha", void 0);
ThreeView = __decorate([
    Register
], ThreeView);
export { ThreeView };
